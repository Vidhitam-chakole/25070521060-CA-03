// src/components/DebateHub.jsx
import React, { useState, useEffect, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  Sparkles,
  Star,
  Filter,
} from 'lucide-react';
import { SessionRatingSection } from './SessionRatingSection';
import { sound } from '../utils/audio';

const SERVER_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = SERVER_BASE ? `${SERVER_BASE}/api/discussions` : '/api/discussions';
const DIRECT_API_BASE = SERVER_BASE ? `${SERVER_BASE}/api/discussions` : 'http://localhost:5000/api/discussions';

// Resilient fetch helper for debate topics
const debateFetch = async (endpoint = '', options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (primaryErr) {
    if (API_BASE !== DIRECT_API_BASE) {
      try {
        const directRes = await fetch(`${DIRECT_API_BASE}${endpoint}`, options);
        if (!directRes.ok) throw new Error(`HTTP ${directRes.status}`);
        return await directRes.json();
      } catch {
        throw primaryErr;
      }
    }
    throw primaryErr;
  }
};

const CATEGORIES = [
  'All',
  'Society & Politics',
  'Science & Technology',
  'Ethics & Law',
  'Economy & Finance',
  'Health & Wellness',
  'Philosophy & Beliefs',
];

export function DebateHub({ onSelectTopicForPractice }) {
  const searchInputId = useId();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 6;

  // Data State
  const [topics, setTopics] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transcript Modal State
  const [activeTranscriptTopic, setActiveTranscriptTopic] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);
  const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
  const [showModalRating, setShowModalRating] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Stats on mount
  useEffect(() => {
    debateFetch('/stats')
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch((err) => {
        console.warn('Could not load stats:', err.message);
      });
  }, []);

  // Fetch Topics from MongoDB
  const fetchTopics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort: selectedSort,
      });

      if (debouncedQuery.trim()) {
        params.append('q', debouncedQuery.trim());
      }
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }

      const data = await debateFetch(`?${params.toString()}`);
      if (data.success) {
        setTopics(data.topics || []);
        setPagination(
          data.pagination || {
            total: 0,
            page: 1,
            limit: 6,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          }
        );
      } else {
        throw new Error(data.message || 'Failed to fetch discussions');
      }
    } catch (err) {
      console.error('Error fetching debate topics:', err);
      setError('Could not connect to MongoDB database (learnwithfun).');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, selectedCategory, selectedSort, page, limit]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // Fetch full transcript when modal opens
  const handleOpenTranscript = async (topic) => {
    try {
      if (sound.playAnalysisOpen) sound.playAnalysisOpen();
      else if (sound.playButtonClick) sound.playButtonClick();
    } catch {
      // safe audio
    }
    setActiveTranscriptTopic(topic);
    setSelectedSessionIndex(0);
    setShowModalRating(false);
    setIsTranscriptLoading(true);
    try {
      const topicIdParam = topic.topicId || topic._id;
      const data = await debateFetch(`/${encodeURIComponent(topicIdParam)}`);
      if (data && data.success && data.topic) {
        setTranscriptData(data.topic);
      } else {
        setTranscriptData(topic);
      }
    } catch (err) {
      console.warn('Transcript fetch fallback to preview:', err);
      setTranscriptData(topic);
    } finally {
      setIsTranscriptLoading(false);
    }
  };

  const handleCloseTranscript = () => {
    try {
      if (sound.playModalClose) sound.playModalClose();
      else if (sound.playButtonClick) sound.playButtonClick();
    } catch {
      // safe audio
    }
    setActiveTranscriptTopic(null);
    setTranscriptData(null);
    setShowModalRating(false);
  };

  // Pick a random topic for practice
  const handleRandomPractice = async () => {
    try {
      sound.playSnapChime?.();
    } catch {
      // safe audio
    }
    try {
      const data = await debateFetch('/random');
      if (data.success && data.topic && onSelectTopicForPractice) {
        onSelectTopicForPractice(data.topic.topic, 'random');
      }
    } catch (err) {
      console.error('Error picking random topic:', err);
    }
  };

  const handleResetFilters = () => {
    sound.playPillClick();
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedCategory('All');
    setSelectedSort('popular');
    setPage(1);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1060px',
        margin: '0 auto',
        padding: '8px 16px 40px 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Sleek, Uncluttered Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
          paddingBottom: '12px',
          borderBottom: '2px solid #E2DCCF',
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '18px',
              fontFamily: "'Pixelify Sans', sans-serif",
              fontWeight: 700,
              color: '#1E4D3B',
              letterSpacing: '-0.2px',
            }}
          >
            Debate & Discussion Topics
          </h2>
          <p
            style={{
              margin: '3px 0 0 0',
              fontSize: '13px',
              fontFamily: "'Pixelify Sans', sans-serif",
              color: '#556B5D',
            }}
          >
            {stats
              ? `Browse ${stats.totalTopics} real multi-turn debate topics (${stats.totalDebateTurns?.toLocaleString()} turns)`
              : 'Real multi-turn debate topics from Hugging Face'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleRandomPractice}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#EDE8DB',
              border: '2px solid #1E4D3B',
              padding: '7px 12px',
              fontFamily: "'Pixelify Sans', sans-serif",
              fontWeight: 700,
              fontSize: '12px',
              color: '#1E4D3B',
              cursor: 'pointer',
              boxShadow: '2px 2px 0px #1E4D3B',
            }}
            title="Pick a surprise debate topic"
          >
            <Sparkles size={13} color="#E8A857" />
            Random Topic
          </button>
        </div>
      </div>

      {/* 2. Search & Expandable Filters Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '18px',
        }}
      >
        {/* Search Bar + Sort + Filter Toggle Button + Reset */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1 1 280px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={16}
              color="#4E6A5E"
              style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
            />
            <input
              id={searchInputId}
              type="text"
              placeholder="Search topics, arguments, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 34px 9px 36px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #1E4D3B',
                borderRadius: '0px',
                fontSize: '14px',
                fontFamily: "'Pixelify Sans', sans-serif",
                color: '#1E4D3B',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                title="Clear search"
              >
                <X size={15} color="#1E4D3B" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <select
            value={selectedSort}
            onChange={(e) => {
              setSelectedSort(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '9px 12px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #1E4D3B',
              fontFamily: "'Pixelify Sans', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
              color: '#1E4D3B',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: '2px 2px 0px #1E4D3B',
            }}
          >
            <option value="popular">Most Turns</option>
            <option value="alpha">A to Z</option>
            <option value="newest">Recent</option>
          </select>

          {/* Expandable Filter Toggle Button */}
          <button
            type="button"
            onClick={() => {
              try {
                if (sound.playAccordionToggle) sound.playAccordionToggle(!isFilterExpanded);
                else sound.playButtonClick?.();
              } catch {
                // safe audio
              }
              setIsFilterExpanded((prev) => !prev);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: isFilterExpanded || selectedCategory !== 'All' ? '#1E4D3B' : '#FFFFFF',
              color: isFilterExpanded || selectedCategory !== 'All' ? '#FFFFFF' : '#1E4D3B',
              border: '2px solid #1E4D3B',
              padding: '9px 14px',
              fontFamily: "'Pixelify Sans', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '2px 2px 0px #1E4D3B',
              transition: 'all 0.15s ease',
            }}
            title={isFilterExpanded ? 'Collapse category filters' : 'Expand category filters'}
          >
            <Filter size={14} color={isFilterExpanded || selectedCategory !== 'All' ? '#FFFFFF' : '#1E4D3B'} />
            <span>Filters</span>
            {selectedCategory !== 'All' && (
              <span
                style={{
                  backgroundColor: '#E8A857',
                  color: '#1E4D3B',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '2px',
                }}
              >
                1
              </span>
            )}
            {isFilterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* Clear Reset button if active */}
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#FFF0EE',
                border: '2px solid #C84B31',
                padding: '9px 12px',
                fontFamily: "'Pixelify Sans', sans-serif",
                fontWeight: 700,
                fontSize: '12px',
                color: '#C84B31',
                cursor: 'pointer',
                boxShadow: '2px 2px 0px #C84B31',
              }}
              title="Reset search and filters"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}
        </div>

        {/* Expandable Category Drawer */}
        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                border: '2px solid #1E4D3B',
                boxShadow: '3px 3px 0px #1E4D3B',
                padding: '12px 14px',
                marginTop: '4px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px dashed #E2DCCF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Filter size={13} color="#1E4D3B" />
                  <span
                    style={{
                      fontFamily: "'Pixelify Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '12px',
                      color: '#1E4D3B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Select Category
                  </span>
                </div>
                {selectedCategory !== 'All' && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPillClick?.();
                      setSelectedCategory('All');
                      setPage(1);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#C84B31',
                      fontFamily: "'Pixelify Sans', sans-serif",
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    Clear selection
                  </button>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        sound.playPillClick?.();
                        setSelectedCategory(cat);
                        setPage(1);
                      }}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: isSelected ? '#1E4D3B' : '#FBF9F3',
                        color: isSelected ? '#FFFFFF' : '#1E4D3B',
                        border: isSelected ? '2px solid #1E4D3B' : '1px solid #C5BFB2',
                        borderRadius: '0px',
                        fontFamily: "'Pixelify Sans', sans-serif",
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '12px',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '2px 2px 0px #0E3B33' : 'none',
                        transition: 'all 0.1s ease',
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filter Indicator Tag when collapsed */}
        {!isFilterExpanded && selectedCategory !== 'All' && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              alignSelf: 'flex-start',
              marginTop: '2px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontFamily: "'Pixelify Sans', sans-serif",
                color: '#556B5D',
              }}
            >
              Active filter:
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#EDE8DB',
                border: '1px solid #1E4D3B',
                padding: '2px 8px',
                fontSize: '11px',
                fontFamily: "'Pixelify Sans', sans-serif",
                color: '#1E4D3B',
                fontWeight: 700,
              }}
            >
              {selectedCategory}
              <button
                type="button"
                onClick={() => {
                  sound.playPillClick?.();
                  setSelectedCategory('All');
                  setPage(1);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: '#1E4D3B',
                }}
                title="Remove filter"
              >
                <X size={12} />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* 3. Status Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          fontSize: '12px',
          fontFamily: "'Pixelify Sans', sans-serif",
          color: '#556B5D',
        }}
      >
        <span>
          {isLoading
            ? 'Searching topics...'
            : `Showing ${topics.length} of ${pagination.total} discussion topics`}
        </span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div
          style={{
            padding: '36px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            border: '2px solid #1E4D3B',
          }}
        >
          <p
            style={{
              fontFamily: "'Pixelify Sans', sans-serif",
              fontSize: '15px',
              color: '#1E4D3B',
              margin: 0,
            }}
          >
            Loading topics from database...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#FFF0EE',
            border: '2px solid #C84B31',
            marginBottom: '16px',
          }}
        >
          <p style={{ margin: 0, color: '#C84B31', fontFamily: "'Pixelify Sans', sans-serif" }}>
            {error}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && topics.length === 0 && (
        <div
          style={{
            padding: '36px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            border: '2px solid #1E4D3B',
            marginBottom: '16px',
          }}
        >
          <h4
            style={{
              margin: '0 0 8px 0',
              fontFamily: "'Pixelify Sans', sans-serif",
              fontSize: '16px',
              color: '#1E4D3B',
            }}
          >
            No debate topics found
          </h4>
          <p
            style={{
              margin: '0 0 16px 0',
              fontFamily: "'Pixelify Sans', sans-serif",
              fontSize: '13px',
              color: '#556B5D',
            }}
          >
            Try searching for something else or clearing filters.
          </p>
          <button
            onClick={handleResetFilters}
            style={{
              padding: '6px 14px',
              backgroundColor: '#EDE8DB',
              border: '2px solid #1E4D3B',
              fontFamily: "'Pixelify Sans', sans-serif",
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Show All Topics
          </button>
        </div>
      )}

      {/* 4. Sleek Topics Grid */}
      {!isLoading && !error && topics.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '14px',
            marginBottom: '20px',
          }}
        >
          {topics.map((topic) => (
            <motion.div
              key={topic._id || topic.topicId}
              whileHover={{ y: -2, boxShadow: '4px 4px 0px #1E4D3B' }}
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #1E4D3B',
                boxShadow: '2px 2px 0px #1E4D3B',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
                transition: 'box-shadow 0.15s ease',
              }}
            >
              <div>
                {/* Category & Turns */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    fontSize: '11px',
                    fontFamily: "'Pixelify Sans', sans-serif",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: '#EDE8DB',
                      padding: '2px 6px',
                      color: '#1E4D3B',
                      fontWeight: 700,
                    }}
                  >
                    {topic.category}
                  </span>
                  <span style={{ color: '#556B5D', fontWeight: 600 }}>
                    {topic.totalTurns} turns
                  </span>
                </div>

                {/* Topic Title */}
                <h3
                  style={{
                    margin: '0 0 10px 0',
                    fontSize: '15px',
                    fontFamily: "'Pixelify Sans', sans-serif",
                    fontWeight: 700,
                    color: '#1E4D3B',
                    lineHeight: '1.35',
                  }}
                >
                  {topic.topic}
                </h3>

                {/* Sample Excerpt */}
                {topic.sampleExcerpts && topic.sampleExcerpts.length > 0 && (
                  <div
                    style={{
                      backgroundColor: '#F9F6EC',
                      borderLeft: '3px solid #E8A857',
                      padding: '8px 10px',
                      fontSize: '12px',
                      fontFamily: "'Pixelify Sans', sans-serif",
                      color: '#333333',
                      lineHeight: '1.4',
                      fontStyle: 'italic',
                    }}
                  >
                    "{topic.sampleExcerpts[0].slice(0, 140)}
                    {topic.sampleExcerpts[0].length > 140 ? '...' : ''}"
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid #F0ECE1',
                }}
              >
                <button
                  onClick={() => handleOpenTranscript(topic)}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #1E4D3B',
                    padding: '6px 8px',
                    fontFamily: "'Pixelify Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '12px',
                    color: '#1E4D3B',
                    cursor: 'pointer',
                  }}
                >
                  <BookOpen size={13} />
                  View Debate
                </button>

                <button
                  onClick={() => {
                    sound.playSnapChime();
                    if (onSelectTopicForPractice) {
                      onSelectTopicForPractice(
                        topic.topic,
                        debouncedQuery.trim() ? 'manual' : 'random'
                      );
                    }
                  }}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    backgroundColor: '#1E4D3B',
                    border: '1px solid #1E4D3B',
                    padding: '6px 8px',
                    fontFamily: "'Pixelify Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '12px',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  Practice <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 5. Minimal Pagination */}
      {pagination.totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '28px',
          }}
        >
          <button
            disabled={!pagination.hasPrev || isLoading}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 180, behavior: 'smooth' });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              backgroundColor: pagination.hasPrev ? '#FFFFFF' : '#E8E4DA',
              border: '1px solid #1E4D3B',
              color: '#1E4D3B',
              fontFamily: "'Pixelify Sans', sans-serif",
              fontWeight: 700,
              fontSize: '12px',
              cursor: pagination.hasPrev ? 'pointer' : 'default',
            }}
          >
            <ChevronLeft size={13} /> Prev
          </button>

          <span
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontFamily: "'Pixelify Sans', sans-serif",
              fontWeight: 600,
              color: '#1E4D3B',
            }}
          >
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            disabled={!pagination.hasNext || isLoading}
            onClick={() => {
              setPage((p) => Math.min(pagination.totalPages, p + 1));
              window.scrollTo({ top: 180, behavior: 'smooth' });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              backgroundColor: pagination.hasNext ? '#FFFFFF' : '#E8E4DA',
              border: '1px solid #1E4D3B',
              color: '#1E4D3B',
              fontFamily: "'Pixelify Sans', sans-serif",
              fontWeight: 700,
              fontSize: '12px',
              cursor: pagination.hasNext ? 'pointer' : 'default',
            }}
          >
            Next <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* 6. Clean, Minimal Footer Attribution */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '11px',
          fontFamily: "'Pixelify Sans', sans-serif",
          color: '#76857C',
          paddingTop: '12px',
          borderTop: '1px solid #E2DCCF',
        }}
      >
        Dataset: <code>debatellm/DEBATE</code> from Hugging Face • Non-Commercial Research License • Saved in <code>learnwithfun.discussion_topics</code>
      </div>

      {/* 7. Clean Transcript Modal */}
      <AnimatePresence>
        {activeTranscriptTopic && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(30, 77, 59, 0.6)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 9999,
            }}
            onClick={handleCloseTranscript}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '720px',
                maxHeight: '85vh',
                backgroundColor: '#FBF9F3',
                border: '3px solid #1E4D3B',
                boxShadow: '6px 6px 0px #1E4D3B',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  backgroundColor: '#1E4D3B',
                  color: '#FFFFFF',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={16} color="#E8A857" />
                  <span
                    style={{
                      fontFamily: "'Pixelify Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '14px',
                    }}
                  >
                    Debate Conversation
                  </span>
                </div>
                <button
                  onClick={handleCloseTranscript}
                  style={{
                    background: '#C84B31',
                    border: 'none',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    padding: '3px 8px',
                    fontFamily: "'Pixelify Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div
                style={{
                  padding: '16px',
                  overflowY: 'auto',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #1E4D3B',
                    padding: '12px 14px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#E8A857',
                      fontFamily: "'Pixelify Sans', sans-serif",
                      fontWeight: 700,
                      marginBottom: '2px',
                    }}
                  >
                    {activeTranscriptTopic.category.toUpperCase()}
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '16px',
                      fontFamily: "'Pixelify Sans', sans-serif",
                      fontWeight: 700,
                      color: '#1E4D3B',
                    }}
                  >
                    {activeTranscriptTopic.topic}
                  </h3>
                </div>

                {/* Session Selector */}
                {transcriptData?.conversations && transcriptData.conversations.length > 1 && (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span
                      style={{
                        fontFamily: "'Pixelify Sans', sans-serif",
                        fontSize: '12px',
                        color: '#556B5D',
                      }}
                    >
                      Session:
                    </span>
                    {transcriptData.conversations.map((c, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => setSelectedSessionIndex(sIdx)}
                        style={{
                          padding: '3px 8px',
                          backgroundColor: selectedSessionIndex === sIdx ? '#1E4D3B' : '#FFFFFF',
                          color: selectedSessionIndex === sIdx ? '#FFFFFF' : '#1E4D3B',
                          border: '1px solid #1E4D3B',
                          fontFamily: "'Pixelify Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        {sIdx + 1} ({c.turns?.length || 0} turns)
                      </button>
                    ))}
                  </div>
                )}

                {/* Turns */}
                <div>
                  {isTranscriptLoading ? (
                    <div style={{ padding: '20px', textAlign: 'center', fontFamily: "'Pixelify Sans', sans-serif" }}>
                      Loading dialogue...
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(() => {
                        const currentSession =
                          transcriptData?.conversations?.[selectedSessionIndex] ||
                          transcriptData?.conversations?.[0];
                        const turns = currentSession?.turns || [];

                        if (turns.length === 0) {
                          const hasOpinions = transcriptData?.initialOpinions && transcriptData.initialOpinions.length > 0;
                          const hasExcerpts = transcriptData?.sampleExcerpts && transcriptData.sampleExcerpts.length > 0;

                          if (hasOpinions || hasExcerpts) {
                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {hasOpinions && (
                                  <div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E4D3B', marginBottom: '6px', fontFamily: "'Pixelify Sans', sans-serif" }}>
                                      Debater Stances & Initial Opinions:
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      {transcriptData.initialOpinions.map((op, oIdx) => (
                                        <div
                                          key={oIdx}
                                          style={{
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #1E4D3B',
                                            padding: '8px 12px',
                                            fontSize: '12px',
                                            fontFamily: "'Pixelify Sans', sans-serif",
                                          }}
                                        >
                                          <div style={{ fontWeight: 700, color: op.stance === 'Support' ? '#1E4D3B' : op.stance === 'Oppose' ? '#C84B31' : '#556B5D', marginBottom: '3px' }}>
                                            Stance: {op.stance || 'Debater Opinion'} {op.sliderValue != null ? `(Score: ${op.sliderValue})` : ''}
                                          </div>
                                          <div>{op.text}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {hasExcerpts && (
                                  <div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E4D3B', marginBottom: '6px', fontFamily: "'Pixelify Sans', sans-serif" }}>
                                      Sample Arguments & Excerpts:
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      {transcriptData.sampleExcerpts.map((exc, eIdx) => (
                                        <div
                                          key={eIdx}
                                          style={{
                                            backgroundColor: '#F9F6EC',
                                            borderLeft: '3px solid #E8A857',
                                            padding: '8px 10px',
                                            fontSize: '12px',
                                            fontFamily: "'Pixelify Sans', sans-serif",
                                            fontStyle: 'italic',
                                          }}
                                        >
                                          "{exc}"
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return (
                            <div style={{ padding: '12px', textAlign: 'center', color: '#556B5D', fontFamily: "'Pixelify Sans', sans-serif" }}>
                              No detailed dialogue found for this session.
                            </div>
                          );
                        }

                        return turns.map((t, tIdx) => {
                          const isA = tIdx % 2 === 0;
                          return (
                            <div
                              key={tIdx}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isA ? 'flex-start' : 'flex-end',
                              }}
                            >
                              <div
                                style={{
                                  maxWidth: '85%',
                                  backgroundColor: isA ? '#FFFFFF' : '#EDE8DB',
                                  border: '1px solid #1E4D3B',
                                  padding: '8px 12px',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: '12px',
                                    fontSize: '11px',
                                    fontFamily: "'Pixelify Sans', sans-serif",
                                    fontWeight: 700,
                                    color: isA ? '#1E4D3B' : '#7D3B00',
                                    marginBottom: '4px',
                                  }}
                                >
                                  <span>{isA ? 'Speaker 1' : 'Speaker 2'} (Round {t.round || 1})</span>
                                </div>
                                <div
                                  style={{
                                    fontSize: '13px',
                                    fontFamily: "'Pixelify Sans', sans-serif",
                                    lineHeight: '1.4',
                                    color: '#222222',
                                    whiteSpace: 'pre-wrap',
                                  }}
                                >
                                  {t.text}
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>
              </div>

              {/* Inline Rating Section inside Modal */}
              {showModalRating && activeTranscriptTopic && (
                <div style={{ padding: '0 16px 14px 16px', backgroundColor: '#FAF8F0', borderTop: '1px dashed #D8D2C5' }}>
                  <SessionRatingSection
                    topic={activeTranscriptTopic.topic}
                    source={debouncedQuery.trim() ? 'manual' : 'random'}
                    topicType="debate"
                    category={activeTranscriptTopic.category || 'Debate'}
                    durationSeconds={120}
                  />
                </div>
              )}

              {/* Modal Footer */}
              <div
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#EDE8DB',
                  borderTop: '1px solid #D8D2C5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    sound.playStarSelect(5);
                    setShowModalRating((prev) => !prev);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: showModalRating ? '#E8A857' : '#FAF8F0',
                    color: '#1E4D3B',
                    border: '1.5px solid #1E4D3B',
                    padding: '6px 12px',
                    fontFamily: "'Pixelify Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <Star size={14} fill={showModalRating ? '#1E4D3B' : 'none'} color="#1E4D3B" />
                  <span>{showModalRating ? 'Hide Rating' : '⭐ Rate Research Session'}</span>
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      handleCloseTranscript();
                      if (onSelectTopicForPractice) {
                        onSelectTopicForPractice(
                          activeTranscriptTopic.topic,
                          debouncedQuery.trim() ? 'manual' : 'random'
                        );
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#1E4D3B',
                      color: '#FFFFFF',
                      border: '1px solid #1E4D3B',
                      padding: '6px 14px',
                      fontFamily: "'Pixelify Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Practice Topic <ArrowRight size={13} />
                  </button>

                  <button
                    onClick={handleCloseTranscript}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #1E4D3B',
                      fontFamily: "'Pixelify Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '12px',
                      color: '#1E4D3B',
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DebateHub;
