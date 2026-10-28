// src/components/SpeechAnalysisModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Activity, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { useAuth } from '../context/AuthContext';

export function SpeechAnalysisModal({ isOpen, onClose, topicData, onTryAgain }) {
  const { currentUser } = useAuth();
  const nickname = currentUser?.nickname || currentUser?.username || 'Speaker';

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
        onClick={() => {
          sound.playModalClose();
          onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#FCFBF7',
            border: '3px solid #1E4D3B',
            borderRadius: '0px',
            boxShadow: '6px 6px 0px #1E4D3B',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 'clamp(16px, 4vw, 28px)',
            color: '#1E4D3B',
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              sound.playModalClose();
              onClose();
            }}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              width: '32px',
              height: '32px',
              borderRadius: '0px',
              backgroundColor: '#EDE9DC',
              border: '2px solid #1E4D3B',
              boxShadow: '2px 2px 0px #1E4D3B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#345747',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#DFD9C9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EDE9DC')}
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span
              style={{
                backgroundColor: '#B79AE6',
                color: '#FFFFFF',
                width: '32px',
                height: '32px',
                borderRadius: '0px',
                border: '2px solid #1E4D3B',
                boxShadow: '2px 2px 0px #1E4D3B',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={18} />
            </span>
            <h2
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '15px',
                color: '#1E4D3B',
                lineHeight: '1.4',
                margin: 0,
              }}
            >
              SPEECH ANALYSIS REPORT
            </h2>
          </div>

          <div
            style={{
              fontSize: '13px',
              color: '#658274',
              marginBottom: '6px',
              fontFamily: "'Pixelify Sans', monospace",
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Speaker:</span>
            <strong style={{ color: '#1E4D3B' }}>{nickname}</strong>
          </div>

          <div
            style={{
              fontSize: '13px',
              color: '#658274',
              marginBottom: '20px',
              fontFamily: "'Pixelify Sans', monospace",
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
                border: '2px solid #1E4D3B',
                boxShadow: '3px 3px 0px #1E4D3B',
                borderRadius: '0px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '9px', color: '#688274', fontWeight: 400, fontFamily: "'Press Start 2P', monospace", textTransform: 'uppercase' }}>
                CLARITY
              </div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '22px',
                  color: '#1E4D3B',
                  lineHeight: '1.3',
                  marginTop: '8px',
                  marginBottom: '6px',
                }}
              >
                {clarityScore}
                <span style={{ fontSize: '11px', color: '#88A396' }}>/100</span>
              </div>
              <div style={{ fontSize: '12px', color: '#2E7D32', fontWeight: 600, fontFamily: "'Pixelify Sans', monospace" }}>
                ★ High Articulation
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#F3EFE3',
                border: '2px solid #1E4D3B',
                boxShadow: '3px 3px 0px #1E4D3B',
                borderRadius: '0px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '9px', color: '#688274', fontWeight: 400, fontFamily: "'Press Start 2P', monospace", textTransform: 'uppercase' }}>
                PACE (WPM)
              </div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '22px',
                  color: '#1E4D3B',
                  lineHeight: '1.3',
                  marginTop: '8px',
                  marginBottom: '6px',
                }}
              >
                {wpm}
              </div>
              <div style={{ fontSize: '12px', color: '#1E4D3B', fontWeight: 600, fontFamily: "'Pixelify Sans', monospace" }}>
                Ideal conversational rate
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#F3EFE3',
                border: '2px solid #1E4D3B',
                boxShadow: '3px 3px 0px #1E4D3B',
                borderRadius: '0px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '9px', color: '#688274', fontWeight: 400, fontFamily: "'Press Start 2P', monospace", textTransform: 'uppercase' }}>
                FILLERS
              </div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '22px',
                  color: '#E8A857',
                  lineHeight: '1.3',
                  marginTop: '8px',
                  marginBottom: '6px',
                }}
              >
                {fillerCount}
              </div>
              <div style={{ fontSize: '12px', color: '#4E6C5E', fontWeight: 600, fontFamily: "'Pixelify Sans', monospace" }}>
                2% of total speech
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#F3EFE3',
                border: '2px solid #1E4D3B',
                boxShadow: '3px 3px 0px #1E4D3B',
                borderRadius: '0px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '9px', color: '#688274', fontWeight: 400, fontFamily: "'Press Start 2P', monospace", textTransform: 'uppercase' }}>
                PAUSES
              </div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '22px',
                  color: '#B79AE6',
                  lineHeight: '1.3',
                  marginTop: '8px',
                  marginBottom: '6px',
                }}
              >
                {pauseCount}
              </div>
              <div style={{ fontSize: '12px', color: '#4E6C5E', fontWeight: 600, fontFamily: "'Pixelify Sans', monospace" }}>
                Natural pacing
              </div>
            </div>
          </div>

          {/* Filler Word Breakdown */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #1E4D3B',
              boxShadow: '3px 3px 0px #1E4D3B',
              borderRadius: '0px',
              padding: '14px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 400,
                color: '#1E4D3B',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Press Start 2P', monospace",
              }}
            >
              <Activity size={15} color="#E8A857" />
              <span>FILLER WORD FREQUENCY</span>
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
                    border: `1.5px solid ${f.count > 0 ? '#1E4D3B' : '#E5E2D6'}`,
                    padding: '4px 10px',
                    borderRadius: '0px',
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: "'Pixelify Sans', monospace",
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
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
              border: '2px solid #1E4D3B',
              boxShadow: '3px 3px 0px #1E4D3B',
              borderRadius: '0px',
              padding: '16px',
              marginBottom: '22px',
            }}
          >
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 400,
                color: '#1E4D3B',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Press Start 2P', monospace",
              }}
            >
              <CheckCircle2 size={15} color="#22C55E" />
              <span>COACHING INSIGHTS</span>
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: '18px',
                fontSize: '14px',
                fontFamily: "'Pixelify Sans', monospace",
                color: '#345244',
                lineHeight: '1.45',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
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
              gap: '12px',
              paddingTop: '12px',
              borderTop: '2px dashed #E8E3D5',
            }}
          >
            <button
              onClick={() => {
                sound.playModalClose();
                onClose();
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#496B5B',
                padding: '9px 16px',
                borderRadius: '0px',
                border: '2px solid #1E4D3B',
                boxShadow: '2px 2px 0px #1E4D3B',
                fontSize: '10px',
                fontFamily: "'Press Start 2P', monospace",
                fontWeight: 400,
                cursor: 'pointer',
              }}
            >
              CLOSE
            </button>

            <button
              onClick={() => {
                sound.playButtonClick();
                handleConfetti();
                onTryAgain();
                onClose();
              }}
              style={{
                backgroundColor: '#1E4D3B',
                color: '#FFFFFF',
                padding: '10px 18px',
                borderRadius: '0px',
                border: '2px solid #0E3B33',
                boxShadow: '3px 3px 0px #0E3B33',
                fontSize: '10px',
                fontFamily: "'Press Start 2P', monospace",
                fontWeight: 400,
                cursor: 'pointer',
              }}
            >
              TRY ANOTHER ▶
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
