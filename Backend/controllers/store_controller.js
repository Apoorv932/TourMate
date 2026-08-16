import User from '../models/user.js';
import Booking from '../models/booking.js';
import { serializeGuide, serializeUser, serializeBooking } from '../utility/serializers.js';

const storeController = {
  // Get user favourites
  getFavourites: async (req, res) => {
    const user = await User.findById(req.userId).populate('favourites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      guides: user.favourites.map(serializeGuide),
    });
  },

  // Add to favourites
  addFavourite: async (req, res) => {
    const { id } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favourites.some((favouriteId) => favouriteId.toString() === id)) {
      user.favourites.push(id);
      await user.save();
    }

    return res.json({
      message: 'Added to favourites',
    });
  },

  // Remove from favourites
  removeFavourite: async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favourites = user.favourites.filter((id) => id.toString() !== req.params.guideId);
    await user.save();

    return res.json({
      message: 'Removed from favourites',
    });
  },

  // Get user bookings
  getBookings: async (req, res) => {
    const bookings = await Booking.find({ userId: req.userId }).populate('guideId');
    return res.json({ bookings: bookings.map(serializeBooking) });
  },

  // Get user profile
  getProfile: async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      user: serializeUser(user),
    });
  }
};

export default storeController;