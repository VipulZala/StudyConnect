const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const payload = { ...req.body, createdBy: req.user._id, members: [req.user._id] };
    const project = await Project.create(payload);
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listProjects = async (req, res) => {
  const { skill, open = true, page = 1, limit = 20 } = req.query;
  const q = {};
  if (skill) q.requiredSkills = { $in: [skill] };
  if (open === 'true' || open === true) q.isApproved = true;
  const projects = await Project.find(q).populate('createdBy', 'name email').skip((page - 1) * limit).limit(Number(limit));
  res.json(projects);
};

exports.getProject = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('members', 'name email').populate('createdBy', 'name email');
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

exports.joinProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.members.includes(req.user._id)) return res.status(400).json({ message: 'Already a member' });
  project.members.push(req.user._id);
  await project.save();
  res.json({ message: 'Joined project', project });
};

exports.approveProject = async (req, res) => {
  // admin only: set isApproved true
  const project = await Project.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

