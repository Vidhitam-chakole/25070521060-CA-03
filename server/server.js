import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnwithfun';

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());

// Request logging in dev
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'LearnWithFun API Server',
    status: 'online',
    database: 'MongoDB Compass',
    connected: mongoose.connection.readyState === 1,
  });
});

// Connect to MongoDB
async function startServer() {
  try {
    console.log(`Attempting connection to MongoDB at: ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected successfully to MongoDB (database: learnwithfun)!');
    console.log('📊 Storing and verifying credentials in MongoDB Compass.');

    app.listen(PORT, () => {
      console.log(`🚀 LearnWithFun Node.js server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('⚠️ Make sure your local MongoDB server / MongoDB Compass service is running.');
    
    app.listen(PORT, () => {
      console.log(`⚠️ Server running with degraded database state on http://localhost:${PORT}`);
    });
  }
}

startServer();
