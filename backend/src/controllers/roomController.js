const StudyRoom = require('../models/StudyRoom');

exports.createRoom = async (req, res) => {
  try {
    const jitsiRoom = `study-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
    const room = await StudyRoom.create({
      name: req.body.name || `Room ${new Date().toISOString()}`,
      createdBy: req.user._id,
      members: [req.user._id],
      jitsiRoom
    });
    res.json(room);
  } catch (err) {
    console.error('createRoom err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listRooms = async (req, res) => {
  const rooms = await StudyRoom.find().populate('createdBy', 'name email');
  res.json(rooms);
};
