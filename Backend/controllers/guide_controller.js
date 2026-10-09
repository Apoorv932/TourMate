import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Guide from '../models/guide.js';
import User from '../models/user.js';
import { serializeGuide, serializeUser } from '../utility/serializers.js';

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

function databaseUnavailable(res) {
  return res.status(503).json({
    message: 'Database temporarily unavailable.',
    errors: ['Database temporarily unavailable.'],
  });
}

async function getCurrentUser(req) {
  if (!isDatabaseReady()) {
    return null;
  }

  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'MY_SECRET_KEY');
    return await User.findById(decoded.userId);
  } catch (err) {
    return null;
  }
}

const guideController = {
  // Get all guides / listings
  getGuides: async (_req, res) => {
    if (!isDatabaseReady()) {
      return databaseUnavailable(res);
    }

    const guides = await Guide.find().sort({ _id: -1 });
    const serialized = guides.map(serializeGuide);
    return res.json({
      guides: serialized,
      homes: serialized,
    });
  },

  // Get single guide / listing details
  getGuideById: async (req, res) => {
    if (!isDatabaseReady()) {
      return databaseUnavailable(res);
    }

    const guide = await Guide.findById(req.params.guideId);

    if (!guide) {
      return res.status(404).json({ message: 'Guide not found.' });
    }

    const serialized = serializeGuide(guide);
    return res.json({
      guide: serialized,
      home: serialized,
    });
  },

  // Get current active session user
  getSession: async (req, res) => {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.json({
        isLoggedIn: false,
        user: null,
      });
    }

    return res.json({
      isLoggedIn: true,
      user: serializeUser(user),
    });
  },
};

export default guideController;
