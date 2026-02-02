const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/connectionController');

// Send connection request
router.post('/request', auth, ctrl.sendRequest);

// Get received connection requests
router.get('/requests', auth, ctrl.getRequests);

// Get all connections (accepted)
router.get('/', auth, ctrl.getConnections);

// Get connection status with a specific user
router.get('/status/:targetUserId', auth, ctrl.getConnectionStatus);

// Accept connection request
router.put('/accept/:connectionId', auth, ctrl.acceptRequest);

// Reject connection request
router.put('/reject/:connectionId', auth, ctrl.rejectRequest);

// Remove connection
router.delete('/:connectionId', auth, ctrl.removeConnection);

module.exports = router;
