const Booking = require('../models/booking');
const Guide = require('../models/guide');
const { serializeBooking } = require('../utility/serializers');

const bookingController = {
  // Create a new booking if guide is available on requested date
  createBooking: async (req, res) => {
    const { guideId, date } = req.body;
    if (!guideId || !date) {
      return res.status(400).json({ message: 'guideId and date are required.' });
    }
    const bookingDate = new Date(date);
    // Normalize to start of day
    const startOfDay = new Date(bookingDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(bookingDate.setHours(24, 0, 0, 0));

    const conflict = await Booking.findOne({
      guideId,
      date: { $gte: startOfDay, $lt: endOfDay },
      status: { $ne: 'cancelled' },
    });
    if (conflict) {
      return res.status(409).json({ message: 'Guide already booked for this date.' });
    }

    const booking = await Booking.create({
      guideId,
      userId: req.userId,
      date: startOfDay,
      status: 'pending',
    });
    const populated = await booking.populate('guideId');
    return res.status(201).json({ booking: serializeBooking(populated) });
  },

  // Cancel a booking (owner only)
  cancelBooking: async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking.' });
    }
    booking.status = 'cancelled';
    await booking.save();
    return res.json({ message: 'Booking cancelled.', booking: serializeBooking(booking) });
  },

  // List bookings for logged‑in user
  listUserBookings: async (req, res) => {
    const bookings = await Booking.find({ userId: req.userId }).populate('guideId');
    return res.json({ bookings: bookings.map(serializeBooking) });
  },

  // List bookings for a specific guide (guide role)
  listGuideBookings: async (req, res) => {
    const { guideId } = req.params;
    const bookings = await Booking.find({ guideId }).populate('userId');
    return res.json({ bookings: bookings.map(serializeBooking) });
  },
};

module.exports = bookingController;
