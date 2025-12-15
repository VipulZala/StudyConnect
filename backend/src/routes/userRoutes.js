const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');

// GET /api/v1/users
router.get('/', ctrl.getAllUsers);
router.get('/me', ctrl.getMe);
router.put('/me', ctrl.updateMe);
router.get('/:id', ctrl.getUserById);

module.exports = router;
