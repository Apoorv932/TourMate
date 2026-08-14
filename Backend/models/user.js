const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // required for local auth; not required for Google OAuth
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, unique: true, sparse: true },
  profilePhoto: { type: String, default: '' },
  role: { type: String, enum: ['guest', 'guide'], required: true, default: 'guest' },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Guide' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
