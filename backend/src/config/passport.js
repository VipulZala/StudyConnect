// src/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Called by passport to serialize user into session (not used for JWT flow, but required)
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const u = await User.findById(id);
    done(null, u);
  } catch (err) { done(err); }
});

// Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // profile: contains id, displayName, emails[0].value, photos
    const email = profile.emails?.[0]?.value;
    let user = await User.findOne({ $or: [{ 'oauth.googleId': profile.id }, { email }] });
    if (!user) {
      user = await User.create({
        name: profile.displayName || (email?.split('@')[0]),
        email,
        avatarUrl: profile.photos?.[0]?.value,
        oauth: { googleId: profile.id }
      });
    } else if (!user.oauth?.googleId) {
      user.oauth = user.oauth || {};
      user.oauth.googleId = profile.id;
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// GitHub strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK,
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // profile contains id, username, emails
    const email = profile.emails?.[0]?.value;
    let user = await User.findOne({ $or: [{ 'oauth.githubId': profile.id }, { email }] });
    if (!user) {
      user = await User.create({
        name: profile.displayName || profile.username,
        email,
        avatarUrl: profile._json?.avatar_url,
        oauth: { githubId: profile.id }
      });
    } else if (!user.oauth?.githubId) {
      user.oauth = user.oauth || {};
      user.oauth.githubId = profile.id;
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

module.exports = passport;

