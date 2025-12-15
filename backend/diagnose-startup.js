// Comprehensive server startup with detailed error logging
const fs = require('fs');
const path = require('path');

// Create a detailed log file
const logPath = path.join(__dirname, 'startup-debug.log');
function log(msg) {
    const timestamp = new Date().toISOString();
    const logMsg = `${timestamp} - ${msg}\n`;
    console.log(msg);
    try {
        fs.appendFileSync(logPath, logMsg);
    } catch (e) {
        console.error('Failed to write to log:', e.message);
    }
}

log('========================================');
log('SERVER STARTUP DIAGNOSTIC');
log('========================================');
log('Node version: ' + process.version);
log('Platform: ' + process.platform);
log('CWD: ' + process.cwd());

// Step 1: Load environment
log('\n[1] Loading environment variables...');
try {
    require('dotenv').config();
    log('✅ dotenv loaded');
    log('MONGO_URI exists: ' + (process.env.MONGO_URI ? 'YES' : 'NO'));
    log('PORT: ' + (process.env.PORT || '5000'));
} catch (e) {
    log('❌ dotenv failed: ' + e.message);
    process.exit(1);
}

// Step 2: Load Express
log('\n[2] Loading Express...');
try {
    const express = require('express');
    log('✅ Express loaded');
} catch (e) {
    log('❌ Express failed: ' + e.message);
    process.exit(1);
}

// Step 3: Test MongoDB connection
log('\n[3] Testing MongoDB connection...');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        log('✅ MongoDB connected successfully');
        mongoose.disconnect();

        log('\n[4] Starting actual server...');
        // Now start the real server
        const serverPath = path.join(__dirname, 'src', 'server.js');
        log('Server path: ' + serverPath);

        try {
            require(serverPath);
            log('✅ Server module loaded');
        } catch (e) {
            log('❌ Server failed to start: ' + e.message);
            log('Stack trace: ' + e.stack);
            process.exit(1);
        }
    })
    .catch((e) => {
        log('❌ MongoDB connection failed: ' + e.message);
        log('This could be due to:');
        log('  - Network connectivity issues');
        log('  - Invalid MongoDB URI');
        log('  - MongoDB Atlas IP whitelist');
        log('  - Database credentials');
        process.exit(1);
    });
