// server/routes/discussions.js
import express from 'express';
import DiscussionTopic from '../models/DiscussionTopic.js';
import { seedDebateTopicsIfEmpty } from '../utils/autoSeed.js';

const router = express.Router();

/**
 * GET /api/discussions
 * Search and filter discussion topics with pagination
 * Query params:
 *   - q: keyword search string
 *   - category: filter by category
 *   - topicType: depth | breadth
 *   - page: page number (default 1)
 *   - limit: items per page (default 9)
 *   - sort: popular | turns | alpha | newest
 */
router.get('/', async (req, res) => {
  try {
    const {
      q,
      category,
      topicType,
      page = 1,
      limit = 9,
      sort = 'popular',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
    const skip = (pageNum - 1) * limitNum;

    // Build query filter
    const query = {};

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Topic type filter (depth vs breadth)
    if (topicType && (topicType === 'depth' || topicType === 'breadth')) {
      query.topicType = topicType;
    }

    // Keyword search: support both partial regex matching and text index for best UX
    if (q && q.trim()) {
      const cleanQ = q.trim();
      // Safe regex escape
      const escaped = cleanQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');

      query.$or = [
        { topic: regex },
        { tags: regex },
        { category: regex },
        { sampleExcerpts: regex },
        { 'initialOpinions.text': regex },
      ];
    }

    // Sort options
    let sortOptions = { totalTurns: -1, conversationCount: -1 };
    if (sort === 'turns') {
      sortOptions = { totalTurns: -1 };
    } else if (sort === 'alpha') {
      sortOptions = { topic: 1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    // Projection: Omit full conversations turns for list performance
    const projection = {
      topicId: 1,
      topic: 1,
      category: 1,
      topicType: 1,
      conversationCount: 1,
      totalTurns: 1,
      initialOpinions: 1,
      sampleExcerpts: 1,
      tags: 1,
      source: 1,
      license: 1,
      createdAt: 1,
    };

    let [total, topics] = await Promise.all([
      DiscussionTopic.countDocuments(query),
      DiscussionTopic.find(query, projection)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    // Self-healing: If database is completely empty, trigger auto-seed and reload
    if (total === 0 && (!q || !q.trim()) && (!category || category === 'All')) {
      const globalCount = await DiscussionTopic.countDocuments();
      if (globalCount === 0) {
        console.log('🌱 DiscussionTopic collection is empty. Auto-seeding predefined topics...');
        await seedDebateTopicsIfEmpty();
        [total, topics] = await Promise.all([
          DiscussionTopic.countDocuments(query),
          DiscussionTopic.find(query, projection)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        ]);
      }
    }

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.json({
      success: true,
      topics,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
      filters: {
        q: q || '',
        category: category || 'All',
        topicType: topicType || 'all',
        sort,
      },
    });
  } catch (err) {
    console.error('Error fetching discussion topics:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to search discussion topics',
      error: err.message,
    });
  }
});

/**
 * GET /api/discussions/categories
 * Returns categories with count of topics and total turns
 */
router.get('/categories', async (req, res) => {
  try {
    const stats = await DiscussionTopic.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalTurns: { $sum: '$totalTurns' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const categories = stats.map((s) => ({
      name: s._id,
      count: s.count,
      totalTurns: s.totalTurns,
    }));

    res.json({
      success: true,
      categories,
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: err.message,
    });
  }
});

/**
 * GET /api/discussions/stats
 * Overview stats of the imported debate dataset
 */
router.get('/stats', async (req, res) => {
  try {
    let [totalTopics, totalDepth, totalBreadth, totals] = await Promise.all([
      DiscussionTopic.countDocuments(),
      DiscussionTopic.countDocuments({ topicType: 'depth' }),
      DiscussionTopic.countDocuments({ topicType: 'breadth' }),
      DiscussionTopic.aggregate([
        {
          $group: {
            _id: null,
            totalTurns: { $sum: '$totalTurns' },
            totalConversations: { $sum: '$conversationCount' },
          },
        },
      ]),
    ]);

    if (totalTopics === 0) {
      console.log('🌱 DiscussionTopic is empty on /stats. Auto-seeding...');
      await seedDebateTopicsIfEmpty();
      [totalTopics, totalDepth, totalBreadth, totals] = await Promise.all([
        DiscussionTopic.countDocuments(),
        DiscussionTopic.countDocuments({ topicType: 'depth' }),
        DiscussionTopic.countDocuments({ topicType: 'breadth' }),
        DiscussionTopic.aggregate([
          {
            $group: {
              _id: null,
              totalTurns: { $sum: '$totalTurns' },
              totalConversations: { $sum: '$conversationCount' },
            },
          },
        ]),
      ]);
    }

    const agg = totals[0] || { totalTurns: 0, totalConversations: 0 };

    res.json({
      success: true,
      stats: {
        totalTopics,
        totalDepthTopics: totalDepth,
        totalBreadthTopics: totalBreadth,
        totalConversations: agg.totalConversations,
        totalDebateTurns: agg.totalTurns,
        source: 'debatellm/DEBATE',
        datasetUrl: 'https://huggingface.co/datasets/debatellm/DEBATE',
        license: 'DEBATE Dataset Research-Only License (v1.0)',
        licensePermittedUse: 'Educational / Coursework / Research',
      },
    });
  } catch (err) {
    console.error('Error fetching debate stats:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch debate stats',
      error: err.message,
    });
  }
});

/**
 * GET /api/discussions/seed
 * POST /api/discussions/seed
 * Manually trigger or verify database seeding
 */
router.all('/seed', async (req, res) => {
  try {
    const force = req.query.force === 'true' || req.body?.force === true;
    const result = await seedDebateTopicsIfEmpty(force);
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to seed debate topics',
      error: err.message,
    });
  }
});

/**
 * GET /api/discussions/random
 * Get a random discussion topic for practice or surprise
 */
router.get('/random', async (req, res) => {
  try {
    let count = await DiscussionTopic.countDocuments();
    if (count === 0) {
      await seedDebateTopicsIfEmpty();
      count = await DiscussionTopic.countDocuments();
      if (count === 0) {
        return res.status(404).json({ success: false, message: 'No topics found in database' });
      }
    }

    const randomIdx = Math.floor(Math.random() * count);
    const randomTopic = await DiscussionTopic.findOne()
      .skip(randomIdx)
      .lean();

    res.json({
      success: true,
      topic: randomTopic,
    });
  } catch (err) {
    console.error('Error fetching random topic:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch random topic',
      error: err.message,
    });
  }
});

/**
 * GET /api/discussions/:topicId
 * Fetch full topic document including all conversation sessions & turns
 */
router.get('/:topicId', async (req, res) => {
  try {
    const { topicId } = req.params;

    const orConditions = [{ topicId }];
    if (topicId && /^[0-9a-fA-F]{24}$/.test(topicId)) {
      orConditions.push({ _id: topicId });
    }

    const topicDoc = await DiscussionTopic.findOne({
      $or: orConditions,
    }).lean();

    if (!topicDoc) {
      return res.status(404).json({
        success: false,
        message: `Discussion topic "${topicId}" not found`,
      });
    }

    res.json({
      success: true,
      topic: topicDoc,
    });
  } catch (err) {
    console.error(`Error fetching topic "${req.params.topicId}":`, err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve topic details',
      error: err.message,
    });
  }
});

export default router;
