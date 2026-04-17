const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Home = require('../models/home');
const User = require('../models/user');
const { serializeHome, serializeUser } = require('../utility/serializers');

// Import separate routers
const authRouter = require('./auth_router');
const hostRouter = require('./host_router');
const storeRouter = require('./store_router');

const apiRouter = express.Router();

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

  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
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

// Public routes for homes
apiRouter.get('/homes', async (_req, res) => {
  if (!isDatabaseReady()) {
    return databaseUnavailable(res);
  }

  const homes = await Home.find().sort({ _id: -1 });
  return res.json({
    homes: homes.map(serializeHome),
  });
});

apiRouter.get('/homes/:homeId', async (req, res) => {
  if (!isDatabaseReady()) {
    return databaseUnavailable(res);
  }

  const home = await Home.findById(req.params.homeId);

  if (!home) {
    return res.status(404).json({ message: 'Home not found.' });
  }

  return res.json({
    home: serializeHome(home),
  });
});

// Mount sub-routers
apiRouter.use('/auth', authRouter);
apiRouter.use('/host', hostRouter);
apiRouter.use('/', storeRouter);

module.exports = apiRouter;
