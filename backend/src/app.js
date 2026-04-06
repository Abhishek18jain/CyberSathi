/**
 * app.js – Express application setup
 * Mounts all middleware and routes.
 */
const express = require('express');
const cors = require('cors');
const path = require('path');

const sessionRoutes = require('./routes/session.routes');
const uploadRoutes = require('./routes/upload.routes');
const passportRoutes = require('./routes/passport.routes');
const compressRoutes = require('./routes/compress.routes');
const pdfRoutes = require('./routes/pdf.routes');
const signatureRoutes = require('./routes/signature.routes');

const app = express();

// ── Middleware ──────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/files', express.static(path.join(__dirname, '..', 'uploads')));

// ── Routes ──────────────────────────────────────────────────────
app.use('/session', sessionRoutes);
app.use('/upload', uploadRoutes);
app.use('/passport', passportRoutes);
app.use('/compress', compressRoutes);
app.use('/pdf', pdfRoutes);
app.use('/signature', signatureRoutes);

// Health check
app.get('/', (_req, res) => res.json({ status: 'ok', app: 'MP Online Hub' }));

module.exports = app;
