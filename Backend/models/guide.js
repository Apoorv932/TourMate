import mongoose from 'mongoose';

const GuideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  location: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  languages: [{ type: String }],
  specialties: [{ type: String }],
  photo: { type: String },
  isAvailable: { type: Boolean, default: true }
});

export default mongoose.model('Guide', GuideSchema);
