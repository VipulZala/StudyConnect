const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title must not exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [500, 'Description must not exceed 500 characters']
  },
  githubUrl: {
    type: String,
    required: [true, 'GitHub repository URL is required'],
    trim: true,
    validate: {
      validator: function (v) {
        return /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/.test(v);
      },
      message: 'Please provide a valid GitHub repository URL (https://github.com/owner/repo)'
    }
  },
  ownerName: {
    type: String,
    required: [true, 'Project owner name is required'],
    trim: true,
    minlength: [2, 'Owner name must be at least 2 characters'],
    maxlength: [100, 'Owner name must not exceed 100 characters']
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function (v) {
        return v.length <= 10;
      },
      message: 'Maximum 10 tags allowed'
    }
  },
  categories: {
    type: [String],
    required: [true, 'At least one category is required'],
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: 'At least one category must be selected'
    },
    enum: {
      values: ['web-development', 'mobile-development', 'artificial-intelligence',
        'machine-learning', 'data-science', 'backend', 'frontend', 'devops'],
      message: '{VALUE} is not a valid category'
    }
  },
  members: {
    type: Number,
    default: 1,
    min: [1, 'Members count must be at least 1']
  },
  openPositions: {
    type: Number,
    default: 0,
    min: [0, 'Open positions cannot be negative']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80'
  },
  source: {
    type: String,
    default: 'user',
    enum: ['user', 'github']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Legacy fields for backward compatibility
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  githubRepo: String,
  requiredSkills: [String],
  isApproved: { type: Boolean, default: true }
});

// Update the updatedAt timestamp before saving
ProjectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  // Sync legacy fields
  if (!this.createdBy) this.createdBy = this.author;
  if (!this.githubRepo) this.githubRepo = this.githubUrl;
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
