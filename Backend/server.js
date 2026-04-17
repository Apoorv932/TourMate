const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const session = require('express-session');
const multer = require('multer');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const apiRouter = require('./routers/api_router');
const User = require('./models/user');

const rootDir = path.resolve(__dirname);
const uploadsDir = path.join(rootDir, 'uploads');

const PORT = Number(process.env.PORT || 3001);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/tourmate';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-session-secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || `http://localhost:${PORT}/api/auth/google/callback`;

const app = express();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (_req, file, cb) => {
  if (['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'].includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(null, false);
};

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  console.log('✓ Setting up Google OAuth Strategy');
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          console.log('🔵 Google Strategy callback triggered');
          const primaryEmail = profile.emails?.[0]?.value?.toLowerCase();

          if (!primaryEmail) {
            console.error('❌ Google account does not expose an email address');
            return done(new Error('Google account does not expose an email address.'));
          }

          console.log('📧 Google email:', primaryEmail);

          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email: primaryEmail }],
          });

          const displayName = profile.displayName?.trim() || '';
          const [firstNameFromDisplay, ...lastNameParts] = displayName.split(/\s+/).filter(Boolean);

          if (!user) {
            console.log('➕ Creating new user from Google');
            user = new User({
              firstName: profile.name?.givenName || firstNameFromDisplay || 'Google',
              lastName: profile.name?.familyName || lastNameParts.join(' '),
              email: primaryEmail,
              role: 'guest',
              authProvider: 'google',
              googleId: profile.id,
              profilePhoto: profile.photos?.[0]?.value || '',
            });
          } else {
            console.log('✏️  Updating existing user');
            user.googleId = profile.id;
            user.authProvider = 'google';
            user.profilePhoto = profile.photos?.[0]?.value || user.profilePhoto || '';
            user.firstName = user.firstName || profile.name?.givenName || firstNameFromDisplay || 'Google';
            user.lastName = user.lastName || profile.name?.familyName || lastNameParts.join(' ');
          }

          await user.save();
          console.log('✅ User saved successfully:', user._id);
          return done(null, user);
        } catch (error) {
          console.error('❌ Google Strategy Error:', error.message);
          return done(error);
        }
      }
    )
  );
}

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  multer({ storage, fileFilter }).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'rulesPdf', maxCount: 1 },
  ])
);
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new session.MemoryStore(),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);
app.use(passport.initialize());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

app.use('/uploads', express.static(uploadsDir));
app.use('/api', apiRouter);

app.get('/', (_req, res) => {
  res.json({
    message: 'TourMate backend is running.',
    frontend: FRONTEND_URL,
  });
});

app.use((req, res) => {
  console.log(`404 Error on ${req.method} ${req.url}`);
  res.status(404).json({
    message: 'Page not found',
  });
});

app.listen(PORT, () => {
  console.log(`Backend is listening at http://localhost:${PORT}`);
});

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('MongoDB connected successfully.');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    console.error('Frontend can still run, but database-backed API routes may fail.');
  });
