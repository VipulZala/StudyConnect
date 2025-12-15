const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: String,
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyRoom' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  messageType: { type: String, enum: ['text', 'file', 'image'], default: 'text' },
  fileUrl: String,
  fileName: String,
  fileType: String,
  fileSize: Number,
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
