/**
 * compress.service.js – Accepts any image format (JPG, PNG, WebP, HEIC, AVIF…)
 * and iteratively compresses it to a target KB size using Sharp in-memory.
 *
 * Fix: previously called sharp().metadata() before converting the format, which
 * fails for WebP/HEIC/AVIF files with "unsupported image format". Now we convert
 * to JPEG first, then squeeze quality.
 */
const sharp = require('sharp');

/**
 * Compress image buffer (any supported format) to ≤ targetKB as JPEG.
 * @param {Buffer} inputBuffer
 * @param {number} targetKB   e.g. 20 | 50 | 100
 * @returns {Promise<{ buffer: Buffer, finalSizeKB: number }>}
 */
async function compressImage(inputBuffer, targetKB) {
    const targetBytes = targetKB * 1024;

    // 1. Convert to JPEG at high quality first (handles WebP, PNG, HEIC, AVIF, etc.)
    const jpegBase = await sharp(inputBuffer)
        .rotate()               // auto-rotate from EXIF
        .jpeg({ quality: 90 })
        .toBuffer();

    // 2. Grab dimensions from the converted JPEG (always works)
    const { width } = await sharp(jpegBase).metadata();

    // 3. If already within limit, return immediately
    if (jpegBase.length <= targetBytes) {
        return { buffer: jpegBase, finalSizeKB: Math.round(jpegBase.length / 1024) };
    }

    // 4. Quality-reduction loop
    let buffer = jpegBase;
    let quality = 80;
    let attempts = 0;

    while (buffer.length > targetBytes && quality > 5 && attempts < 25) {
        buffer = await sharp(jpegBase)
            .jpeg({ quality: Math.max(1, quality) })
            .toBuffer();
        quality = Math.max(5, quality - 5);
        attempts++;
    }

    // 5. If quality reduction alone wasn't enough, progressively downscale
    if (buffer.length > targetBytes && width) {
        let scale = 0.85;
        while (buffer.length > targetBytes && scale > 0.15) {
            buffer = await sharp(jpegBase)
                .resize(Math.max(1, Math.floor(width * scale)))
                .jpeg({ quality: 55 })
                .toBuffer();
            scale = Math.max(0.1, scale - 0.1);
        }
    }

    return { buffer, finalSizeKB: Math.round(buffer.length / 1024) };
}

/**
 * Re-serialise a PDF buffer for basic size reduction via pdf-lib.
 * @param {Buffer} inputBuffer
 * @returns {Promise<Buffer>}
 */
async function compressRawPdf(inputBuffer) {
    const { PDFDocument } = require('pdf-lib');
    const pdf = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
    return Buffer.from(await pdf.save({ useObjectStreams: true }));
}

module.exports = { compressImage, compressRawPdf };
