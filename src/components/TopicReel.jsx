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
        padding: '0 4px 14px 4px',
        userSelect: 'none',
      }}
    >
      {/* 1. CRADLE STAND LEGS (Supporting the cylindrical lucky draw drum) */}
      <div
        style={{
          position: 'absolute',
          bottom: '2px',
          left: '14px',
          right: '14px',
          height: '20px',
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          zIndex: 0,
        }}
      >
        {/* Left Stand Leg */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: '8px',
              height: '24px',
              backgroundColor: '#1E4D3B',
              border: '1px solid #0E3B33',
              transform: 'skewX(-14deg)',
              boxShadow: '-2px 2px 0px #0E3B33',
            }}
          />
          <div
            style={{
              width: '26px',
              height: '5px',
              backgroundColor: '#0E3B33',
              borderRadius: '0px',
            }}
          />
        </div>

        {/* Base Crossbar connecting the cradle */}
        <div
          style={{
            flex: 1,
            height: '4px',
            backgroundColor: '#1E4D3B',
            border: '1px solid #0E3B33',
            margin: '0 -2px 1px -2px',
            opacity: 0.9,
          }}
        />

        {/* Right Stand Leg */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: '8px',
              height: '24px',
              backgroundColor: '#1E4D3B',
              border: '1px solid #0E3B33',
              transform: 'skewX(14deg)',
              boxShadow: '2px 2px 0px #0E3B33',
            }}
          />
          <div
            style={{
              width: '26px',
              height: '5px',
              backgroundColor: '#0E3B33',
              borderRadius: '0px',
            }}
          />
        </div>
      </div>

      {/* 2. THE CYLINDRICAL LUCKY DRAW DRUM ASSEMBLY */}
      <motion.div
        animate={isSpinning ? { y: [-1, 1, -0.5, 0.5, 0] } : { y: 0 }}
        transition={isSpinning ? { repeat: Infinity, duration: 0.12 } : {}}
        style={{
          position: 'relative',
          width: '100%',
          zIndex: 1,
        }}
      >
        {/* Left Drum End Cap / Disc Flange */}
        <div
          style={{
            position: 'absolute',
            left: '-12px',
            top: '8%',
            height: '84%',
            width: '16px',
            borderRadius: '12px 0 0 12px',
            background: 'linear-gradient(180deg, #163E2F 0%, #2A6650 30%, #43876B 50%, #2A6650 70%, #163E2F 100%)',
            border: '2px solid #0E3B33',
            boxShadow: '-3px 4px 0px #0E3B33',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Left Axle Center Bolt */}
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#C8AA58',
              border: '1px solid #0E3B33',
              boxShadow: 'inset 1px 1px 0px #FAF8F0',
            }}
          />
        </div>

        {/* Right Drum End Cap / Disc Flange */}
        <div
          style={{
            position: 'absolute',
            right: '-12px',
            top: '8%',
            height: '84%',
            width: '16px',
            borderRadius: '0 12px 12px 0',
            background: 'linear-gradient(180deg, #163E2F 0%, #2A6650 30%, #43876B 50%, #2A6650 70%, #163E2F 100%)',
            border: '2px solid #0E3B33',
            boxShadow: '3px 4px 0px #0E3B33',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Right Axle Hub Pin */}
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#C8AA58',
              border: '1px solid #0E3B33',
              boxShadow: 'inset 1px 1px 0px #FAF8F0',
            }}
          />
        </div>

        {/* Mechanical Axle Shaft extending directly to Lever on the right */}
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '22px',
            height: '14px',
            background: 'linear-gradient(180deg, #7A7465 0%, #FAF8F2 40%, #1E4D3B 100%)',
            border: '2px solid #0E3B33',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Collar ring */}
          <div
            style={{
              width: '4px',
              height: '20px',
              backgroundColor: '#C8AA58',
              border: '1px solid #0E3B33',
            }}
          />
        </div>

        {/* 3. MAIN CYLINDRICAL DRUM BARREL */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(14px, 3vw, 20px) clamp(16px, 3.5vw, 24px)',
            overflow: 'hidden',
            borderRadius: '18px',
            border: '3px solid #1E4D3B',
            /* 3D Cylindrical Barrel Shading */
            background:
              'linear-gradient(180deg, #8E8674 0%, #BCB4A2 3%, #DFD9CC 9%, #FAF8F2 20%, #FFFFFF 50%, #FAF8F2 80%, #DFD9CC 91%, #B6AE9C 97%, #7E7665 100%)',
            boxShadow:
              'inset 0 16px 20px -6px rgba(18, 48, 36, 0.32), inset 0 -16px 20px -6px rgba(18, 48, 36, 0.38), 4px 6px 0px #1E4D3B',
            perspective: '600px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Top Curved Rim Hoop with Rivets */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '14px',
              background: 'linear-gradient(180deg, #1E4D3B 0%, #2A6650 60%, rgba(30, 77, 59, 0) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              pointerEvents: 'none',
              zIndex: 4,
            }}
          >
            {/* Rivets */}
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ width: '4px', height: '4px', backgroundColor: '#C8AA58', border: '1px solid #0E3B33' }} />
              <div style={{ width: '4px', height: '4px', backgroundColor: '#C8AA58', border: '1px solid #0E3B33' }} />
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ width: '4px', height: '4px', backgroundColor: '#C8AA58', border: '1px solid #0E3B33' }} />
              <div style={{ width: '4px', height: '4px', backgroundColor: '#C8AA58', border: '1px solid #0E3B33' }} />
            </div>
          </div>

          {/* Bottom Curved Rim Hoop with Rivets */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '14px',
              background: 'linear-gradient(0deg, #1E4D3B 0%, #2A6650 60%, rgba(30, 77, 59, 0) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              pointerEvents: 'none',
              zIndex: 4,
            }}
          >
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ width: '4px', height: '4px', backgroundColor: '#C8AA58', border: '1px solid #0E3B33' }} />
              <div style={{ width: '4px', height: '4px', backgroundColor: '#C8AA58', border: '1px solid #0E3B33' }} />
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ width: '4px', height: '4px', backgroundColor: '#C8AA58', border: '1px solid #0E3B33' }} />
              <div style={{ width: '4px', height: '4px', backgroundColor: '#C8AA58', border: '1px solid #0E3B33' }} />
            </div>
          </div>

          {/* Top curved cylinder row (previous ticket drawn) */}
          <div
            style={{
              minHeight: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              opacity: isSpinning ? 0.25 : 0.45,
              transform: isSpinning
                ? 'perspective(380px) rotateX(42deg) translateY(-12px) scale(0.86)'
                : 'perspective(380px) rotateX(28deg) scale(0.92) translateY(2px)',
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

          {/* Top pixel cylinder divider / ticket slot */}
          <div
            style={{
              width: '100%',
              height: '0px',
              borderTop: '2px dashed #B8B09F',
              margin: '7px 0',
              position: 'relative',
              transform: 'scaleX(0.98)',
            }}
          />

          {/* CENTER ROW (active lucky ticket) */}
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
              transform: 'translateZ(14px)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTopic?.id || 'empty'}
                initial={{ opacity: 0, y: isSpinning ? 20 : 8, filter: isSpinning ? 'blur(2px)' : 'blur(0px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -18, filter: 'blur(1px)' }}
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

          {/* Bottom pixel cylinder divider / ticket slot */}
          <div
            style={{
              width: '100%',
              height: '0px',
              borderTop: '2px dashed #B8B09F',
              margin: '7px 0',
              position: 'relative',
              transform: 'scaleX(0.98)',
            }}
          />

          {/* Bottom curved cylinder row (next ticket drawn) */}
          <div
            style={{
              minHeight: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              opacity: isSpinning ? 0.25 : 0.45,
              transform: isSpinning
                ? 'perspective(380px) rotateX(-42deg) translateY(12px) scale(0.86)'
                : 'perspective(380px) rotateX(-28deg) scale(0.92) translateY(-2px)',
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
      </motion.div>
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
