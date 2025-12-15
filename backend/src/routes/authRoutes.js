const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh); // note: reads cookie
router.post('/logout', ctrl.logout);
router.post('/send-otp', ctrl.sendOtp);
router.post('/verify-otp', ctrl.verifyOtp);

module.exports = router;
