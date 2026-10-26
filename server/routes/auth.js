import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'speechpact_pixel_secret_key_2026';

// Health check endpoint - reports MongoDB connection status
router.get('/health', (req, res) => {
  const isMongoReady = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    mongoConnected: isMongoReady,
    database: 'speechpact',
    host: mongoose.connection.host || '127.0.0.1',
    port: mongoose.connection.port || 27017,
  });
});

// Register new user with mandatory email and password
router.post('/register', async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 4 characters long',
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Initial nickname: provided nickname or username part before @
    const defaultName = cleanEmail.split('@')[0];
    const assignedNickname = (nickname && nickname.trim()) ? nickname.trim() : defaultName;

    // Directly store in MongoDB Compass
    const newUser = new User({
      email: cleanEmail,
      password: hashedPassword,
      nickname: assignedNickname,
      avatar: 'parrot',
      loginCount: 1,
      lastLogin: new Date(),
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully in MongoDB Compass!',
      user: newUser.toJSON(),
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
});

// Login existing user with email and password
router.post('/login', async (req, res) => {
  try {
    const { email, identifier, password } = req.body;
    const loginEmail = (email || identifier || '').trim().toLowerCase();

    if (!loginEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email in MongoDB Compass
    const user = await User.findOne({
      $or: [
        { email: loginEmail },
        { username: loginEmail },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account not found with this email. Please register!',
      });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again!',
      });
    }

    // Update login stats
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login confirmed successfully from MongoDB Compass!',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
});

// Update or set user nickname in MongoDB Compass
router.post('/nickname', async (req, res) => {
  try {
    const { userId, nickname } = req.body;

    if (!userId || !nickname || !nickname.trim()) {
      return res.status(400).json({
        success: false,
        message: 'User ID and nickname are required',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in MongoDB Compass',
      });
    }

    user.nickname = nickname.trim();
    await user.save();

    res.json({
      success: true,
      message: 'Nickname updated successfully in MongoDB Compass!',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Nickname update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating nickname',
    });
  }
});

export default router;
