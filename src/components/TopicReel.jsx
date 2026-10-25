// src/components/TopicReel.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TopicReel({
  mode,
  prevTopic,
  currentTopic,
  nextTopic,
  isSpinning,
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(10px, 2.5vw, 16px) clamp(12px, 3vw, 20px)',
        overflow: 'hidden',
        userSelect: 'none',
        background: 'linear-gradient(180deg, #EFECE1 0%, #FCFBF7 18%, #FCFBF7 82%, #EFECE1 100%)',
        border: '2px solid #1E4D3B',
        borderRadius: '0px',
        boxShadow: '4px 4px 0px #1E4D3B',
        perspective: '600px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Top curved cylinder row (previous topic) */}
      <div
        style={{
          minHeight: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          opacity: isSpinning ? 0.3 : 0.45,
          transform: isSpinning
            ? 'perspective(360px) rotateX(36deg) translateY(-10px) scale(0.88)'
            : 'perspective(360px) rotateX(26deg) scale(0.92) translateY(2px)',
          transformOrigin: '50% 100%',
          filter: 'drop-shadow(0 2px 2px rgba(30,77,59,0.08))',
          transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
        }}
      >
        {prevTopic && (
          <RowItem
            item={prevTopic}
            mode={mode}
            isCenter={false}
            opacity={0.4}
          />
        )}
      </div>

      {/* Top pixel cylinder divider line */}
      <div
        style={{
          width: '100%',
          height: '0px',
          borderTop: '2px dashed #C8C3B3',
          margin: '7px 0',
          position: 'relative',
          transform: 'scaleX(0.98)',
        }}
      />

      {/* CENTER ROW (active topic) */}
      <div
        style={{
          minHeight: mode === 'learn-vocab' ? '92px' : '96px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '8px 10px',
          position: 'relative',
          transform: 'translateZ(10px)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTopic?.id || 'empty'}
            initial={{ opacity: 0, y: isSpinning ? 18 : 8, filter: isSpinning ? 'blur(2px)' : 'blur(0px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(1px)' }}
            transition={{
              duration: isSpinning ? 0.1 : 0.25,
              ease: 'easeOut',
            }}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {currentTopic && (
              <RowItem
                item={currentTopic}
                mode={mode}
                isCenter={true}
                opacity={1}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom pixel cylinder divider line */}
      <div
        style={{
          width: '100%',
          height: '0px',
          borderTop: '2px dashed #C8C3B3',
          margin: '7px 0',
          position: 'relative',
          transform: 'scaleX(0.98)',
        }}
      />

      {/* Bottom curved cylinder row (next topic) */}
      <div
        style={{
          minHeight: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          opacity: isSpinning ? 0.3 : 0.45,
          transform: isSpinning
            ? 'perspective(360px) rotateX(-36deg) translateY(10px) scale(0.88)'
            : 'perspective(360px) rotateX(-26deg) scale(0.92) translateY(-2px)',
          transformOrigin: '50% 0%',
          filter: 'drop-shadow(0 -2px 2px rgba(30,77,59,0.08))',
          transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
        }}
      >
        {nextTopic && (
          <RowItem
            item={nextTopic}
            mode={mode}
            isCenter={false}
            opacity={0.4}
          />
        )}
      </div>
    </div>
  );
}

function RowItem({ item, mode, isCenter }) {
  if (!item) return null;

  if (mode === 'learn-vocab') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: isCenter ? "'Press Start 2P', monospace" : "'Pixelify Sans', monospace",
            fontSize: isCenter ? 'clamp(14px, 3.8vw, 18px)' : 'clamp(11px, 3vw, 14px)',
            color: isCenter ? '#1E4D3B' : '#73877E',
            fontWeight: isCenter ? 700 : 500,
            lineHeight: 1.25,
            letterSpacing: isCenter ? '0.04em' : '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {item.word}
        </span>

        {isCenter && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '6px',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: '#557667', fontFamily: "'Pixelify Sans', monospace" }}>
                [{item.phonetic}]
              </span>
              <span
                style={{
                  fontSize: '10px',
                  backgroundColor: '#ECE7DA',
                  padding: '1px 6px',
                  borderRadius: '0px',
                  border: '1px solid #1E4D3B',
                  color: '#345547',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {item.partOfSpeech}
              </span>
            </div>
            <span
              style={{
                fontSize: 'clamp(12px, 3.2vw, 15px)',
                color: '#4A685B',
                maxWidth: '440px',
                lineHeight: 1.35,
                marginTop: '4px',
                fontFamily: "'Pixelify Sans', monospace",
                fontWeight: 500,
                padding: '0 4px',
              }}
            >
              {item.definition}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'deep-research') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
        <span
          style={{
            fontSize: isCenter ? 'clamp(8px, 2vw, 9px)' : '7px',
            color: '#7D958A',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 700,
            fontFamily: "'Press Start 2P', monospace",
          }}
        >
          {item.categoryLabel}
        </span>
        <span
          style={{
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: isCenter ? 'clamp(15px, 3.8vw, 20px)' : 'clamp(11px, 2.8vw, 14px)',
            color: isCenter ? '#1E4D3B' : '#73877E',
            fontWeight: isCenter ? 600 : 400,
            lineHeight: '1.35',
            maxWidth: '460px',
            display: '-webkit-box',
            WebkitLineClamp: isCenter ? 3 : 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            padding: '0 4px',
          }}
        >
          {item.title}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Pixelify Sans', monospace",
        fontSize: isCenter ? 'clamp(16px, 4vw, 20.5px)' : 'clamp(11px, 2.8vw, 14px)',
        color: isCenter ? '#1E4D3B' : '#73877E',
        fontWeight: isCenter ? 600 : 400,
        lineHeight: '1.38',
        maxWidth: '460px',
        display: '-webkit-box',
        WebkitLineClamp: isCenter ? 3 : 1,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        padding: '0 4px',
      }}
    >
      {item.text}
    </div>
  );
}
