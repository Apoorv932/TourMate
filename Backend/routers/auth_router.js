import express from 'express';
import authController from '../controllers/auth_controller.js';

const authRouter = express.Router();

// Request logging for auth routes
authRouter.use((req, res, next) => {
  console.log(`🔐 AUTH ${req.method} ${req.path}`);
  next();
});

// Login route
authRouter.post('/login', authController.login);

// Signup route
authRouter.post('/signup', authController.signup);

// Logout route
authRouter.post('/logout', authController.logout);

// Google OAuth routes
authRouter.get('/google', authController.googleAuth);
authRouter.get('/google/callback', authController.googleCallback);

export default authRouter;
