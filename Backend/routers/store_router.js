import express from 'express';
import jwt from 'jsonwebtoken';
import storeController from '../controllers/store_controller.js';
import bookingController from '../controllers/booking_controller.js';

const storeRouter = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

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

// Remove from favourites (guideId param)
storeRouter.delete('/favourites/:guideId', requireAuth, storeController.removeFavourite);

// User bookings
storeRouter.get('/bookings', requireAuth, bookingController.listUserBookings);
storeRouter.post('/bookings', requireAuth, bookingController.createBooking);
storeRouter.delete('/bookings/:bookingId', requireAuth, bookingController.cancelBooking);

// Get user profile
storeRouter.get('/profile', requireAuth, storeController.getProfile);

export default storeRouter;
