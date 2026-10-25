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
        padding: '12px 16px',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Top faded row */}
      <div
        style={{
          minHeight: '44px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          opacity: isSpinning ? 0.35 : 0.45,
          transform: isSpinning ? 'translateY(-12px) scale(0.95)' : 'none',
          transition: 'all 0.25s ease',
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

      {/* Top divider line */}
      <div
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#D9D5C7',
          margin: '10px 0',
          position: 'relative',
        }}
      />

      {/* CENTER ROW (active topic) */}
      <div
        style={{
          minHeight: mode === 'learn-vocab' ? '90px' : '96px',
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
            initial={{ opacity: 0, y: isSpinning ? 24 : 10, filter: isSpinning ? 'blur(4px)' : 'blur(0px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(2px)' }}
            transition={{
              duration: isSpinning ? 0.15 : 0.4,
              ease: [0.16, 1, 0.3, 1],
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
                fontSize={mode === 'learn-vocab' ? '34px' : '20.5px'}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom divider line */}
      <div
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#D9D5C7',
          margin: '10px 0',
          position: 'relative',
        }}
      />

      {/* Bottom faded row */}
      <div
        style={{
          minHeight: '44px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          opacity: isSpinning ? 0.35 : 0.45,
          transform: isSpinning ? 'translateY(12px) scale(0.95)' : 'none',
          transition: 'all 0.25s ease',
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
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize,
            color: isCenter ? '#1E4D3B' : '#73877E',
            fontWeight: isCenter ? 600 : 400,
            lineHeight: 1.1,
            letterSpacing: '0.01em',
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
              gap: '2px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#557667', fontStyle: 'italic' }}>
                {item.phonetic}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  backgroundColor: '#ECE7DA',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  color: '#345547',
                  fontWeight: 600,
                }}
              >
                {item.partOfSpeech}
              </span>
            </div>
            <span
              style={{
                fontSize: '12.5px',
                color: '#4A685B',
                maxWidth: '420px',
                lineHeight: 1.35,
                marginTop: '4px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <span
          style={{
            fontSize: isCenter ? '11px' : '9.5px',
            color: '#7D958A',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {item.categoryLabel}
        </span>
        <span
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize,
            color: isCenter ? '#1E4D3B' : '#73877E',
            fontWeight: isCenter ? 600 : 400,
            lineHeight: '1.3',
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
        fontFamily: "'DM Serif Display', Georgia, serif",
        fontSize,
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
      {item.text}
    </div>
  );
}
