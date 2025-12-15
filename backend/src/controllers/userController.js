const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    // Return all users, selecting only necessary fields
    const users = await User.find({}, 'name email phone role createdAt avatarUrl');
    res.json(users);
  } catch (err) {
    console.error('getAllUsers err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    // req.user should be set by middleware (we need to ensure middleware is used)
    // Actually, we need to verify token here or use middleware.
    // Let's assume a middleware 'protect' exists or we verify here.
    // For now, let's verify token manually if middleware isn't set up globally.
    // But wait, server.js doesn't seem to have global auth middleware.
    // Let's check if we can use a middleware.
    // I'll implement a simple token verification here for now.

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('getMe err', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fields that can be updated
    const { name, phone, profile } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profile) {
      updateData.profile = {
        ...profile,
        // Sanitize and validate profile data
        bio: profile.bio || '',
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        college: profile.college || '',
        course: profile.course || '',
        semester: profile.semester || '',
        interests: Array.isArray(profile.interests) ? profile.interests : [],
        avatarUrl: profile.avatarUrl || ''
      };
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('updateMe err', err);
    res.status(400).json({ message: err.message || 'Update failed' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('getUserById err', err);
    res.status(500).json({ message: 'Server error' });
  }
};
