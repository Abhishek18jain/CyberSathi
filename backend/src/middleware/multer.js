/**
 * multer.js – Memory-storage multer config.
 * Files never touch disk — buffers are passed directly to Cloudinary.
 */
const multer = require('multer');

// Use memory storage; req.file.buffer holds raw bytes
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max (PDFs can be large)
});

module.exports = upload;
