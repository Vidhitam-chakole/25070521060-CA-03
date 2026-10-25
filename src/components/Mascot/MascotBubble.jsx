// src/components/Mascot/MascotBubble.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useMascot } from '../../context/MascotContext';

export function MascotBubble({ bubble, facing, onClose }) {
  const { setMood } = useMascot();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect (25ms per char)
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    setMood('talking');

    const fullText = bubble?.text || '';
    let index = 0;

    const interval = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
        setMood('idle');
      }
    }, 24);

    return () => {
      clearInterval(interval);
      setMood('idle');
    };
  }, [bubble?.text, setMood]);

  // Auto-dismiss if specified
  useEffect(() => {
    if (bubble?.autoDismiss && bubble.autoDismiss > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, bubble.autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [bubble?.autoDismiss, onClose]);

  // Bubble position: above mascot, flipped depending on facing direction
  const isFacingRight = facing === 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      aria-live="polite"
      style={{
        position: 'absolute',
        bottom: '102px',
        left: isFacingRight ? '10px' : '-160px',
        minWidth: '220px',
        maxWidth: '280px',
        backgroundColor: '#F9F6EC',
        border: '2px solid #1E4D3B',
        borderRadius: '16px',
        padding: '12px 16px',
        boxShadow: '0 8px 24px rgba(30, 77, 59, 0.16)',
        color: '#1E4D3B',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '13.5px',
        lineHeight: '1.4',
        pointerEvents: 'auto',
        zIndex: 1010,
        userSelect: 'text',
      }}
    >
      {/* Speech Bubble Tail */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10px',
          left: isFacingRight ? '24px' : 'calc(100% - 38px)',
          width: 0,
          height: 0,
          borderLeft: '9px solid transparent',
          borderRight: '9px solid transparent',
          borderTop: '10px solid #1E4D3B',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-7.5px',
          left: isFacingRight ? '25px' : 'calc(100% - 37px)',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid #F9F6EC',
        }}
      />

      {/* Header bar / Close */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontFamily: "'Caveat Brush', cursive",
            color: '#2A6B52',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          Vidhitam
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#658274',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Message Text with Typewriter */}
      <p style={{ margin: 0, minHeight: '38px', color: '#1E4D3B', fontWeight: 500 }}>
        {displayedText}
        {isTyping && <span style={{ opacity: 0.6 }}>|</span>}
      </p>

      {/* Buttons (Next, Skip) if provided */}
      {bubble?.buttons && bubble.buttons.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '10px',
          }}
        >
          {bubble.onSkip && (
            <button
              onClick={bubble.onSkip}
              style={{
                fontSize: '11.5px',
                color: '#688678',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                padding: '4px 8px',
              }}
            >
              Skip tour
            </button>
          )}

          {bubble.onNext && (
            <button
              onClick={bubble.onNext}
              style={{
                fontSize: '11.5px',
                color: '#FFFFFF',
                backgroundColor: '#1E4D3B',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                padding: '4px 14px',
                boxShadow: '0 2px 6px rgba(30, 77, 59, 0.2)',
              }}
            >
              {bubble.buttons[0] || 'Next'}
            </button>
          )}
        </div>
      )}

      {/* Progress Dots if tour */}
      {bubble?.progress && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            marginTop: '8px',
          }}
        >
          {Array.from({ length: bubble.progress.total }).map((_, idx) => (
            <span
              key={idx}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: idx + 1 === bubble.progress.current ? '#E3A857' : '#D9D5C7',
                transition: 'background-color 0.2s ease',
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
