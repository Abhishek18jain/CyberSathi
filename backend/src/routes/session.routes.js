/**
 * session.routes.js
 */
const router = require('express').Router();
const { createSession, getSession } = require('../controllers/session.controller');

// POST /session/create
router.post('/create', createSession);

// GET /session/:id
router.get('/:id', getSession);

module.exports = router;
