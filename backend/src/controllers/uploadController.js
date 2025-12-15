const path = require('path');

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        const fileData = {
            url: fileUrl,
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size
        };

        res.json(fileData);
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ message: 'File upload failed' });
    }
};
