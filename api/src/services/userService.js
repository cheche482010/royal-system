// api/src/services/userService.js

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({ username, password: hashedPassword });
}

module.exports = { createUser };
