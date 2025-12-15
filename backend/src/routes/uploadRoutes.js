const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../config/multer');
const ctrl = require('../controllers/uploadController');

router.post('/', auth, upload.single('file'), ctrl.uploadFile);

module.exports = router;
