// src/components/SessionRatingSection.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, MessageSquare, BookOpen, Sparkles, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

const RATING_LABELS = {
  1: '1 Star — Needs Work',
  2: '2 Stars — Fair Research',
  3: '3 Stars — Good Learning',
  4: '4 Stars — Great Insights',
  5: '5 Stars — Exceptional Session!',
};

export function SessionRatingSection({
  topic = '',
  source = 'manual', // 'manual' | 'random'
  topicType = 'manual-search',
  category = 'General',
  durationSeconds = 60,
  onSaved,
  onViewHistory,
}) {
  const { addHistoryEntry, openProfile, isAuthenticated, isGuest } = useAuth();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedEntry, setSavedEntry] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentDisplayRating = hoverRating || rating;

  const handleStarClick = (val) => {
    setRating(val);
    sound.playStarSelect(val);
  };

  const handleStarHover = (val) => {
    setHoverRating(val);
    if (val > 0) {
      sound.playPillClick();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!topic || !topic.trim()) {
      setErrorMsg('Topic title is required to save your session.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        topic: topic.trim(),
        source: source === 'random' ? 'random' : 'manual',
        topicType: topicType || (source === 'random' ? 'random-topic' : 'manual-search'),
        category: category || 'General',
        rating,
        feedback: feedback.trim(),
        durationSeconds: Math.max(0, durationSeconds || 0),
      };

      const result = await addHistoryEntry(payload);
      if (result.success) {
        setIsSaved(true);
        setSavedEntry(result.entry);

        if (rating >= 4) {
          try {
            confetti({
              particleCount: 65,
              spread: 70,
              origin: { y: 0.65 },
              colors: ['#E8A857', '#B79AE6', '#1E4D3B', '#FFD700'],
            });
          } catch {
            // ignore
          }
        }

        if (onSaved) onSaved(result.entry);
      } else {
        setErrorMsg(result.error || 'Failed to save to MongoDB');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error saving research session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenProfileHistory = () => {
    sound.playTabSwitch();
    if (onViewHistory) {
      onViewHistory();
    } else {
      openProfile('history');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '2px solid #1E4D3B',
        boxShadow: '4px 4px 0px #1E4D3B',
        borderRadius: '0px',
        padding: '20px 22px',
        width: '100%',
        maxWidth: '560px',
        margin: '18px auto 0 auto',
        textAlign: 'left',
        position: 'relative',
      }}
    >
      <AnimatePresence mode="wait">
        {isSaved ? (
          <motion.div
            key="saved-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ textAlign: 'center', padding: '10px 0' }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                backgroundColor: '#DCFCE7',
                border: '2px solid #166534',
                color: '#166534',
                marginBottom: '12px',
              }}
            >
              <CheckCircle2 size={24} />
            </div>

            <h3
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '12px',
                color: '#1E4D3B',
                lineHeight: '1.4',
                marginBottom: '8px',
              }}
            >
              RESEARCH SAVED TO HISTORY!
            </h3>

            <p
              style={{
                fontFamily: "'Pixelify Sans', monospace",
                fontSize: '14px',
                color: '#556B5D',
                margin: '0 0 14px 0',
              }}
            >
              Your rating of <strong style={{ color: '#1E4D3B' }}>{rating}/5 Stars</strong> has been securely recorded in your MongoDB profile history.
            </p>

            {/* Stars display */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '16px',
              }}
            >
              {[1, 2, 3, 4, 5].map((starVal) => (
                <Star
                  key={starVal}
                  size={20}
                  fill={starVal <= rating ? '#E8A857' : 'none'}
                  color={starVal <= rating ? '#B45309' : '#C4D1CB'}
                  strokeWidth={2}
                />
              ))}
            </div>

            {feedback && (
              <div
                style={{
                  backgroundColor: '#FAF8F0',
                  border: '1.5px dashed #1E4D3B',
                  padding: '10px 14px',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '13px',
                  color: '#2C493B',
                  fontStyle: 'italic',
                  marginBottom: '18px',
                  textAlign: 'left',
                }}
              >
                “{feedback}”
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleOpenProfileHistory}
                style={{
                  backgroundColor: '#1E4D3B',
                  color: '#FFFFFF',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '9.5px',
                  padding: '10px 16px',
                  border: '2px solid #0E3B33',
                  boxShadow: '3px 3px 0px #0E3B33',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>VIEW PROFILE HISTORY</span>
                <ExternalLink size={12} />
              </button>

              <button
                type="button"
                onClick={() => setIsSaved(false)}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#4B6356',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '8px 14px',
                  border: '1.5px solid #C4D1CB',
                  cursor: 'pointer',
                }}
              >
                Edit Rating
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="rating-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '10px',
                paddingBottom: '10px',
                borderBottom: '1.5px dashed #DFDACB',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#E8A857" />
                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '10px',
                    color: '#1E4D3B',
                    letterSpacing: '0.04em',
                  }}
                >
                  RATE YOUR RESEARCH
                </span>
              </div>

              {/* Source tag: Manually Searched vs Randomly Generated */}
              <span
                style={{
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  border: '1px solid #1E4D3B',
                  backgroundColor: source === 'random' ? '#EDE9FE' : '#FEF3C7',
                  color: source === 'random' ? '#5B21B6' : '#92400E',
                  boxShadow: '1.5px 1.5px 0px #1E4D3B',
                }}
              >
                {source === 'random' ? 'Random Topic' : 'Manually Searched'}
              </span>
            </div>

            {/* Topic preview snippet */}
            <div
              style={{
                fontFamily: "'Pixelify Sans', monospace",
                fontSize: '14.5px',
                fontWeight: 600,
                color: '#1E4D3B',
                lineHeight: '1.35',
                marginBottom: '14px',
              }}
            >
              “{topic}”
            </div>

            {/* Star Rating Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '8.5px',
                  color: '#658274',
                  marginBottom: '8px',
                }}
              >
                SATISFACTION RATING (1-5 STARS):
              </label>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isFilled = starVal <= currentDisplayRating;
                  return (
                    <motion.button
                      key={starVal}
                      type="button"
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStarClick(starVal)}
                      onMouseEnter={() => handleStarHover(starVal)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={`${starVal} star${starVal > 1 ? 's' : ''}`}
                    >
                      <Star
                        size={28}
                        fill={isFilled ? '#E8A857' : '#FFFFFF'}
                        color={isFilled ? '#B45309' : '#A4B5AC'}
                        strokeWidth={2}
                        style={{
                          filter: isFilled ? 'drop-shadow(1.5px 1.5px 0px #1E4D3B)' : 'none',
                          transition: 'all 0.12s ease',
                        }}
                      />
                    </motion.button>
                  );
                })}

                <span
                  style={{
                    marginLeft: '8px',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '14px',
                    fontWeight: 700,
                    color: currentDisplayRating >= 4 ? '#166534' : currentDisplayRating >= 3 ? '#92400E' : '#B91C1C',
                  }}
                >
                  {RATING_LABELS[currentDisplayRating] || `${currentDisplayRating} Stars`}
                </span>
              </div>
            </div>

            {/* Feedback / Notes input */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '8.5px',
                  color: '#658274',
                  marginBottom: '6px',
                }}
              >
                <MessageSquare size={12} />
                <span>FEEDBACK & REFLECTION NOTES (OPTIONAL):</span>
              </label>

              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What did you learn or articulate during this research session? Any insights or key points..."
                rows={2}
                maxLength={400}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '14px',
                  color: '#1E4D3B',
                  backgroundColor: '#FAF8F0',
                  border: '2px solid #1E4D3B',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {errorMsg && (
              <div
                style={{
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '13px',
                  color: '#B91C1C',
                  backgroundColor: '#FEE2E2',
                  padding: '6px 10px',
                  border: '1px solid #F87171',
                  marginBottom: '12px',
                }}
              >
                {errorMsg}
              </div>
            )}

            {isGuest && (
              <div
                style={{
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '12px',
                  color: '#854D0E',
                  backgroundColor: '#FEF9C3',
                  padding: '6px 10px',
                  border: '1px solid #FDE047',
                  marginBottom: '12px',
                }}
              >
                ℹ️ You are in Guest mode. Sign in to permanently save your research history to your MongoDB account across devices.
              </div>
            )}

            {/* Submit Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <motion.button
                type="button"
                whileHover={{ y: -2, boxShadow: '4px 4px 0px #0E3B33' }}
                whileTap={{ y: 2, x: 2, boxShadow: '1px 1px 0px #0E3B33' }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  backgroundColor: '#1E4D3B',
                  color: '#F9F6EC',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '10px',
                  padding: '11px 16px',
                  border: '2px solid #0E3B33',
                  boxShadow: '3px 3px 0px #0E3B33',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>★</span>
                <span>{isSubmitting ? 'SAVING...' : 'SAVE TO HISTORY'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
