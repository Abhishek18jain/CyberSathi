/**
 * server.js – MP Online Hub Backend Entry Point
 * Starts Express server with Socket.IO for real-time session notifications.
 */
require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/utils/socket');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialise Socket.IO
initSocket(server);

server.listen(PORT, () => {
    console.log(`✅  MP Online Hub backend running on http://localhost:${PORT}`);
});
