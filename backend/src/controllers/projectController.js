const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { title, description, githubUrl, ownerName, tags, categories, members, openPositions } = req.body;

    // Get author from authenticated user
    const author = req.user.id || req.user._id;

    // Determine thumbnail based on first category
    const categoryImages = {
      'web-development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
      'mobile-development': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
      'machine-learning': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
      'artificial-intelligence': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      'data-science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      'backend': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
      'frontend': 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
      'devops': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80'
    };

    const thumbnail = categoryImages[categories?.[0]] || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80';

    const project = await Project.create({
      title,
      description,
      githubUrl,
      ownerName,
      tags: tags || [],
      categories,
      members: members || 1,
      openPositions: openPositions || 0,
      author,
      thumbnail
    });

    // Populate author details
    await project.populate('author', 'name email profile.avatarUrl avatarUrl');

    console.log('Project created successfully:', project._id);
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (err) {
    console.error('Create project error:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: err.message
    });
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

