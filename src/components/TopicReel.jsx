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
        padding: '14px 18px',
        overflow: 'hidden',
        userSelect: 'none',
        backgroundColor: '#FCFBF7',
        border: '2px solid #1E4D3B',
        borderRadius: '0px',
        boxShadow: '4px 4px 0px #1E4D3B',
      }}
    >
      {/* Top faded row */}
      <div
        style={{
          minHeight: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          opacity: isSpinning ? 0.35 : 0.45,
          transform: isSpinning ? 'translateY(-10px) scale(0.96)' : 'none',
          transition: 'all 0.15s steps(3, end)',
          pointerEvents: 'none',
        }}
      >
        {prevTopic && (
          <RowItem
            item={prevTopic}
            mode={mode}
            isCenter={false}
            opacity={0.4}
            fontSize="14px"
          />
        )}
      </div>

      {/* Top pixel divider line */}
      <div
        style={{
          width: '100%',
          height: '0px',
          borderTop: '2px dashed #D9D5C7',
          margin: '8px 0',
          position: 'relative',
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
          padding: '8px 12px',
          position: 'relative',
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
                fontSize={mode === 'learn-vocab' ? '20px' : '20px'}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom pixel divider line */}
      <div
        style={{
          width: '100%',
          height: '0px',
          borderTop: '2px dashed #D9D5C7',
          margin: '8px 0',
          position: 'relative',
        }}
      />

      {/* Bottom faded row */}
      <div
        style={{
          minHeight: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          opacity: isSpinning ? 0.35 : 0.45,
          transform: isSpinning ? 'translateY(10px) scale(0.96)' : 'none',
          transition: 'all 0.15s steps(3, end)',
          pointerEvents: 'none',
        }}
      >
        {nextTopic && (
          <RowItem
            item={nextTopic}
            mode={mode}
            isCenter={false}
            opacity={0.4}
            fontSize="14px"
          />
        )}
      </div>
    </div>
  );
}

function RowItem({ item, mode, isCenter, fontSize }) {
  if (!item) return null;

  if (mode === 'learn-vocab') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: isCenter ? "'Press Start 2P', monospace" : "'Pixelify Sans', monospace",
            fontSize: isCenter ? '18px' : '15px',
            color: isCenter ? '#1E4D3B' : '#73877E',
            fontWeight: isCenter ? 700 : 500,
            lineHeight: 1.25,
            letterSpacing: '0.04em',
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
              marginTop: '8px',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#557667', fontFamily: "'Pixelify Sans', monospace" }}>
                [{item.phonetic}]
              </span>
              <span
                style={{
                  fontSize: '11px',
                  backgroundColor: '#ECE7DA',
                  padding: '2px 7px',
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
                fontSize: '15px',
                color: '#4A685B',
                maxWidth: '440px',
                lineHeight: 1.35,
                marginTop: '4px',
                fontFamily: "'Pixelify Sans', monospace",
                fontWeight: 500,
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            fontSize: isCenter ? '9px' : '8px',
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
            fontSize: isCenter ? '20px' : '14px',
            color: isCenter ? '#1E4D3B' : '#73877E',
            fontWeight: isCenter ? 600 : 400,
            lineHeight: '1.35',
            maxWidth: '460px',
            display: '-webkit-box',
            WebkitLineClamp: isCenter ? 3 : 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
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
        fontSize: isCenter ? '20.5px' : '14px',
        color: isCenter ? '#1E4D3B' : '#73877E',
        fontWeight: isCenter ? 600 : 400,
        lineHeight: '1.38',
        maxWidth: '460px',
        display: '-webkit-box',
        WebkitLineClamp: isCenter ? 3 : 1,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}
    >
      {item.text}
    </div>
  );
}
