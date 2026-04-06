/**
 * passport.service.js – Generates a standard A4 passport photo sheet.
 *
 * Features:
 *  - Indian standard: 35 mm × 45 mm @ 300 dpi (413 × 531 px)
 *  - True A4 canvas: 2480 × 3508 px @ 300 dpi
 *  - Tight grid with 3 mm cutting guide lines
 *  - Optional background removal via remove.bg API → replaced with white
 */
const sharp = require('sharp');
const axios = require('axios');
const FormData = require('form-data');        // built-in Node.js FormData (available via axios)

// ── Indian passport photo standard (35 × 45 mm @ 300 dpi) ───────────────────
const PHOTO_W = 413;
const PHOTO_H = 531;

// ── A4 @ 300 dpi ─────────────────────────────────────────────────────────────
const A4_W = 2480;
const A4_H = 3508;

// ── Layout ───────────────────────────────────────────────────────────────────
const MARGIN = 59;   // 5 mm margin on each side
const GAP = 35;   // 3 mm gap between photos (for cutting guides)
const GUIDE_W = 2;    // cutting guide line thickness

const MAX_COLS = Math.floor((A4_W - 2 * MARGIN + GAP) / (PHOTO_W + GAP)); // 5
const MAX_ROWS = Math.floor((A4_H - 2 * MARGIN + GAP) / (PHOTO_H + GAP)); // 6

// ── Background Removal ───────────────────────────────────────────────────────

/**
 * Remove the background of an image using remove.bg API.
 * Returns a PNG buffer with transparent background.
 * @param {Buffer} inputBuffer
 * @returns {Promise<Buffer>}  PNG with transparent BG
 */
async function removeBgViaApi(inputBuffer) {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) throw new Error('REMOVE_BG_API_KEY is not set in environment variables');

    const fd = new FormData();
    fd.append('image_file', inputBuffer, { filename: 'photo.jpg', contentType: 'image/jpeg' });
    fd.append('size', 'auto');

    const response = await axios.post('https://api.remove.bg/v1.0/removebg', fd, {
        headers: {
            ...fd.getHeaders(),
            'X-Api-Key': apiKey,
        },
        responseType: 'arraybuffer',
        timeout: 30000,
    });

    return Buffer.from(response.data);
}

/**
 * Remove background and composite result on a solid white background,
 * then resize to exact passport dimensions.
 * @param {Buffer} inputBuffer
 * @returns {Promise<Buffer>}  JPEG/PNG ready for tiling
 */
async function preparePhotoWithWhiteBg(inputBuffer) {
    const transparentPng = await removeBgViaApi(inputBuffer);

    // Composite the transparent-BG photo over white
    return sharp({
        create: {
            width: PHOTO_W,
            height: PHOTO_H,
            channels: 3,
            background: { r: 255, g: 255, b: 255 },
        },
    })
        .composite([{
            input: await sharp(transparentPng)
                .resize(PHOTO_W, PHOTO_H, { fit: 'cover', position: 'centre' })
                .png()
                .toBuffer(),
            blend: 'over',
        }])
        .png()
        .toBuffer();
}

// ── Cutting Guides SVG ────────────────────────────────────────────────────────

function buildGuidesSVG(cols, rows) {
    const lines = [];
    const x0 = MARGIN;
    const y0 = MARGIN;
    const totalW = cols * (PHOTO_W + GAP) - GAP;
    const totalH = rows * (PHOTO_H + GAP) - GAP;

    for (let c = 0; c <= cols; c++) {
        const x = c === 0 ? x0 : x0 + c * (PHOTO_W + GAP) - Math.floor(GAP / 2);
        lines.push(
            `<line x1="${x}" y1="${y0 - MARGIN / 2}" x2="${x}" y2="${y0 + totalH + MARGIN / 2}"
             stroke="#aaaaaa" stroke-width="${GUIDE_W}" stroke-dasharray="20,15"/>`
        );
    }
    for (let r = 0; r <= rows; r++) {
        const y = r === 0 ? y0 : y0 + r * (PHOTO_H + GAP) - Math.floor(GAP / 2);
        lines.push(
            `<line x1="${x0 - MARGIN / 2}" y1="${y}" x2="${x0 + totalW + MARGIN / 2}" y2="${y}"
             stroke="#aaaaaa" stroke-width="${GUIDE_W}" stroke-dasharray="20,15"/>`
        );
    }

    return Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${A4_W}" height="${A4_H}">${lines.join('')}</svg>`
    );
}

// ── Main Export ───────────────────────────────────────────────────────────────

/**
 * Generate a passport photo sheet.
 * @param {Buffer} inputBuffer  Raw uploaded image
 * @param {number} count        Number of photos to tile (1–30)
 * @param {boolean} removeBg    If true, remove background via remove.bg API
 * @returns {Promise<Buffer>}   PNG buffer of the A4 sheet
 */
async function generatePassportPhoto(inputBuffer, count = 8, removeBg = false) {
    const safeCount = Math.min(Math.max(1, count), MAX_COLS * MAX_ROWS);

    // Step 1 – prepare the single passport photo (with optional BG removal)
    let photoBuffer;
    if (removeBg) {
        // BG removed + white background + resize
        photoBuffer = await preparePhotoWithWhiteBg(inputBuffer);
    } else {
        // Plain resize only
        photoBuffer = await sharp(inputBuffer)
            .resize(PHOTO_W, PHOTO_H, { fit: 'cover', position: 'centre' })
            .png()
            .toBuffer();
    }

    const cols = Math.min(safeCount, MAX_COLS);
    const rows = Math.ceil(safeCount / cols);

    // Step 2 – build composite list
    const composites = [];

    composites.push({ input: buildGuidesSVG(cols, rows), top: 0, left: 0 });

    for (let i = 0; i < safeCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        composites.push({
            input: photoBuffer,
            left: MARGIN + col * (PHOTO_W + GAP),
            top: MARGIN + row * (PHOTO_H + GAP),
        });
    }

    // Step 3 – render on A4 white canvas
    return sharp({
        create: {
            width: A4_W,
            height: A4_H,
            channels: 3,
            background: { r: 255, g: 255, b: 255 },
        },
    })
        .composite(composites)
        .png({ compressionLevel: 8 })
        .toBuffer();
}

module.exports = { generatePassportPhoto, MAX_PHOTOS: MAX_COLS * MAX_ROWS };
