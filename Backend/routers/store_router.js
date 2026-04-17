const express = require('express');
const storeController = require('../controllers/store_controller');

const storeRouter = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  const jwt = require('jsonwebtoken');

  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'MY_SECRET_KEY');
    req.userId = decoded.userId;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Get user favourites
storeRouter.get('/favourites', requireAuth, storeController.getFavourites);

// Add to favourites
storeRouter.post('/favourites', requireAuth, storeController.addFavourite);

// Remove from favourites
storeRouter.delete('/favourites/:homeId', requireAuth, storeController.removeFavourite);

// Get user bookings
storeRouter.get('/bookings', requireAuth, storeController.getBookings);

// Get user profile
storeRouter.get('/profile', requireAuth, storeController.getProfile);

module.exports = storeRouter;
