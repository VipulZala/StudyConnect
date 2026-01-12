const path = require('path');

exports.uploadFile = async (req, res) => {
    try {
        console.log('Upload request received');
        console.log('File:', req.file);

        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        const fileData = {
            url: fileUrl,
            path: fileUrl, // Alternative field name
            name: req.file.filename,
            originalName: req.file.originalname,
            type: req.file.mimetype,
            mimeType: req.file.mimetype, // Alternative field name
            size: req.file.size
        };

        console.log('File uploaded successfully:', fileData);
        res.json(fileData);
    } catch (err) {
        console.error('Upload error:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({
            message: 'File upload failed',
            error: err.message
        });
    }
};
