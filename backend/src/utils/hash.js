const crypto = require('crypto');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function genToken(len = 64) {
  return crypto.randomBytes(len).toString('hex');
}

module.exports = { hashToken, genToken };
