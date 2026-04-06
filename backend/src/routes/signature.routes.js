/**
 * signature.routes.js – Transparent PNG via Cloudinary.
 */
const router = require('express').Router();
const upload = require('../middleware/multer');
const { removeBackground } = require('../services/signature.service');
const { uploadBuffer } = require('../utils/cloudinary');

router.post('/generate', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image required' });
    try {
        const threshold = parseInt(req.body.threshold || '200', 10);
        const resultBuffer = await removeBackground(req.file.buffer, threshold);
        const { url } = await uploadBuffer(resultBuffer, {
            folder: 'mp-online-hub/signatures',
            resource_type: 'image',
            format: 'png',
        });
        res.json({ success: true, url });
    } catch (err) {
        console.error('Signature error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /signature/download?url=<cloudinary-url>&name=<filename>
// Proxy: fetches image from Cloudinary server-side and streams it to the browser.
// Avoids cross-origin download attribute restrictions.
router.get('/download', async (req, res) => {
    const { downloadBuffer } = require('../utils/cloudinary');
    const { url, name = 'signature.png' } = req.query;
    if (!url) return res.status(400).json({ success: false, message: 'url query param required' });
    try {
        const buffer = await downloadBuffer(decodeURIComponent(url));
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
        res.setHeader('Content-Length', buffer.length);
        res.send(buffer);
    } catch (err) {
        console.error('Signature proxy download error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
