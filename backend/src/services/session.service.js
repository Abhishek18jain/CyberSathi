/**
 * session.service.js – In-memory session store for QR upload sessions.
 * Files are tracked by Cloudinary { url, publicId } and deleted from cloud on expiry.
 */
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const { deleteFile } = require('../utils/cloudinary');

const SESSIONS = new Map();
const SESSION_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Create a new session and generate its QR code.
 */
async function createSession(toolType, baseUrl) {
    const sessionId = uuidv4();
    const uploadUrl = `${baseUrl}/upload/${sessionId}`;
    const qrDataUrl = await QRCode.toDataURL(uploadUrl, { width: 256 });

    const now = Date.now();
    const session = {
        sessionId,
        toolType,
        uploadUrl,
        qrDataUrl,
        files: [],           // [{ filename, originalname, url, publicId, size, mimetype, uploadedAt }]
        createdAt: now,
        expiresAt: now + SESSION_TTL_MS,
    };

    SESSIONS.set(sessionId, session);
    setTimeout(() => expireSession(sessionId), SESSION_TTL_MS);
    return session;
}

/** Get session (null if missing or expired). */
function getSession(sessionId) {
    const session = SESSIONS.get(sessionId);
    if (!session) return null;
    if (Date.now() > session.expiresAt) { expireSession(sessionId); return null; }
    return session;
}

/** Add an uploaded file record (with Cloudinary URL) to a session. */
function addFileToSession(sessionId, fileInfo) {
    const session = getSession(sessionId);
    if (!session) throw new Error('Session not found or expired');
    session.files.push(fileInfo);
    return session;
}

/** Delete session + remove its files from Cloudinary. */
async function expireSession(sessionId) {
    const session = SESSIONS.get(sessionId);
    if (!session) return;

    for (const f of session.files) {
        if (f.publicId) {
            const resourceType = f.mimetype?.includes('pdf') ? 'raw' : 'image';
            await deleteFile(f.publicId, resourceType);
        }
    }

    SESSIONS.delete(sessionId);
    console.log(`Session ${sessionId} expired & Cloudinary files cleaned up.`);
}

module.exports = { createSession, getSession, addFileToSession, expireSession };
