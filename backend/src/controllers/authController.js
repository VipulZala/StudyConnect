const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { hashToken, genToken } = require('../utils/hash');

const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES_DAYS = Number(process.env.REFRESH_EXPIRES_DAYS || 30);

function signAccess(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash });

    const access = signAccess(user._id);
    const raw = genToken(64);
    const rt = await RefreshToken.create({
      user: user._id,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 3600 * 1000)
    });

    // set cookie for refresh token
    res.cookie('refreshToken', raw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth/refresh'
    });

    res.json({ access, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('register err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const access = signAccess(user._id);
    const raw = genToken(64);
    await RefreshToken.create({
      user: user._id,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 3600 * 1000)
    });

    res.cookie('refreshToken', raw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth/refresh'
    });

    res.json({ access, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('login err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const raw = req.cookies?.refreshToken;
    if (!raw) return res.status(401).json({ message: 'No refresh token' });
    const hashed = hashToken(raw);
    const doc = await RefreshToken.findOne({ tokenHash: hashed }).populate('user');
    if (!doc) return res.status(401).json({ message: 'Invalid refresh token' });
    if (doc.expiresAt < new Date()) {
      await doc.remove();
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    // rotate refresh token (optional but recommended)
    const newRaw = genToken(64);
    doc.tokenHash = hashToken(newRaw);
    doc.expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 3600 * 1000);
    await doc.save();

    // new access
    const access = signAccess(doc.user._id);
    res.cookie('refreshToken', newRaw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth/refresh'
    });

    res.json({ access, user: { id: doc.user._id, name: doc.user.name, email: doc.user.email } });
  } catch (err) {
    console.error('refresh err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const raw = req.cookies?.refreshToken;
    if (raw) {
      const hashed = hashToken(raw);
      await RefreshToken.deleteMany({ tokenHash: hashed });
    }
    res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
    res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('logout err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- OTP Store (in-memory for demo)
const otpStore = new Map(); // phone -> { code, expires }

exports.sendOtp = async (req, res) => {
  try {
    const { phone, name } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number required' });

    // Validate Indian phone number format (+91XXXXXXXXXX)
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid Indian phone number. Format: +91XXXXXXXXXX' });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with name (valid for 5 mins)
    otpStore.set(phone, { code, name: name || '', expires: Date.now() + 5 * 60 * 1000 });

    console.log(`[OTP] Code for ${phone} (${name || 'Unknown'}): ${code}`); // Log to console for dev

    // Send SMS via Twilio
    const { sendSMS } = require('../utils/sms');
    const smsMessage = `Your StudyConnect verification code is: ${code}. Valid for 5 minutes.`;

    const smsResult = await sendSMS(phone, smsMessage);

    if (smsResult.success) {
      console.log('✓ OTP sent via Twilio SMS');
    } else if (smsResult.mode === 'console') {
      console.log('⚠️  Twilio not configured - OTP logged to console only');
    } else {
      console.error('✗ Failed to send SMS:', smsResult.error);
      // Continue anyway - OTP is still valid and logged to console
    }

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('sendOtp err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, code, name } = req.body;
    if (!phone || !code) return res.status(400).json({ message: 'Phone and code required' });

    const record = otpStore.get(phone);
    if (!record) return res.status(400).json({ message: 'OTP not found or expired' });
    if (record.expires < Date.now()) {
      otpStore.delete(phone);
      return res.status(400).json({ message: 'OTP expired' });
    }
    if (record.code !== code) return res.status(400).json({ message: 'Invalid OTP' });

    // OTP valid
    otpStore.delete(phone);

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      // Create new user with provided name or stored name from OTP request
      const userName = name || record.name || 'User ' + phone.slice(-4);
      user = await User.create({
        name: userName,
        phone,
        role: 'user'
      });
    }

    // Issue tokens
    const access = signAccess(user._id);
    const raw = genToken(64);
    await RefreshToken.create({
      user: user._id,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 3600 * 1000)
    });

    res.cookie('refreshToken', raw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth/refresh'
    });

    res.json({ access, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });

  } catch (err) {
    console.error('verifyOtp err', err);
    res.status(500).json({ message: 'Server error' });
  }
};
