// src/routes/oauthRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('../config/passport'); // ensures strategies registered
const jwt = require('jsonwebtoken');
const { genToken, hashToken } = require('../utils/hash'); // optional if you rotate refresh tokens
const RefreshToken = require('../models/RefreshToken');

// helper to issue access & refresh (same as authController)
function issueTokensAndRedirect(res, user) {
  const access = jwt.sign({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.profile?.avatarUrl || user.avatarUrl || ''
  }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_EXPIRES || '7d' });
  const rawRefresh = genToken(64);
  const rt = new RefreshToken({
    user: user._id,
    tokenHash: hashToken(rawRefresh),
    expiresAt: new Date(Date.now() + (Number(process.env.REFRESH_EXPIRES_DAYS || 30) * 24 * 3600 * 1000))
  });
  rt.save().catch(console.error);

  // Cross-domain fix: pass access token in URL query param
  // (httpOnly cookies don't work cross-domain between Render and Vercel)
  const redirectTo = (process.env.FRONTEND_URL || 'http://localhost:5173') + '/auth/success?token=' + encodeURIComponent(access);
  res.redirect(redirectTo);
}

// Google routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/v1/auth/oauth/failure' }),
  (req, res) => {
    // req.user available
    issueTokensAndRedirect(res, req.user);
  }
);

// GitHub routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/api/v1/auth/oauth/failure' }),
  (req, res) => {
    issueTokensAndRedirect(res, req.user);
  }
);

router.get('/failure', (req, res) => {
  res.status(401).send('OAuth failed');
});

module.exports = router;
