const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const passport = require('passport');

const User = require('../models/user');
const { serializeUser } = require('../utility/serializers');

const JWT_SECRET = process.env.JWT_SECRET || 'MY_SECRET_KEY';
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

function collectValidationErrors(req) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return null;
  }

  return result.array().map((error) => error.msg);
}

function isGoogleOauthConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

const authController = {
  // Login user
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(422).json({
        message: 'Either Email or Password is wrong',
        errors: ['Either Email or Password is wrong'],
      });
    }

    if (!user.password) {
      return res.status(422).json({
        message: 'This account uses Google sign-in. Please continue with Google.',
        errors: ['This account uses Google sign-in. Please continue with Google.'],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(422).json({
        message: 'Either Email or Password is wrong',
        errors: ['Either Email or Password is wrong'],
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });

    return res.json({
      message: 'Login successful',
      user: serializeUser(user),
    });
  },

  // Signup user
  signup: [
    body('firstName')
      .notEmpty().withMessage('First name is required')
      .isAlpha('en-US', { ignore: ' ' }).withMessage('First name must contain only letters')
      .isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('lastName')
      .optional({ checkFalsy: true })
      .isAlpha('en-US', { ignore: ' ' }).withMessage('Last name must contain only letters'),
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
      .matches(/[!@#$%^]/).withMessage('Must Contain atleast one special character'),
    body('confirmPassword')
      .notEmpty().withMessage('Confirm password is required')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
    body('role')
      .notEmpty().withMessage('Role is required')
      .isIn(['guest', 'host']).withMessage('Role must be either guest or host'),
    body('terms').custom((value) => {
      if (!(value === true || value === 'true' || value === 'on')) {
        throw new Error('You must accept the terms and conditions');
      }
      return true;
    }),
    async (req, res) => {
      const errors = collectValidationErrors(req);
      const { firstName, lastName, email, password, role } = req.body;

      if (errors) {
        return res.status(422).json({
          message: 'Validation failed',
          errors,
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(422).json({
          message: 'Email is already registered',
          errors: ['Email is already registered'],
        });
      }

      try {
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

        return res.status(201).json({
          message: 'Registration successful',
        });
      } catch (error) {
        return res.status(500).json({
          message: 'Something went wrong. Please try again.',
          errors: ['Something went wrong. Please try again.'],
        });
      }
    }
  ],

  // Logout user
  logout: (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  },

  // Google OAuth initiation
  googleAuth: (req, res, next) => {
    if (!isGoogleOauthConfigured()) {
      return res.status(503).json({
        message: 'Google OAuth is not configured on the backend yet.',
        errors: ['Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Backend/.env to enable Google sign-in.'],
      });
    }

    return passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
      prompt: 'select_account',
    })(req, res, next);
  },

  // Google OAuth callback
  googleCallback: (req, res, next) => {
    console.log('🔴 googleCallback route hit');
    
    if (!isGoogleOauthConfigured()) {
      console.log('❌ Google OAuth not configured');
      return res.redirect(`${FRONTEND_URL}/login?oauth=disabled`);
    }

    console.log('🟡 Authenticating with Passport...');
    return passport.authenticate('google', { session: false }, (error, user) => {
      console.log('🟢 Passport callback executed');
      console.log('error:', error);
      console.log('user:', user);
      
      if (error) {
        console.error('❌ Google OAuth Error:', error);
        return res.redirect(`${FRONTEND_URL}/login?oauth=error`);
      }
      
      if (!user) {
        console.error('❌ Google OAuth: User not returned from Passport');
        return res.redirect(`${FRONTEND_URL}/login?oauth=error`);
      }

      console.log('✅ User authenticated, creating JWT token');
      // Create JWT token for Google OAuth users
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });

      console.log('✅ Redirecting to home with oauth=success');
      res.redirect(`${FRONTEND_URL}/?oauth=success`);
    })(req, res, next);
  }
};

module.exports = authController;
