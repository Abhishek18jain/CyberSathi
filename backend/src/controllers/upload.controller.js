/**
 * upload.controller.js – Mobile customer file upload → Cloudinary → notify dashboard.
 */
const sessionService = require('../services/session.service');
const { uploadBuffer } = require('../utils/cloudinary');
const { getIO } = require('../utils/socket');

async function uploadFile(req, res) {
    try {
        const { sessionId } = req.params;
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const session = sessionService.getSession(sessionId);
        if (!session) return res.status(404).json({ success: false, message: 'Session not found or expired' });

        // Determine Cloudinary resource type
        const isPdf = req.file.mimetype === 'application/pdf';
        const resourceType = isPdf ? 'raw' : 'image';

        // Upload to Cloudinary
        const { url, publicId } = await uploadBuffer(req.file.buffer, {
            folder: `mp-online-hub/sessions/${sessionId}`,
            resource_type: resourceType,
        });

        const fileInfo = {
            filename: publicId.split('/').pop(),
            originalname: req.file.originalname,
            url,
            publicId,
            size: req.file.size,
            mimetype: req.file.mimetype,
            uploadedAt: new Date().toISOString(),
        };

        const updatedSession = sessionService.addFileToSession(sessionId, fileInfo);

        // Real-time notification to the shop dashboard
        getIO().to(sessionId).emit('file-uploaded', {
            sessionId,
            file: fileInfo,
            totalFiles: updatedSession.files.length,
        });

        res.json({ success: true, message: 'File uploaded successfully', file: fileInfo });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { uploadFile };
