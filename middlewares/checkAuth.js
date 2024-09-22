// middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const checkAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error });
  }
};

module.exports = checkAuth;