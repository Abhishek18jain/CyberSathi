/**
 * pdf.routes.js – All PDF operations; files arrive as memory buffers, output → Cloudinary.
 */
const router = require('express').Router();
const upload = require('../middleware/multer');
const { mergePdfs, jpgToPdf, compressPdf } = require('../services/pdf.service');
const { uploadBuffer, downloadBuffer } = require('../utils/cloudinary');

// POST /pdf/merge  — multiple PDFs (field: "pdfs")
router.post('/merge', upload.array('pdfs', 20), async (req, res) => {
    if (!req.files || req.files.length < 2)
        return res.status(400).json({ success: false, message: 'At least 2 PDFs required' });
    try {
        const buffers = req.files.map((f) => f.buffer);
        const merged = await mergePdfs(buffers);
        const { url } = await uploadBuffer(merged, { folder: 'mp-online-hub/pdf', resource_type: 'raw', format: 'pdf' });
        res.json({ success: true, url, pages: req.files.length });
    } catch (err) {
        console.error('PDF merge error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /pdf/jpg-to-pdf  — multiple images (field: "images")
router.post('/jpg-to-pdf', upload.array('images', 20), async (req, res) => {
    if (!req.files || req.files.length === 0)
        return res.status(400).json({ success: false, message: 'At least 1 image required' });
    try {
        const buffers = req.files.map((f) => f.buffer);
        const pdf = await jpgToPdf(buffers);
        const { url } = await uploadBuffer(pdf, { folder: 'mp-online-hub/pdf', resource_type: 'raw', format: 'pdf' });
        res.json({ success: true, url, pages: req.files.length });
    } catch (err) {
        console.error('JPG-to-PDF error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /pdf/compress  — single PDF (field: "pdf")
router.post('/compress', upload.single('pdf'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'PDF required' });
    try {
        const originalSizeKB = Math.round(req.file.size / 1024);
        const compressed = await compressPdf(req.file.buffer);
        const finalSizeKB = Math.round(compressed.length / 1024);
        const { url } = await uploadBuffer(compressed, { folder: 'mp-online-hub/pdf', resource_type: 'raw', format: 'pdf' });
        res.json({ success: true, url, originalSizeKB, finalSizeKB });
    } catch (err) {
        console.error('PDF compress error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /pdf/from-session  — merge PDFs uploaded via QR session (by Cloudinary URLs)
router.post('/from-session', async (req, res) => {
    const { urls } = req.body; // array of Cloudinary PDF URLs
    if (!urls || urls.length < 1)
        return res.status(400).json({ success: false, message: 'No URLs provided' });
    try {
        const buffers = await Promise.all(urls.map(downloadBuffer));
        const merged = await mergePdfs(buffers);
        const { url } = await uploadBuffer(merged, { folder: 'mp-online-hub/pdf', resource_type: 'raw', format: 'pdf' });
        res.json({ success: true, url });
    } catch (err) {
        console.error('PDF from-session error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /pdf/download?url=<cloudinary-url>&name=<filename>
// Proxy: fetches PDF from Cloudinary server-side and streams it to the browser.
// Avoids the 401 / CORS issues that occur when the browser hits Cloudinary raw URLs directly.
router.get('/download', async (req, res) => {
    const { url, name = 'document.pdf' } = req.query;
    if (!url) return res.status(400).json({ success: false, message: 'url query param required' });

    try {
        const buffer = await downloadBuffer(decodeURIComponent(url));
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
        res.setHeader('Content-Length', buffer.length);
        res.send(buffer);
    } catch (err) {
        console.error('PDF proxy download error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
