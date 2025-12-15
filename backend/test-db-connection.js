require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set (hidden for security)' : 'NOT SET');

async function testConnection() {
    try {
        console.log('Attempting to connect...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // 10 second timeout
        });
        console.log('✅ MongoDB connected successfully!');
        await mongoose.disconnect();
        console.log('Disconnected.');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB connection failed:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        process.exit(1);
    }
}

testConnection();
