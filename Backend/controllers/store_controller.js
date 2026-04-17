const User = require('../models/user');
const { serializeHome, serializeUser } = require('../utility/serializers');

const storeController = {
  // Get user favourites
  getFavourites: async (req, res) => {
    const user = await User.findById(req.userId).populate('favourites');

    return res.json({
      homes: user.favourites.map(serializeHome),
    });
  },

  // Add to favourites
  addFavourite: async (req, res) => {
    const { id } = req.body;
    const user = await User.findById(req.userId);

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
    user.favourites = user.favourites.filter((id) => id.toString() !== req.params.homeId);
    await user.save();

    return res.json({
      message: 'Removed from favourites',
    });
  },

  // Get user bookings
  getBookings: async (req, res) => {
    return res.json({
      bookings: [],
    });
  },

  // Get user profile
  getProfile: async (req, res) => {
    const user = await User.findById(req.userId);
    return res.json({
      user: serializeUser(user),
    });
  }
};

module.exports = storeController;