/**
 * session.controller.js – handles session creation and retrieval.
 */
const sessionService = require('../services/session.service');

/**
 * POST /session/create
 * Body: { toolType: string }
 */
async function createSession(req, res) {
    try {
        const { toolType = 'general' } = req.body;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const session = await sessionService.createSession(toolType, baseUrl);
        res.json({ success: true, session });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

/**
 * GET /session/:id
 */
function getSession(req, res) {
    const session = sessionService.getSession(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found or expired' });
    res.json({ success: true, session });
}

module.exports = { createSession, getSession };
