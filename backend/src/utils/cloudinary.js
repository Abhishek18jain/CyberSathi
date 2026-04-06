/**
 * cloudinary.js – Cloudinary SDK singleton.
 * Exports the configured v2 instance plus helper methods.
 */
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a Buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {{ folder?: string, resource_type?: string, public_id?: string, format?: string }} options
 * @returns {Promise<{ url: string, publicId: string }>}
 */
function uploadBuffer(buffer, options = {}) {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder: options.folder || 'mp-online-hub',
            resource_type: options.resource_type || 'auto',
            ...options,
        };

        const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
            if (err) return reject(err);
            resolve({ url: result.secure_url, publicId: result.public_id });
        });

        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(uploadStream);
    });
}

/**
 * Download a Cloudinary file as a Buffer (used for multi-file PDF operations).
 * @param {string} url  Cloudinary secure URL
 * @returns {Promise<Buffer>}
 */
async function downloadBuffer(url) {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download from Cloudinary: ${res.statusText}`);
    return Buffer.from(await res.arrayBuffer());
}

/**
 * Delete a file from Cloudinary.
 * @param {string} publicId
 * @param {string} resourceType  'image' | 'raw' | 'video'
 */
async function deleteFile(publicId, resourceType = 'image') {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        console.log(`Cloudinary: deleted ${publicId}`);
    } catch (err) {
        console.error(`Cloudinary delete failed for ${publicId}:`, err.message);
    }
}

module.exports = { cloudinary, uploadBuffer, downloadBuffer, deleteFile };
