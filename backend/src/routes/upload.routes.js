/**
 * upload.routes.js
 */
const router = require('express').Router();
const upload = require('../middleware/multer');
const { uploadFile } = require('../controllers/upload.controller');

// POST /upload/:sessionId  — customer mobile upload
router.post('/:sessionId', upload.single('file'), uploadFile);

module.exports = router;
