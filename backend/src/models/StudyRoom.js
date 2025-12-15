const mongoose = require('mongoose');

const StudyRoomSchema = new mongoose.Schema({
  name: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  jitsiRoom: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudyRoom', StudyRoomSchema);
