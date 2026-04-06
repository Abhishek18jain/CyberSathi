/**
 * pdf.service.js – PDF operations using pdf-lib.
 * All inputs are Buffers (downloaded from Cloudinary or from memory upload).
 */
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');

/**
 * Merge an array of PDF buffers into one PDF.
 * @param {Buffer[]} pdfBuffers
 * @returns {Promise<Buffer>}
 */
async function mergePdfs(pdfBuffers) {
    const mergedPdf = await PDFDocument.create();
    for (const bytes of pdfBuffers) {
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const copied = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copied.forEach((p) => mergedPdf.addPage(p));
    }
    return Buffer.from(await mergedPdf.save());
}

/**
 * Convert image buffers (JPG/PNG) into a single PDF, one page per image.
 * @param {Buffer[]} imageBuffers
 * @returns {Promise<Buffer>}
 */
async function jpgToPdf(imageBuffers) {
    const pdfDoc = await PDFDocument.create();
    const A4_W = 595.28;
    const A4_H = 841.89;

    for (const imgBuf of imageBuffers) {
        const jpegBytes = await sharp(imgBuf).jpeg().toBuffer();
        const img = await pdfDoc.embedJpg(jpegBytes);
        const { width, height } = img.scale(1);
        const scale = Math.min(A4_W / width, A4_H / height);
        const page = pdfDoc.addPage([A4_W, A4_H]);
        page.drawImage(img, {
            x: (A4_W - width * scale) / 2,
            y: (A4_H - height * scale) / 2,
            width: width * scale,
            height: height * scale,
        });
    }
    return Buffer.from(await pdfDoc.save());
}

/**
 * Re-serialise a PDF buffer for basic size reduction.
 * @param {Buffer} pdfBuffer
 * @returns {Promise<Buffer>}
 */
async function compressPdf(pdfBuffer) {
    const pdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    return Buffer.from(await pdf.save({ useObjectStreams: true }));
}

module.exports = { mergePdfs, jpgToPdf, compressPdf };
