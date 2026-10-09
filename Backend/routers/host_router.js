import express from 'express';
import jwt from 'jsonwebtoken';
import hostController from '../controllers/host_controller.js';
import User from '../models/user.js';

const hostRouter = express.Router();

// Middleware to check if user is host
const requireHost = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'MY_SECRET_KEY');
    req.userId = decoded.userId;

    // Check if user is host/guide
    const user = await User.findById(decoded.userId);
    if (user && (user.role === 'host' || user.role === 'guide')) {
      return next();
    } else {
      return res.status(403).json({ message: 'Host access required.' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Get all guides/homes for host
hostRouter.get(['/guides', '/homes'], requireHost, hostController.getGuides);

// Create new guide/home
hostRouter.post(['/guides', '/homes'], requireHost, hostController.createGuide);

// Update guide/home
hostRouter.put(['/guides/:guideId', '/homes/:guideId'], requireHost, hostController.updateGuide);

// Delete guide/home
hostRouter.delete(['/guides/:guideId', '/homes/:guideId'], requireHost, hostController.deleteGuide);

export default hostRouter;
