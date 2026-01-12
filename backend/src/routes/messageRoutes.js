const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/chatController');

router.get('/conversation', auth, ctrl.getConversation);
router.get('/conversations', auth, ctrl.getConversationList);
router.post('/read', auth, ctrl.markAsRead);
router.delete('/delete', auth, ctrl.deleteMessages);
router.post('/delete', auth, ctrl.deleteMessages); // Support both DELETE and POST

module.exports = router;

