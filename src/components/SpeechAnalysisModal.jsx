// src/components/SpeechAnalysisModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Activity, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function SpeechAnalysisModal({ isOpen, onClose, topicData, onTryAgain }) {
  if (!isOpen) return null;

  const topicText = topicData?.topic || 'Defend that cursive handwriting should be the only form of writing.';
  const mode = topicData?.mode || 'random-topics';

  const clarityScore = 92;
  const wpm = 138;
  const fillerCount = 3;
  const pauseCount = 4;

  const handleConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#E8A857', '#B79AE6', '#1E4D3B'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(30, 77, 59, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#FCFBF7',
            border: '1.5px solid #D9D5C7',
            borderRadius: '16px',
            boxShadow: '0 20px 48px -8px rgba(30, 77, 59, 0.28)',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            color: '#1E4D3B',
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#EDE9DC',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#345747',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#DFD9C9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EDE9DC')}
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span
              style={{
                backgroundColor: '#B79AE6',
                color: '#FFFFFF',
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={18} />
            </span>
            <h2
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: '26px',
                color: '#1E4D3B',
                margin: 0,
              }}
            >
              Speech Analysis Report
            </h2>
          </div>

          <div
            style={{
              fontSize: '12px',
              color: '#658274',
              marginBottom: '20px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Topic:{' '}
            <strong style={{ color: '#1E4D3B', fontStyle: 'italic' }}>
              “{topicText}”
            </strong>
          </div>

          {/* Metric Cards Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                backgroundColor: '#F3EFE3',
                border: '1px solid #DFD9C8',
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '11px', color: '#688274', fontWeight: 600, textTransform: 'uppercase' }}>
                Clarity Score
              </div>
              <div
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: '32px',
                  color: '#1E4D3B',
                  lineHeight: '1.2',
                }}
              >
                {clarityScore}
                <span style={{ fontSize: '16px', color: '#88A396' }}>/100</span>
              </div>
              <div style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>
                ★ High Articulation
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#F3EFE3',
                border: '1px solid #DFD9C8',
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '11px', color: '#688274', fontWeight: 600, textTransform: 'uppercase' }}>
                Pace (WPM)
              </div>
              <div
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: '32px',
                  color: '#1E4D3B',
                  lineHeight: '1.2',
                }}
              >
                {wpm}
              </div>
              <div style={{ fontSize: '11px', color: '#1E4D3B', fontWeight: 600 }}>
                Ideal conversational rate
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#F3EFE3',
                border: '1px solid #DFD9C8',
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '11px', color: '#688274', fontWeight: 600, textTransform: 'uppercase' }}>
                Filler Words
              </div>
              <div
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: '32px',
                  color: '#E8A857',
                  lineHeight: '1.2',
                }}
              >
                {fillerCount}
              </div>
              <div style={{ fontSize: '11px', color: '#4E6C5E', fontWeight: 600 }}>
                2% of total speech
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#F3EFE3',
                border: '1px solid #DFD9C8',
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '11px', color: '#688274', fontWeight: 600, textTransform: 'uppercase' }}>
                Intentional Pauses
              </div>
              <div
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: '32px',
                  color: '#B79AE6',
                  lineHeight: '1.2',
                }}
              >
                {pauseCount}
              </div>
              <div style={{ fontSize: '11px', color: '#4E6C5E', fontWeight: 600 }}>
                Natural rhetorical pacing
              </div>
            </div>
          </div>

          {/* Filler Word Breakdown */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E0D2',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#1E4D3B',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Activity size={15} color="#E8A857" />
              <span>Filler Word Frequency</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { word: 'um', count: 1 },
                { word: 'like', count: 2 },
                { word: 'you know', count: 0 },
                { word: 'actually', count: 0 },
                { word: 'so...', count: 0 },
              ].map((f, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: f.count > 0 ? '#FEF3C7' : '#F4F3ED',
                    color: f.count > 0 ? '#92400E' : '#71877C',
                    border: `1px solid ${f.count > 0 ? '#FDE68A' : '#E5E2D6'}`,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'gap',
                    gap: '4px',
                  }}
                >
                  <span>"{f.word}"</span>
                  <span style={{ opacity: 0.8 }}>×{f.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Strengths & Coaching Feedback */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E0D2',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '22px',
            }}
          >
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#1E4D3B',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle2 size={15} color="#22C55E" />
              <span>Coaching Insights & Key Highlights</span>
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: '18px',
                fontSize: '12.5px',
                color: '#345244',
                lineHeight: '1.5',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <li>
                <strong>Hook & Opening:</strong> You established your core argument within the first 10 seconds, immediately engaging the listener.
              </li>
              <li>
                <strong>Cadence & Inflection:</strong> Excellent pitch modulation during the rhetorical questions; maintained strong vocal energy throughout.
              </li>
              {mode === 'interview-prep' && (
                <li>
                  <strong>Framework Alignment:</strong> Well-structured progression through Situation and Action; recommend expanding the quantifiable Result metrics by 15 seconds.
                </li>
              )}
              {mode === 'learn-vocab' && (
                <li>
                  <strong>Vocabulary Utilization:</strong> The target word was seamlessly integrated into natural context rather than feeling forced.
                </li>
              )}
              {mode === 'deep-research' && (
                <li>
                  <strong>Conceptual Density:</strong> Clear balance between technical jargon and accessible analogy, ideal for cross-disciplinary communication.
                </li>
              )}
            </ul>
          </div>

          {/* Action Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              paddingTop: '8px',
              borderTop: '1px solid #E8E3D5',
            }}
          >
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                color: '#496B5B',
                padding: '9px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>

            <button
              onClick={() => {
                handleConfetti();
                onTryAgain();
                onClose();
              }}
              style={{
                backgroundColor: '#1E4D3B',
                color: '#FFFFFF',
                padding: '9px 22px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 3px 8px rgba(30, 77, 59, 0.2)',
              }}
            >
              Practice Another Topic →
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
