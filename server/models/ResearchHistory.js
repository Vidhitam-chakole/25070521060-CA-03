// server/models/ResearchHistory.js
import mongoose from 'mongoose';

const researchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    // Source of the topic: manually searched by user vs randomly generated
    source: {
      type: String,
      enum: ['manual', 'random'],
      default: 'manual',
      required: true,
      index: true,
    },
    // Detailed topic type: manual-search, random-topic, deep-research, debate, interview-prep, vocab
    topicType: {
      type: String,
      default: 'manual-search',
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    // Satisfaction rating out of 5 stars (1 to 5)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    // User feedback / key takeaways / notes
    feedback: {
      type: String,
      default: '',
      trim: true,
    },
    // Time spent on the research or practice session (in seconds)
    durationSeconds: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure private, blazing fast retrieval of user's history ordered by most recent
researchHistorySchema.index({ userId: 1, completedAt: -1 });
researchHistorySchema.index({ userId: 1, source: 1 });

const ResearchHistory = mongoose.model('ResearchHistory', researchHistorySchema, 'research_history');
export default ResearchHistory;
