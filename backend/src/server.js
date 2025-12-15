// src/server.js
const fs = require('fs');
const path = require('path');

// Debug logger
const logFile = path.join(__dirname, '../server_debug_out.txt');
function log(msg) {
  try {
    fs.appendFileSync(logFile, new Date().toISOString() + ' ' + msg + '\n');
  } catch (e) {
    // ignore
  }
}

log('--- SERVER START ---');
log('Node version: ' + process.version);

try {
  require('dotenv').config();
  log('dotenv config loaded');
} catch (e) {
  log('dotenv failed: ' + e.message);
}

log('Starting server.js...');

process.on('uncaughtException', (err) => {
  log('UNCAUGHT EXCEPTION: ' + err.stack);
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log('UNHANDLED REJECTION: ' + reason);
  console.error('UNHANDLED REJECTION:', reason);
});

const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// DB connect util (must exist)
log('Requiring db config...');
const connectDB = require('./config/db');

// init express
const app = express();

// --- CORS: allow frontend origin and cookies
const FRONTEND_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));

// body + cookies
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- initialize passport strategies (file should register strategies)
try {
  const passport = require('./config/passport');
  app.use(passport.initialize());
  // no session used; we use JWT + refresh cookie flow
} catch (err) {
  console.warn('passport config not found or failed to load — OAuth routes will error if used', err && err.message);
}

// --- Mount API routes (these files should exist)
try {
  app.use('/api/v1/auth', require('./routes/authRoutes'));      // register/login/refresh/logout
} catch (err) {
  console.warn('authRoutes failed to load:', err && err.message);
}

try {
  app.use('/api/v1/auth', require('./routes/oauthRoutes'));     // oauth routes (google/github)
} catch (err) {
  // oauthRoutes optional
  console.warn('oauthRoutes not loaded (optional):', err && err.message);
}

try {
  app.use('/api/v1/messages', require('./routes/messageRoutes')); // message history endpoints
} catch (err) {
  console.warn('messageRoutes not loaded:', err && err.message);
}

try {
  app.use('/api/v1/rooms', require('./routes/roomRoutes')); // create/list study rooms
} catch (err) {
  console.warn('roomRoutes not loaded:', err && err.message);
}

try {
  app.use('/api/v1/users', require('./routes/userRoutes')); // list users
} catch (err) {
  console.warn('userRoutes not loaded:', err && err.message);
}

try {
  app.use('/api/v1/upload', require('./routes/uploadRoutes')); // file upload
} catch (err) {
  console.warn('uploadRoutes not loaded:', err && err.message);
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/v1/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// simple index
app.get('/', (req, res) => res.send('StudyConnect API'));

// Error handler (last middleware)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// --- HTTP + Socket.IO
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    credentials: true
  },
  maxHttpBufferSize: 1e6
});

// Socket auth using access token (JWT)
const jwt = require('jsonwebtoken');
const Message = require('./models/Message'); // ensure exists

io.use((socket, next) => {
  // token expected in handshake.auth.token
  try {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) {
      // allow anonymous socket connections if you want, or reject:
      // return next(new Error('Unauthorized'));
      socket.userId = null;
      return next();
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload.id;
    return next();
  } catch (err) {
    console.warn('Socket auth failed:', err && err.message);
    return next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id, 'userId=', socket.userId);

  // join a personal room for notifications if userId present
  if (socket.userId) socket.join(String(socket.userId));

  // join chat room
  socket.on('joinChat', (chatId) => {
    if (!chatId) return;
    socket.join(chatId);
    // optionally emit presence info
  });

  socket.on('leaveChat', (chatId) => {
    if (!chatId) return;
    socket.leave(chatId);
  });

  // send message -> persist and broadcast
  socket.on('sendMessage', async (payload) => {
    // payload: { chatId, content, receivers? }
    try {
      if (!payload || !payload.chatId || !payload.content) {
        socket.emit('errorMessage', { message: 'Invalid message payload' });
        return;
      }
      const msgDoc = await Message.create({
        chatId: payload.chatId,
        sender: socket.userId,
        content: payload.content,
        createdAt: new Date()
      });
      // emit to room
      io.to(payload.chatId).emit('newMessage', msgDoc);
      // notify receivers individually if list provided
      if (Array.isArray(payload.receivers)) {
        payload.receivers.forEach(r => io.to(String(r)).emit('notification', { type: 'message', message: 'New message' }));
      }
    } catch (err) {
      console.error('sendMessage error', err);
    }
  });

  socket.on('typing', ({ chatId }) => {
    if (chatId) socket.to(chatId).emit('typing', { userId: socket.userId });
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected', socket.id, 'reason=', reason);
  });
});

// --- Start server after DB connect
const PORT = process.env.PORT || 5000;
(async () => {
  try {
    log('Connecting to DB...');
    await connectDB();
    log('DB Connected. Starting server listen...');
    server.listen(PORT, () => {
      log(`Server listening on port ${PORT}`);
      console.log(`Server listening on port ${PORT}`);
      console.log(`Frontend origin allowed: ${FRONTEND_ORIGIN}`);
    });
  } catch (err) {
    log('Failed to start server: ' + (err && err.message));
    console.error('Failed to start server — DB connection error:', err && err.message);
    process.exit(1);
  }
})();

