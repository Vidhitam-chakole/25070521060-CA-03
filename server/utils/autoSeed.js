// server/utils/autoSeed.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import DiscussionTopic from '../models/DiscussionTopic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATASET_DIR = path.join(__dirname, '..', 'data', 'debate_dataset');

/**
 * Automatically seeds the debatellm/DEBATE dataset into MongoDB if the collection is empty.
 * @param {boolean} force - If true, re-seeds even if topics exist.
 * @returns {Promise<{ seeded: boolean, count: number, message: string }>}
 */
export async function seedDebateTopicsIfEmpty(force = false) {
  try {
    const existingCount = await DiscussionTopic.countDocuments();
    if (existingCount > 0 && !force) {
      console.log(`ℹ️ MongoDB already has ${existingCount} discussion topics. Auto-seed skipped.`);
      return { seeded: false, count: existingCount, message: `Already seeded (${existingCount} topics)` };
    }

    if (!fs.existsSync(DATASET_DIR)) {
      console.warn(`⚠️ Dataset directory not found at ${DATASET_DIR}. Cannot seed debate topics.`);
      return { seeded: false, count: 0, message: 'Dataset directory not found' };
    }

    const files = fs.readdirSync(DATASET_DIR).filter((f) => f.endsWith('.json'));
    if (files.length === 0) {
      console.warn(`⚠️ No JSON dataset files found in ${DATASET_DIR}.`);
      return { seeded: false, count: 0, message: 'No JSON files in dataset directory' };
    }

    console.log(`🌱 Seeding ${files.length} predefined debate topics into MongoDB...`);

    let totalTurnsProcessed = 0;
    const batchSize = 15;
    for (let i = 0; i < files.length; i += batchSize) {
      const slice = files.slice(i, i + batchSize);
      const docs = slice.map((file) => {
        const content = fs.readFileSync(path.join(DATASET_DIR, file), 'utf8');
        const parsed = JSON.parse(content);
        totalTurnsProcessed += parsed.totalTurns || 0;
        return parsed;
      });

      const bulkOps = docs.map((doc) => ({
        updateOne: {
          filter: { topicId: doc.topicId },
          update: { $set: doc },
          upsert: true,
        },
      }));

      await DiscussionTopic.bulkWrite(bulkOps, { ordered: false });
      console.log(`🌱 Progress: Seeded batch ${Math.min(i + batchSize, files.length)}/${files.length} topics...`);
    }

    const finalCount = await DiscussionTopic.countDocuments();
    console.log(`✅ Successfully seeded ${finalCount} predefined debate topics into MongoDB! (${totalTurnsProcessed} total turns)`);
    return {
      seeded: true,
      count: finalCount,
      totalTurns: totalTurnsProcessed,
      message: `Successfully seeded ${finalCount} debate topics into MongoDB`,
    };
  } catch (err) {
    console.error('❌ Error during auto-seeding debate topics:', err.message);
    return { seeded: false, count: 0, error: err.message };
  }
}
