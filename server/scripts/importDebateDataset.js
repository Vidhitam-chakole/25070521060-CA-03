// server/scripts/importDebateDataset.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import DiscussionTopic from '../models/DiscussionTopic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server/.env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnwithfun';
const HF_BASE_RAW = 'https://huggingface.co/datasets/debatellm/DEBATE/raw/main';
const HF_BASE_API = 'https://huggingface.co/api/datasets/debatellm/DEBATE/tree/main';

const CACHE_DIR = path.join(__dirname, '..', 'data', 'debate_dataset');

// Helper to determine category based on topic keywords
function categorizeTopic(topicText) {
  const lower = topicText.toLowerCase();

  if (/health|cleanse|fasting|nutrient|toxin|disease|aids|diet|infectious|medical|medicine|biological/.test(lower)) {
    return 'Health & Wellness';
  }
  if (/science|technology|planet|scientific|astronomy|birth|engineer|ai|internet|evolution|space|future/.test(lower)) {
    return 'Science & Technology';
  }
  if (/deficit|obama|president|western country|government|citizen|democrat|republican|elect|vote|china|trade|nation|law|policy|immigra/.test(lower)) {
    return 'Society & Politics';
  }
  if (/angel|real|god|belief|faith|supernatural|soul|religion|destiny|spiritual|afterlife/.test(lower)) {
    return 'Philosophy & Beliefs';
  }
  if (/tax|income|rate|wealthy|family|economic|economy|money|poverty|capital|wage|finance|business/.test(lower)) {
    return 'Economy & Finance';
  }
  if (/abortion|justified|fare|transport|crime|punish|death penalty|moral|rights|justice|fair/.test(lower)) {
    return 'Ethics & Law';
  }

  return 'General Discussions';
}

// Generate searchable tags from topic
function generateTags(topicText, category) {
  const stopWords = new Set(['the', 'and', 'or', 'of', 'in', 'a', 'an', 'is', 'are', 'to', 'for', 'with', 'on', 'at', 'by', 'this', 'that', 'can', 'be', 'it', 'has', 'your', 'any']);
  const words = topicText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  const tagSet = new Set([category.toLowerCase(), ...words.slice(0, 10)]);
  return Array.from(tagSet);
}

// Robust CSV parser supporting multiline quoted cells
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(field);
      field = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      row.push(field);
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }

  if (field || row.length > 0) {
    row.push(field);
    if (row.some((x) => x.trim())) rows.push(row);
  }

  return rows;
}

// Fetch with retry & timeout
async function fetchWithRetry(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }
      return await res.text();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

// Process single CSV file into structured debate session
function processDebateCSV(csvText, fileName) {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return null;

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = {
    chatRound: header.indexOf('chat_round_order'),
    eventType: header.indexOf('event_type'),
    workerId: header.indexOf('worker_id'),
    senderId: header.indexOf('sender_id'),
    recipientId: header.indexOf('recipient_id'),
    text: header.indexOf('text'),
    slider: header.indexOf('slidervalue'),
    validity: header.indexOf('validity'),
  };

  const initialOpinions = [];
  const turns = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const text = (row[idx.text] || '').trim();
    if (!text || text === '[AUTOSUBMISSION DUE TO TIME LIMIT]') continue;

    const eventType = (row[idx.eventType] || '').trim();
    const workerId = (row[idx.workerId] || row[idx.senderId] || '').trim();
    const recipientId = (row[idx.recipientId] || '').trim();
    const sliderRaw = row[idx.slider];
    const sliderValue = sliderRaw ? parseFloat(sliderRaw) : null;
    const validity = (row[idx.validity] || 'VALID').trim();
    const roundOrder = parseFloat(row[idx.chatRound]) || (eventType === 'Initial Opinion' ? 0 : 1);

    if (eventType === 'Initial Opinion') {
      const stance = sliderValue !== null ? (sliderValue >= 4 ? 'Support' : sliderValue <= 2 ? 'Oppose' : 'Neutral') : 'Neutral';
      initialOpinions.push({
        workerId: workerId.slice(0, 10),
        text,
        sliderValue,
        stance,
      });
    } else {
      turns.push({
        round: Math.floor(roundOrder),
        eventType: eventType || 'message',
        speaker: workerId.slice(0, 10),
        recipient: recipientId.slice(0, 10),
        text,
        sliderValue,
        validity,
      });
    }
  }

  // Session ID from file name
  const sessionIdMatch = fileName.match(/_([0-9A-Z]{26})\.csv/i);
  const sessionId = sessionIdMatch ? sessionIdMatch[1] : fileName.replace('.csv', '');

  return {
    sessionId,
    fileName,
    initialOpinions,
    turns,
  };
}

// Main import function
export async function runDebateImport() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('📚 LearnWithFun — DEBATE Dataset Import & Processor');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Source: debatellm/DEBATE (Hugging Face)`);
  console.log(`License: DEBATE Dataset Research-Only License (v1.0)`);
  console.log(`Target MongoDB Database: ${MONGO_URI}`);
  console.log(`Target Collection: discussion_topics`);
  console.log('───────────────────────────────────────────────────────');

  // Ensure local cache directory exists
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  // Connect to MongoDB
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB learnwithfun database.');

  // Fetch listing of depth topics
  console.log('Fetching depth topics list from Hugging Face...');
  const depthRes = await fetch(`${HF_BASE_API}/golden/depth`);
  const depthList = await depthRes.json();
  const depthTopics = depthList
    .filter((x) => x.type === 'directory')
    .map((x) => ({
      name: x.path.replace('golden/depth/', ''),
      type: 'depth',
      apiPath: x.path,
    }));

  // Fetch listing of breadth topics
  console.log('Fetching breadth topics list from Hugging Face...');
  const breadthRes = await fetch(`${HF_BASE_API}/golden/breadth`);
  const breadthList = await breadthRes.json();
  const breadthTopics = breadthList
    .filter((x) => x.type === 'directory')
    .map((x) => ({
      name: x.path.replace('golden/breadth/', ''),
      type: 'breadth',
      apiPath: x.path,
    }));

  const allTopics = [...depthTopics, ...breadthTopics];
  console.log(`Found total ${allTopics.length} discussion topics (${depthTopics.length} depth, ${breadthTopics.length} breadth).`);

  let importedCount = 0;
  let totalTurnsCount = 0;

  for (let tIdx = 0; tIdx < allTopics.length; tIdx++) {
    const topicMeta = allTopics[tIdx];
    const topicName = topicMeta.name;
    const topicType = topicMeta.type;
    const topicSlug = topicName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 80);

    const topicCacheFile = path.join(CACHE_DIR, `${topicSlug}.json`);

    try {
      let topicRecord = null;

      // Check if already processed in local cache
      if (fs.existsSync(topicCacheFile)) {
        try {
          topicRecord = JSON.parse(fs.readFileSync(topicCacheFile, 'utf8'));
        } catch {
          topicRecord = null;
        }
      }

      if (!topicRecord) {
        // Fetch files for this topic
        const encodedTopicPath = encodeURIComponent(topicMeta.apiPath).replace(/%2F/g, '/');
        const filesRes = await fetch(`https://huggingface.co/api/datasets/debatellm/DEBATE/tree/main/${encodedTopicPath}`);
        const files = await filesRes.json();
        const csvFiles = Array.isArray(files) ? files.filter((f) => f.type === 'file' && f.path.endsWith('.csv')) : [];

        if (csvFiles.length === 0) {
          console.warn(`[${tIdx + 1}/${allTopics.length}] No CSV files found for: "${topicName}"`);
          continue;
        }

        // Process up to 3 files per topic to keep database balanced & fast
        const filesToProcess = csvFiles.slice(0, 3);
        const conversations = [];
        const combinedInitialOpinions = [];
        const sampleExcerpts = [];

        for (const f of filesToProcess) {
          const rawUrl = `${HF_BASE_RAW}/${encodeURI(f.path)}`;
          const csvText = await fetchWithRetry(rawUrl);
          const parsed = processDebateCSV(csvText, path.basename(f.path));
          if (!parsed) continue;

          conversations.push({
            sessionId: parsed.sessionId,
            fileName: parsed.fileName,
            turns: parsed.turns,
          });

          parsed.initialOpinions.forEach((op) => {
            if (!combinedInitialOpinions.some((existing) => existing.text === op.text)) {
              combinedInitialOpinions.push(op);
            }
          });

          // Grab top turns for excerpts
          parsed.turns
            .filter((t) => t.text.length > 40 && t.text.length < 350)
            .slice(0, 3)
            .forEach((t) => {
              if (!sampleExcerpts.includes(t.text)) {
                sampleExcerpts.push(t.text);
              }
            });
        }

        const category = categorizeTopic(topicName);
        const tags = generateTags(topicName, category);
        const turnsInTopic = conversations.reduce((acc, c) => acc + c.turns.length, 0);

        topicRecord = {
          topicId: topicSlug,
          topic: topicName,
          category,
          topicType,
          conversationCount: conversations.length,
          totalTurns: turnsInTopic,
          initialOpinions: combinedInitialOpinions.slice(0, 8),
          conversations,
          sampleExcerpts: sampleExcerpts.slice(0, 6),
          tags,
          source: 'debatellm/DEBATE (Hugging Face)',
          license: 'DEBATE Dataset Research-Only License (v1.0)',
        };

        // Cache locally
        fs.writeFileSync(topicCacheFile, JSON.stringify(topicRecord, null, 2));
      }

      // Upsert into MongoDB discussion_topics collection (idempotent, no duplicates!)
      await DiscussionTopic.findOneAndUpdate(
        { topicId: topicRecord.topicId },
        topicRecord,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      importedCount++;
      totalTurnsCount += topicRecord.totalTurns || 0;

      if (importedCount % 10 === 0 || importedCount === allTopics.length) {
        console.log(`[Progress ${tIdx + 1}/${allTopics.length}] Upserted ${importedCount} topics into MongoDB (${totalTurnsCount} turns so far)...`);
      }
    } catch (err) {
      console.error(`Error processing topic "${topicName}":`, err.message);
    }
  }

  console.log('───────────────────────────────────────────────────────');
  console.log(`🎉 Import Complete!`);
  console.log(`Total Topics Upserted: ${importedCount}`);
  console.log(`Total Debate Turns Processed: ${totalTurnsCount}`);
  console.log(`Database: learnwithfun | Collection: discussion_topics`);
  console.log('═══════════════════════════════════════════════════════');

  return { importedCount, totalTurnsCount };
}

// Run directly if called as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runDebateImport()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal import error:', err);
      process.exit(1);
    });
}
