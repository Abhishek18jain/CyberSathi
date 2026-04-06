/**
 * compress.routes.js – Memory buffer → compress → Cloudinary URL.
 */
const router = require('express').Router();
const upload = require('../middleware/multer');
const { compressImage, compressRawPdf } = require('../services/compress.service');
const { uploadBuffer } = require('../utils/cloudinary');
const path = require('path');

router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'File required' });

    const targetKB = parseInt(req.body.targetKB || '100', 10);
    const ext = path.extname(req.file.originalname).toLowerCase();

    try {
        let resultBuffer, resourceType, format, originalSizeKB, finalSizeKB;
        originalSizeKB = Math.round(req.file.size / 1024);

        if (ext === '.pdf') {
            resultBuffer = await compressRawPdf(req.file.buffer);
            resourceType = 'raw';
            format = 'pdf';
            finalSizeKB = Math.round(resultBuffer.length / 1024);
        } else {
            const result = await compressImage(req.file.buffer, targetKB);
            resultBuffer = result.buffer;
            finalSizeKB = result.finalSizeKB;
            resourceType = 'image';
            format = 'jpg';
        }

        const { url } = await uploadBuffer(resultBuffer, {
            folder: 'mp-online-hub/compressed',
            resource_type: resourceType,
            format,
        });

        res.json({ success: true, url, originalSizeKB, finalSizeKB, targetKB });
    } catch (err) {
        console.error('Compress error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
