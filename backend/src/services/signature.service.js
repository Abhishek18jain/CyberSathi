/**
 * signature.service.js – White-background removal via per-pixel RGBA walk.
 * Pure buffer in → transparent PNG buffer out.
 */
const sharp = require('sharp');

/**
 * Remove white/near-white background pixels.
 * @param {Buffer} inputBuffer
 * @param {number} threshold  0–255 (default 200 = near-white)
 * @returns {Promise<Buffer>} Transparent PNG
 */
async function removeBackground(inputBuffer, threshold = 200) {
    const { data, info } = await sharp(inputBuffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const pixels = new Uint8Array(data);

    for (let i = 0; i < pixels.length; i += channels) {
        const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        if (brightness > threshold) pixels[i + 3] = 0; // make transparent
    }

    return sharp(Buffer.from(pixels), { raw: { width, height, channels } })
        .png()
        .toBuffer();
}

module.exports = { removeBackground };
