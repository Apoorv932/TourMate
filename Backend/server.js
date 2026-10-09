
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config();

const PORT = Number(process.env.PORT || 3001);
const MONGODB_URL = process.env.MONGODB_URL;

async function startServer() {
  try {
    if (!MONGODB_URL) {
      throw new Error('MONGODB_URL is missing from environment variables');
    }

    await mongoose.connect(MONGODB_URL, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ MongoDB connected successfully.');

    app.listen(PORT, () => {
      console.log(`Backend is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
