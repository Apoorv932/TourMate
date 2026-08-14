const express = require('express');
const hostController = require('../controllers/host_controller');

const hostRouter = express.Router();

// Middleware to check if user is host
const requireHost = async (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const User = require('../models/user');

  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'MY_SECRET_KEY');
    req.userId = decoded.userId;

    // Check if user is host
    const user = await User.findById(decoded.userId);
    if (user && user.role === 'host') {
      return next();
    } else {
      return res.status(403).json({ message: 'Host access required.' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Get all guides for host
hostRouter.get('/guides', requireHost, hostController.getGuides);

// Create new guide
hostRouter.post('/guides', requireHost, hostController.createGuide);

// Update guide
hostRouter.put('/guides/:guideId', requireHost, hostController.updateGuide);

// Delete guide
hostRouter.delete('/guides/:guideId', requireHost, hostController.deleteGuide);

module.exports = hostRouter;
