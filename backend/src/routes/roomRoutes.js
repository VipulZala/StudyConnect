const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/roomController');

router.post('/', auth, ctrl.createRoom);
router.get('/', auth, ctrl.listRooms);

module.exports = router;
