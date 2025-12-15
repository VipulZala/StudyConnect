const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createProject,
  listProjects,
  getProject,
  joinProject,
  approveProject
} = require('../controllers/projectController');

router.post('/', auth, createProject);
router.get('/', auth, listProjects);
router.get('/:id', auth, getProject);
router.post('/:id/join', auth, joinProject);
router.post('/:id/approve', auth, approveProject); // admin only — enforce in admin middleware/handler

module.exports = router;

