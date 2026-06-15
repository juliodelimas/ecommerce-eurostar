const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { JWT_SECRET } = require('../middleware/authMiddleware');

function register({ email, password, name }) {
  if (!email || !password || !name) {
    const error = new Error('Email, password, and name are required.');
    error.statusCode = 400;
    throw error;
  }

  if (userModel.findByEmail(email)) {
    const error = new Error('Email already registered.');
    error.statusCode = 409;
    throw error;
  }

  const user = userModel.create({ email, password, name });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

  return { user, token };
}

function login({ email, password }) {
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const user = userModel.findByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  const { password: _, ...safeUser } = user;

  return { user: safeUser, token };
}

module.exports = { register, login };
