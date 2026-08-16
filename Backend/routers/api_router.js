import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import Guide from '../models/guide.js';
import User from '../models/user.js';
import { serializeGuide, serializeUser } from '../utility/serializers.js';

// Import separate routers
import authRouter from './auth_router.js';
import hostRouter from './host_router.js';
import storeRouter from './store_router.js';

const apiRouter = express.Router();

// Public routes for guides
apiRouter.get('/guides', async (_req, res) => {
  if (!isDatabaseReady()) {
    return databaseUnavailable(res);
  }

  const guides = await Guide.find().sort({ _id: -1 });
  return res.json({
    guides: guides.map(serializeGuide),
  });
});

apiRouter.get('/guides/:guideId', async (req, res) => {
  if (!isDatabaseReady()) {
    return databaseUnavailable(res);
  }

  const guide = await Guide.findById(req.params.guideId);

  if (!guide) {
    return res.status(404).json({ message: 'Guide not found.' });
  }

  return res.json({
    guide: serializeGuide(guide),
  });
});

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

// Session check route
apiRouter.get('/session', async (req, res) => {
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
});

// Mount sub-routers
apiRouter.use('/auth', authRouter);
apiRouter.use('/host', hostRouter);
apiRouter.use('/', storeRouter);

export default apiRouter;
