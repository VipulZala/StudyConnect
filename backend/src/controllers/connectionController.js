const Connection = require('../models/Connection');
const User = require('../models/User');

// Send a connection request
exports.sendRequest = async (req, res) => {
    try {
        const requesterId = req.user.id;
        const { recipientId } = req.body;

        if (!recipientId) {
            return res.status(400).json({ message: 'Recipient ID required' });
        }

        if (requesterId === recipientId) {
            return res.status(400).json({ message: 'Cannot send request to yourself' });
        }

        // Check if recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if connection already exists
        const existing = await Connection.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existing) {
            if (existing.status === 'pending') {
                return res.status(400).json({ message: 'Connection request already sent' });
            } else if (existing.status === 'accepted') {
                return res.status(400).json({ message: 'Already connected' });
            }
        }

        // Create new connection request
        const connection = await Connection.create({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        });

        res.json({ message: 'Connection request sent', connection });
    } catch (err) {
        console.error('sendRequest error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all connection requests (received)
exports.getRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const requests = await Connection.find({
            recipient: userId,
            status: 'pending'
        }).populate('requester', 'name email profile.avatarUrl avatarUrl');

        res.json(requests);
    } catch (err) {
        console.error('getRequests error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all connections (accepted)
exports.getConnections = async (req, res) => {
    try {
        const userId = req.user.id;

        const connections = await Connection.find({
            $or: [
                { requester: userId, status: 'accepted' },
                { recipient: userId, status: 'accepted' }
            ]
        })
            .populate('requester', 'name email profile.avatarUrl avatarUrl')
            .populate('recipient', 'name email profile.avatarUrl avatarUrl');

        // Transform to return the other user
        const transformed = connections.map(conn => {
            const otherUser = conn.requester._id.toString() === userId
                ? conn.recipient
                : conn.requester;
            return {
                connectionId: conn._id,
                user: otherUser,
                connectedAt: conn.updatedAt
            };
        });

        res.json(transformed);
    } catch (err) {
        console.error('getConnections error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Accept a connection request
exports.acceptRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { connectionId } = req.params;

        const connection = await Connection.findOne({
            _id: connectionId,
            recipient: userId,
            status: 'pending'
        });

        if (!connection) {
            return res.status(404).json({ message: 'Connection request not found' });
        }

        connection.status = 'accepted';
        connection.updatedAt = new Date();
        await connection.save();

        res.json({ message: 'Connection request accepted', connection });
    } catch (err) {
        console.error('acceptRequest error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reject a connection request
exports.rejectRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { connectionId } = req.params;

        const connection = await Connection.findOne({
            _id: connectionId,
            recipient: userId,
            status: 'pending'
        });

        if (!connection) {
            return res.status(404).json({ message: 'Connection request not found' });
        }

        connection.status = 'rejected';
        connection.updatedAt = new Date();
        await connection.save();

        res.json({ message: 'Connection request rejected', connection });
    } catch (err) {
        console.error('rejectRequest error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get connection status with a specific user
exports.getConnectionStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetUserId } = req.params;

        const connection = await Connection.findOne({
            $or: [
                { requester: userId, recipient: targetUserId },
                { requester: targetUserId, recipient: userId }
            ]
        });

        if (!connection) {
            return res.json({ status: 'none' });
        }

        // Determine if current user is requester or recipient
        const isRequester = connection.requester.toString() === userId;

        res.json({
            status: connection.status,
            isRequester,
            connectionId: connection._id
        });
    } catch (err) {
        console.error('getConnectionStatus error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove a connection
exports.removeConnection = async (req, res) => {
    try {
        const userId = req.user.id;
        const { connectionId } = req.params;

        // Find the connection and verify user is part of it
        const connection = await Connection.findOne({
            _id: connectionId,
            $or: [
                { requester: userId },
                { recipient: userId }
            ],
            status: 'accepted'
        });

        if (!connection) {
            return res.status(404).json({ message: 'Connection not found' });
        }

        // Delete the connection
        await Connection.findByIdAndDelete(connectionId);

        res.json({ message: 'Connection removed successfully' });
    } catch (err) {
        console.error('removeConnection error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
