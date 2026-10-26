import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import discussionRoutes from './routes/discussions.js';
import historyRoutes from './routes/history.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnwithfun';

// Configure CORS origins
const rawCorsOrigin = process.env.CORS_ORIGIN || 'https://exploreandlearn.vercel.app,http://localhost:5173,http://127.0.0.1:5173,http://localhost:5000,http://127.0.0.1:5000';
const allowedOrigins = rawCorsOrigin
  ? rawCorsOrigin.split(',').map((o) => o.trim())
  : ['https://exploreandlearn.vercel.app', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5000', 'http://127.0.0.1:5000'];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // If wildcard or dev or origin in list, allow
      if (
        !allowedOrigins ||
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== 'production' ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
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

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 LearnWithFun Node.js server running on http://127.0.0.1:${PORT}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${PORT} is already in use (server is likely already running).`);
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('⚠️ Make sure your local MongoDB server / MongoDB Compass service is running.');
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚠️ Server running with degraded database state on http://127.0.0.1:${PORT}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${PORT} is already in use.`);
      } else {
        console.error('Server error:', err);
      }
    });
  }
}

startServer();
