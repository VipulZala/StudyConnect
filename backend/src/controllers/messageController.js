const Message = require('../models/Message');

exports.getConversation = async (req, res) => {
  const { chatId, page = 1, limit = 50 } = req.query;
  if (!chatId) return res.status(400).json({ message: 'chatId required' });
  const messages = await Message.find({ chatId }).sort({ createdAt: 1 }).skip((page - 1) * limit).limit(Number(limit));
  res.json(messages);
};

