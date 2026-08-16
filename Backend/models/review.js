import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Review', ReviewSchema);
