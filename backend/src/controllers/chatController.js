const Message = require('../models/Message');
const User = require('../models/User');

exports.getConversation = async (req, res) => {
  try {
    const { chatId, page = 1, limit = 50 } = req.query;
    if (!chatId) return res.status(400).json({ message: 'chatId required' });

    const msgs = await Message.find({ chatId })
      .populate('sender', 'name email profile.avatarUrl avatarUrl')
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getConversationList = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all unique chatIds where user is involved
    const messages = await Message.find({
      $or: [
        { chatId: { $regex: userId } }
      ]
    }).sort({ createdAt: -1 });

    // Group by chatId and get last message
    const conversationsMap = new Map();

    for (const msg of messages) {
      if (!conversationsMap.has(msg.chatId)) {
        conversationsMap.set(msg.chatId, msg);
      }
    }

    // Get conversation details
    const conversations = [];
    for (const [chatId, lastMsg] of conversationsMap) {
      // Extract other user ID from chatId (format: userId1-userId2)
      const userIds = chatId.split('-');
      const otherUserId = userIds.find(id => id !== userId);

      if (otherUserId) {
        const otherUser = await User.findById(otherUserId).select('name email profile.avatarUrl avatarUrl');

        if (otherUser) {
          // Count unread messages
          const unreadCount = await Message.countDocuments({
            chatId: chatId,
            sender: { $ne: userId },
            readBy: { $ne: userId }
          });

          conversations.push({
            chatId,
            user: {
              id: otherUser._id,
              name: otherUser.name,
              email: otherUser.email,
              avatar: otherUser.profile?.avatarUrl || otherUser.avatarUrl || '',
              online: false // TODO: implement online status tracking
            },
            lastMessage: {
              text: lastMsg.content || (lastMsg.fileName ? `📎 ${lastMsg.fileName}` : ''),
              timestamp: lastMsg.createdAt,
              read: lastMsg.readBy?.includes(userId)
            },
            unreadCount
          });
        }
      }
    }

    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { chatId } = req.body;
    const userId = req.user.id;

    if (!chatId) return res.status(400).json({ message: 'chatId required' });

    await Message.updateMany(
      { chatId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
