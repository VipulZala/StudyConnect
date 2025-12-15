// src/config/db.js
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set in .env. Add MONGO_URI to backend/.env (mongodb://... or mongodb+srv://...)');
  }

  // quick sanity check
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error('Invalid MONGO_URI. It must start with "mongodb://" or "mongodb+srv://". Current value: ' + uri.slice(0, 40) + '...');
  }

  // connect
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000 // 10 second timeout
  });

  console.log('MongoDB connected');
}

module.exports = connectDB;
