// scripts/buildDebateStaticData.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_DIR = path.resolve(__dirname, '../server/data/debate_dataset');
const PUBLIC_DATA_DIR = path.resolve(__dirname, '../public/data');
const DEBATES_DIR = path.resolve(PUBLIC_DATA_DIR, 'debates');

// Ensure directories exist
if (!fs.existsSync(PUBLIC_DATA_DIR)) {
  fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DEBATES_DIR)) {
  fs.mkdirSync(DEBATES_DIR, { recursive: true });
}

console.log('Building static debate dataset from:', DATASET_DIR);

const files = fs.readdirSync(DATASET_DIR).filter((f) => f.endsWith('.json'));
console.log(`Found ${files.length} debate topic JSON files.`);

const summaryList = [];
let totalTurns = 0;
let totalConversations = 0;
const categoryCounts = {};

for (const file of files) {
  try {
    const raw = fs.readFileSync(path.join(DATASET_DIR, file), 'utf-8');
    const data = JSON.parse(raw);

    const topicId = data.topicId || file.replace(/\.json$/, '');
    const topic = data.topic || 'Untitled Topic';
    const category = data.category || 'General Discussions';
    const topicType = data.topicType || 'breadth';
    const turns = data.totalTurns || 0;
    const conversationsCount = data.conversationCount || (data.conversations ? data.conversations.length : 1);

    totalTurns += turns;
    totalConversations += conversationsCount;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;

    // Create lightweight summary record (omit huge conversations turns)
    const summary = {
      _id: topicId,
      topicId,
      topic,
      category,
      topicType,
      conversationCount: conversationsCount,
      totalTurns: turns,
      initialOpinions: data.initialOpinions || [],
      sampleExcerpts: data.sampleExcerpts || [],
      tags: data.tags || [],
      source: data.source || 'debatellm/DEBATE',
      license: data.license || 'DEBATE Dataset Research-Only License (v1.0)',
      createdAt: data.createdAt || new Date().toISOString(),
    };

    summaryList.push(summary);

    // Save full document (with transcripts) into public/data/debates/[topicId].json
    const fullDoc = {
      ...summary,
      conversations: data.conversations || [],
    };
    fs.writeFileSync(
      path.join(DEBATES_DIR, `${topicId}.json`),
      JSON.stringify(fullDoc, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.warn(`Error processing ${file}:`, err.message);
  }
}

// Sort summary list by popular (totalTurns desc) by default
summaryList.sort((a, b) => (b.totalTurns || 0) - (a.totalTurns || 0));

// Write catalog summary JSON
fs.writeFileSync(
  path.join(PUBLIC_DATA_DIR, 'debate_topics.json'),
  JSON.stringify(summaryList, null, 2),
  'utf-8'
);

// Write stats JSON
const stats = {
  totalTopics: summaryList.length,
  totalDepthTopics: summaryList.filter((t) => t.topicType === 'depth').length,
  totalBreadthTopics: summaryList.filter((t) => t.topicType === 'breadth').length,
  totalConversations,
  totalDebateTurns: totalTurns,
  categories: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
  source: 'debatellm/DEBATE',
  datasetUrl: 'https://huggingface.co/datasets/debatellm/DEBATE',
  license: 'DEBATE Dataset Research-Only License (v1.0)',
};

fs.writeFileSync(
  path.join(PUBLIC_DATA_DIR, 'debate_stats.json'),
  JSON.stringify(stats, null, 2),
  'utf-8'
);

console.log(`✅ Successfully generated:`);
console.log(`   - public/data/debate_topics.json (${summaryList.length} topics)`);
console.log(`   - public/data/debate_stats.json`);
console.log(`   - ${summaryList.length} topic files in public/data/debates/`);
