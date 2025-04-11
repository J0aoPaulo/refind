const crypto = require('crypto');

const generateUniqueCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

module.exports = {generateUniqueCode};