// server/routes/history.js
import express from 'express';
import mongoose from 'mongoose';
import ResearchHistory from '../models/ResearchHistory.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * All routes in this file are protected by authenticateToken.
 * Research history is private to each authenticated user and stored in MongoDB.
 */
router.use(authenticateToken);

/**
 * GET /api/history
 * Fetch the authenticated user's private research history.
 * Supports filtering by source ('manual' | 'random'), keyword search ('q'), rating, and pagination.
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { source, q, minRating, page = 1, limit = 50 } = req.query;

    const query = { userId: new mongoose.Types.ObjectId(userId) };

    // Filter by source: 'manual' (manually searched) vs 'random' (randomly generated)
    if (source && (source === 'manual' || source === 'random')) {
      query.source = source;
    }

    // Filter by rating
    if (minRating) {
      const parsedRating = parseInt(minRating, 10);
      if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
        query.rating = { $gte: parsedRating };
      }
    }

    // Keyword search in topic or feedback
    if (q && q.trim()) {
      const cleanQ = q.trim();
      const escaped = cleanQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      query.$or = [{ topic: regex }, { feedback: regex }, { category: regex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [total, entries, statsAgg] = await Promise.all([
      ResearchHistory.countDocuments(query),
      ResearchHistory.find(query)
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      // Overall user stats (unfiltered by current query)
      ResearchHistory.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            avgRating: { $avg: '$rating' },
            manualCount: {
              $sum: { $cond: [{ $eq: ['$source', 'manual'] }, 1, 0] },
            },
            randomCount: {
              $sum: { $cond: [{ $eq: ['$source', 'random'] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const stats = statsAgg[0] || {
      totalSessions: 0,
      avgRating: 0,
      manualCount: 0,
      randomCount: 0,
    };

    res.json({
      success: true,
      history: entries,
      stats: {
        totalSessions: stats.totalSessions,
        avgRating: stats.avgRating ? Number(stats.avgRating.toFixed(1)) : 0,
        manualCount: stats.manualCount,
        randomCount: stats.randomCount,
      },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('Error fetching research history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve research history from MongoDB',
      error: error.message,
    });
  }
});

/**
 * POST /api/history
 * Save a new completed research session with satisfaction rating and feedback.
 */
router.post('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      topic,
      source = 'manual',
      topicType = 'manual-search',
      category = 'General',
      rating,
      feedback = '',
      durationSeconds = 0,
    } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Research topic title is required',
      });
    }

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid satisfaction rating between 1 and 5 stars',
      });
    }

    const cleanSource = source === 'random' ? 'random' : 'manual';

    const newEntry = new ResearchHistory({
      userId: new mongoose.Types.ObjectId(userId),
      topic: topic.trim(),
      source: cleanSource,
      topicType: topicType || (cleanSource === 'random' ? 'random-topic' : 'manual-search'),
      category: (category && category.trim()) || 'General',
      rating: parsedRating,
      feedback: (feedback || '').trim(),
      durationSeconds: Math.max(0, parseInt(durationSeconds, 10) || 0),
      completedAt: new Date(),
    });

    await newEntry.save();

    res.status(201).json({
      success: true,
      message: 'Research session and satisfaction rating saved successfully!',
      entry: newEntry,
    });
  } catch (error) {
    console.error('Error saving research session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save research session to MongoDB',
      error: error.message,
    });
  }
});

/**
 * PATCH /api/history/:id
 * Update satisfaction rating or feedback for an existing research entry.
 */
router.patch('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { rating, feedback } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid research entry ID',
      });
    }

    // Ensure entry exists and belongs to the authenticated user
    const entry = await ResearchHistory.findOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Research entry not found or unauthorized',
      });
    }

    if (rating !== undefined) {
      const parsedRating = parseInt(rating, 10);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Satisfaction rating must be an integer between 1 and 5 stars',
        });
      }
      entry.rating = parsedRating;
    }

    if (feedback !== undefined) {
      entry.feedback = feedback.trim();
    }

    await entry.save();

    res.json({
      success: true,
      message: 'Research rating and feedback updated successfully',
      entry,
    });
  } catch (error) {
    console.error('Error updating research entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update research entry in MongoDB',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/history/:id
 * Delete a research history entry belonging to the authenticated user.
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid research entry ID',
      });
    }

    const deleted = await ResearchHistory.findOneAndDelete({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Research entry not found or unauthorized',
      });
    }

    res.json({
      success: true,
      message: 'Research entry removed from your profile history',
      deletedId: id,
    });
  } catch (error) {
    console.error('Error deleting research entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete research entry from MongoDB',
      error: error.message,
    });
  }
});

export default router;
