import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending','confirmed','completed','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Index for date‑only availability (unique per guide per day)
BookingSchema.index({ guideId: 1, date: 1 }, { unique: true });

export default mongoose.model('Booking', BookingSchema);
