/**
 * passport.routes.js – Buffer-in → Cloudinary URL out.
 */
const router = require('express').Router();
const upload = require('../middleware/multer');
const { generatePassportPhoto } = require('../services/passport.service');
const { uploadBuffer } = require('../utils/cloudinary');

router.post('/generate', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image file required' });

    try {
        const count = parseInt(req.body.count || '8', 10);
        const removeBg = req.body.removeBg === 'true';
        const resultBuffer = await generatePassportPhoto(req.file.buffer, count, removeBg);

        // Upload processed PNG to Cloudinary
        const { url } = await uploadBuffer(resultBuffer, {
            folder: 'mp-online-hub/passport',
            resource_type: 'image',
            format: 'png',
        });

        res.json({ success: true, url, count });
    } catch (err) {
        console.error('Passport error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
