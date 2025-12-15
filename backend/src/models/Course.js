const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String,
  isPaid: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);

