// server/models/DiscussionTopic.js
import mongoose from 'mongoose';

const turnSchema = new mongoose.Schema({
  round: { type: Number, default: 0 },
  eventType: { type: String, default: '' },
  speaker: { type: String, default: '' },
  recipient: { type: String, default: '' },
  text: { type: String, required: true },
  sliderValue: { type: Number, default: null },
  validity: { type: String, default: 'VALID' },
}, { _id: false });

const conversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  fileName: { type: String, default: '' },
  turns: [turnSchema],
}, { _id: false });

const opinionSchema = new mongoose.Schema({
  workerId: { type: String, default: '' },
  text: { type: String, required: true },
  sliderValue: { type: Number, default: null },
  stance: { type: String, default: 'Neutral' }, // Support | Oppose | Neutral
}, { _id: false });

const discussionTopicSchema = new mongoose.Schema(
  {
    topicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
      default: 'General Discussions',
    },
    topicType: {
      type: String,
      enum: ['depth', 'breadth'],
      default: 'depth',
      index: true,
    },
    conversationCount: {
      type: Number,
      default: 0,
    },
    totalTurns: {
      type: Number,
      default: 0,
    },
    initialOpinions: [opinionSchema],
    conversations: [conversationSchema],
    sampleExcerpts: [{ type: String }],
    tags: [{ type: String, index: true }],
    source: {
      type: String,
      default: 'debatellm/DEBATE (Hugging Face)',
    },
    license: {
      type: String,
      default: 'DEBATE Dataset Research-Only License (v1.0)',
    },
  },
  {
    timestamps: true,
  }
);

// Compound Text Search Index for keyword searches
discussionTopicSchema.index({
  topic: 'text',
  sampleExcerpts: 'text',
  'initialOpinions.text': 'text',
  tags: 'text',
}, {
  weights: {
    topic: 10,
    tags: 5,
    sampleExcerpts: 3,
    'initialOpinions.text': 2,
  },
  name: 'DiscussionTopicTextIndex',
});

// Compound index for filtering
discussionTopicSchema.index({ category: 1, topicType: 1 });

const DiscussionTopic = mongoose.model('DiscussionTopic', discussionTopicSchema, 'discussion_topics');
export default DiscussionTopic;
