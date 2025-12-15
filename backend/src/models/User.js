const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  passwordHash: String,
  phone: { type: String, unique: true, sparse: true },
  avatarUrl: String,
  role: { type: String, default: 'user' },
  oauth: {
    googleId: String,
    githubId: String
  },
  profile: {
    college: String,
    course: String,
    semester: String,
    bio: String,
    skills: [String],
    interests: [String],
    avatarUrl: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
