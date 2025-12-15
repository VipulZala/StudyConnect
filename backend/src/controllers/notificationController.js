const Notification = require('../models/Notification');

exports.listNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json(notifications);
};

exports.markRead = async (req, res) => {
  const { ids } = req.body; // array of ids
  if (!Array.isArray(ids)) return res.status(400).json({ message: 'ids array required' });
  await Notification.updateMany({ _id: { $in: ids }, user: req.user._id }, { isRead: true });
  res.json({ message: 'Marked read' });
};

