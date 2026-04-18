const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const passport = require('passport');

const User = require('../models/user');
const { serializeUser } = require('../utility/serializers');

const JWT_SECRET = process.env.JWT_SECRET || 'MY_SECRET_KEY';
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

// Helper to gather validation errors from express-validator
function collectValidationErrors(req) {
  const result = validationResult(req);
  if (result.isEmpty()) return null;
  return result.array().map((error) => error.msg);
}

// Check if environment variables for Google are present
function isGoogleOauthConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

const authController = {
  
  // LOGIN: Authenticates user with email/password and issues a JWT
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(422).json({
        message: 'Either Email or Password is wrong',
        errors: ['Either Email or Password is wrong'],
      });
    }

    // Check if user originally signed up via Google
    if (!user.password) {
      return res.status(422).json({
        message: 'This account uses Google sign-in. Please continue with Google.',
        errors: ['This account uses Google sign-in. Please continue with Google.'],
      });
    }

    // Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(422).json({
        message: 'Either Email or Password is wrong',
        errors: ['Either Email or Password is wrong'],
      });
    }

    // Create JWT and store in an httpOnly cookie for security
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });

    return res.json({
      message: 'Login successful',
      user: serializeUser(user),
    });
  },

  // SIGNUP: Validates input, hashes password, and creates a new local user
  signup: [
    // Validation Middleware
    body('firstName').notEmpty().withMessage('First name is required')
      .isAlpha('en-US', { ignore: ' ' }).withMessage('First name must contain only letters')
      .isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    
    async (req, res) => {
      const errors = collectValidationErrors(req);
      if (errors) return res.status(422).json({ message: 'Validation failed', errors });

      const { firstName, lastName, email, password, role } = req.body;

      // Check for existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(422).json({ message: 'Email already registered' });

      try {
        // Hash password before saving to Database
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role,
          authProvider: 'local',
        });

        await user.save();
        return res.status(201).json({ message: 'Registration successful' });
      } catch (error) {
        return res.status(500).json({ message: 'Server error during registration' });
      }
    }
  ],

  // LOGOUT: Clears the JWT cookie
  logout: (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  },

  // GOOGLE AUTH: Redirects user to Google's consent screen
  googleAuth: (req, res, next) => {
    if (!isGoogleOauthConfigured()) {
      return res.status(503).json({ message: 'Google OAuth not configured on server' });
    }
    return passport.authenticate('google', { 
      scope: ['profile', 'email'], 
      session: false, 
      prompt: 'select_account' 
    })(req, res, next);
  },

  // GOOGLE CALLBACK: Handles the response from Google and issues a JWT
  googleCallback: (req, res, next) => {
    if (!isGoogleOauthConfigured()) return res.redirect(`${FRONTEND_URL}/login?oauth=disabled`);

    // Passport handles the "Secret Code" exchange behind the scenes
    return passport.authenticate('google', { session: false }, (error, user) => {
      if (error || !user) return res.redirect(`${FRONTEND_URL}/login?oauth=error`);

      // Issue the same JWT as manual login so the app treats the user the same
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });

      // Redirect back to frontend home page
      res.redirect(`${FRONTEND_URL}/?oauth=success`);
    })(req, res, next);
  }
};

module.exports = authController;