import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import discussionRoutes from './routes/discussions.js';
import historyRoutes from './routes/history.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnwithfun';

// Configure CORS origins
const rawCorsOrigin = process.env.CORS_ORIGIN;
const allowedOrigins = rawCorsOrigin
  ? rawCorsOrigin.split(',').map((o) => o.trim())
  : null;

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // If wildcard or dev or origin in list, allow
      if (!allowedOrigins || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
  })
);
app.use(express.json());

// Request logging in dev
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.url}`);
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/history', historyRoutes);

// Health check status payload
const getHealthStatus = () => ({
  name: 'LearnWithFun API Server',
  status: 'online',
  environment: process.env.NODE_ENV || 'development',
  database: 'MongoDB',
  connected: mongoose.connection.readyState === 1,
});

app.get('/api', (req, res) => res.json(getHealthStatus()));
app.get('/api/health', (req, res) => res.json(getHealthStatus()));
app.get('/health', (req, res) => res.json(getHealthStatus()));
app.get('/', (req, res) => res.json(getHealthStatus()));

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
