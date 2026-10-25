// src/components/Mascot/Mascot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useMascot } from '../../context/MascotContext';
import { MascotBubble } from './MascotBubble';
import { MascotMenu } from './MascotMenu';

export function Mascot({ onTriggerSpin, onNavigateTab, onStartTimer }) {
  const {
    isVisible,
    mood,
    setMood,
    bubble,
    dismissBubble,
    position,
    setPosition,
    facing,
    setFacing,
    isMenuOpen,
    setIsMenuOpen,
    highlightRect,
  } = useMascot();

  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [clickSparkles, setClickSparkles] = useState([]);
  const mascotRef = useRef(null);
  const controls = useAnimation();

  // Eye tracking cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (mood === 'sleepy' || !mascotRef.current) return;

      const rect = mascotRef.current.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width / 2;
      const mascotCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - mascotCenterX;
      const deltaY = e.clientY - mascotCenterY;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (dist > 0) {
        const maxOffset = 3.5;
        const offsetX = (deltaX / dist) * Math.min(maxOffset, dist / 40);
        const offsetY = (deltaY / dist) * Math.min(maxOffset, dist / 40);
        setPupilOffset({ x: offsetX * facing, y: offsetY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [facing, mood]);

  // Periodic Blink
  useEffect(() => {
    if (mood === 'sleepy' || mood === 'happy') return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, [mood]);

  // Hop animation on position change
  useEffect(() => {
    controls.start({
      y: [0, -18, 0],
      scaleX: [1, 0.94, 1.1, 1],
      scaleY: [0.88, 1.12, 0.9, 1],
      transition: {
        duration: 0.44,
        ease: 'easeInOut',
      },
    });
  }, [position, controls]);

  // Mascot Click reaction
  const handleMascotClick = (e) => {
    e.stopPropagation();
    if (isDragging) return;

    // Trigger hearts & sparkles
    const newSparkle = { id: Date.now(), x: 20, y: -20 };
    setClickSparkles((prev) => [...prev, newSparkle]);
    setTimeout(() => {
      setClickSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 1200);

    setMood('happy');
    setIsMenuOpen((prev) => !prev);
    dismissBubble();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Target Pulsing Orange Ring during guide/tour */}
      {highlightRect && (
        <div
          style={{
            position: 'fixed',
            top: highlightRect.top - 6,
            left: highlightRect.left - 6,
            width: highlightRect.width + 12,
            height: highlightRect.height + 12,
            borderRadius: '0px',
            border: '3px dashed #E3A857',
            boxShadow: '3px 3px 0px #1E4D3B',
            pointerEvents: 'none',
            zIndex: 998,
            animation: 'pulse 1.4s infinite ease-in-out',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      )}

      {/* Mascot Container */}
      <motion.div
        ref={mascotRef}
        drag
        dragMomentum={true}
        onDragStart={() => {
          setIsDragging(true);
          dismissBubble();
        }}
        onDragEnd={(e, info) => {
          setTimeout(() => setIsDragging(false), 80);
          setPosition((prev) => ({
            x: Math.max(20, Math.min(window.innerWidth - 120, prev.x + info.offset.x)),
            y: Math.max(40, Math.min(window.innerHeight - 130, prev.y + info.offset.y)),
          }));
        }}
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 24,
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '96px',
          height: '92px',
          zIndex: 1000,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        {/* Ground Shadow in 8-bit Pixel */}
        <div
          style={{
            position: 'absolute',
            bottom: '-6px',
            left: '16px',
            width: '64px',
            height: '8px',
            backgroundColor: '#B9C9BF',
            borderRadius: '0px',
            opacity: 0.6,
            transform: 'scale(1)',
            zIndex: -1,
            transition: 'transform 0.2s ease',
          }}
        />

        {/* Floating Sparkles & Hearts on Click */}
        {clickSparkles.map((sp) => (
          <motion.div
            key={sp.id}
            initial={{ opacity: 1, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -45, scale: 1.3 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              top: '-10px',
              left: '30px',
              pointerEvents: 'none',
              zIndex: 10,
              fontSize: '20px',
            }}
          >
            ✨💖
          </motion.div>
        ))}

        {/* Animated Mascot Body */}
        <motion.div
          animate={controls}
          onClick={handleMascotClick}
          style={{
            width: '100%',
            height: '100%',
            transformOrigin: 'bottom center',
            transform: `scaleX(${facing})`,
          }}
        >
          <svg
            width="96"
            height="92"
            viewBox="0 0 96 92"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible', imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
          >
            {/* SPROUT: Thin dark stem with 2 leaves */}
            <g style={{ transformOrigin: '48px 18px' }} className="mascot-sprout">
              {/* Stem */}
              <path
                d="M48 18 C 48 12, 47 8, 48 4"
                stroke="#0E3B33"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Left Leaf (Mustard #E3A857) */}
              <path
                d="M48 9 C 42 6, 38 7, 36 10 C 37 13, 42 14, 48 11 Z"
                fill="#E3A857"
                stroke="#0E3B33"
                strokeWidth="2"
              />
              {/* Right Leaf (Teal #3F7A6E) */}
              <path
                d="M48 7 C 54 4, 58 5, 60 8 C 59 11, 54 12, 48 9 Z"
                fill="#3F7A6E"
                stroke="#0E3B33"
                strokeWidth="2"
              />
            </g>

            {/* FEET: Two small dark nubs */}
            <ellipse cx="36" cy="88" rx="7" ry="4" fill="#0E3B33" />
            <ellipse cx="60" cy="88" rx="7" ry="4" fill="#0E3B33" />

            {/* BODY: Chubby round-square blob */}
            <rect
              x="6"
              y="16"
              width="84"
              height="70"
              rx="35"
              fill="#11524A"
              stroke="#0E3B33"
              strokeWidth="3"
            />

            {/* ARMS / EARS: Orange ellipses on sides */}
            {/* Left Arm */}
            <ellipse
              cx={mood === 'pointing' ? '0' : '4'}
              cy={mood === 'happy' ? '40' : '52'}
              rx={mood === 'pointing' ? '14' : '7'}
              ry="11"
              fill="#E3A857"
              stroke="#0E3B33"
              strokeWidth="2.5"
              transform={mood === 'pointing' ? 'rotate(-25 0 52)' : 'none'}
            />
            {/* Right Arm */}
            <ellipse
              cx="92"
              cy={mood === 'happy' ? '40' : '48'}
              rx="7"
              ry="11"
              fill="#E3A857"
              stroke="#0E3B33"
              strokeWidth="2.5"
            />

            {/* FACE PATCH: Large cream ellipse covering lower ~65% */}
            <ellipse
              cx="48"
              cy="58"
              rx="34"
              ry="24"
              fill="#F9F6EC"
            />

            {/* CHEEKS: Two orange ellipses */}
            <ellipse cx="27" cy="62" rx="6" ry="4" fill="#E3A857" opacity="0.6" />
            <ellipse cx="69" cy="62" rx="6" ry="4" fill="#E3A857" opacity="0.6" />

            {/* EYES & EXPRESSIONS */}
            {mood === 'happy' ? (
              // Happy: closed smiling arcs (^ ^)
              <g>
                <path
                  d="M32 50 C 34 45, 40 45, 42 50"
                  stroke="#0E3B33"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M54 50 C 56 45, 62 45, 64 50"
                  stroke="#0E3B33"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Orange Smile */}
                <path
                  d="M44 63 C 46 67, 50 67, 52 63"
                  stroke="#E3A857"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ) : mood === 'sleepy' ? (
              // Sleepy: half-closed eyelids + Z floating glyphs
              <g>
                <path
                  d="M32 50 L 42 50"
                  stroke="#0E3B33"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M54 50 L 64 50"
                  stroke="#0E3B33"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x="70"
                  y="28"
                  fill="#8E6EC4"
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  z
                </text>
                <text
                  x="78"
                  y="18"
                  fill="#B79AE6"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  z
                </text>
              </g>
            ) : isBlinking ? (
              // Blinking: closed lines
              <g>
                <line x1="33" y1="49" x2="41" y2="49" stroke="#0E3B33" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="55" y1="49" x2="63" y2="49" stroke="#0E3B33" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            ) : (
              // Open Eyes with pupil tracking
              <g>
                {/* Left Eye */}
                <circle cx="37" cy="49" r="8" fill="#FFFFFF" stroke="#0E3B33" strokeWidth="1.5" />
                <circle
                  cx={37 + pupilOffset.x}
                  cy={49 + pupilOffset.y}
                  r="4.5"
                  fill="#0E3B33"
                />
                <circle
                  cx={35.5 + pupilOffset.x}
                  cy={47.5 + pupilOffset.y}
                  r="1.5"
                  fill="#FFFFFF"
                />

                {/* Right Eye */}
                <circle cx="59" cy="49" r="8" fill="#FFFFFF" stroke="#0E3B33" strokeWidth="1.5" />
                <circle
                  cx={59 + pupilOffset.x}
                  cy={49 + pupilOffset.y}
                  r="4.5"
                  fill="#0E3B33"
                />
                <circle
                  cx={57.5 + pupilOffset.x}
                  cy={47.5 + pupilOffset.y}
                  r="1.5"
                  fill="#FFFFFF"
                />
              </g>
            )}

            {/* Surprised Extra Graphics: Dot nose + 3 orange radiating lines + sparkle */}
            {mood === 'surprised' && (
              <g>
                <circle cx="48" cy="56" r="2" fill="#E3A857" />
                <line x1="14" y1="24" x2="6" y2="18" stroke="#E3A857" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="18" x2="12" y2="10" stroke="#E3A857" strokeWidth="2" strokeLinecap="round" />
                <line x1="25" y1="14" x2="22" y2="6" stroke="#E3A857" strokeWidth="2" strokeLinecap="round" />
                {/* Sparkle */}
                <path
                  d="M84 14 C84 17, 81 17, 81 20 C81 17, 78 17, 78 14 C78 14, 81 14, 81 11 C81 14, 84 14, 84 14 Z"
                  fill="#E3A857"
                />
              </g>
            )}

            {/* Talking Mouth Animation */}
            {mood === 'talking' && (
              <ellipse
                cx="48"
                cy="64"
                rx="3.5"
                ry="4"
                fill="#E3A857"
                stroke="#0E3B33"
                strokeWidth="1.2"
                className="mascot-mouth"
              />
            )}
          </svg>
        </motion.div>

        {/* Name label below legs (never mirrored when mascot turns) */}
        <div
          style={{
            position: 'absolute',
            bottom: '-18px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            backgroundColor: '#FCFBF7',
            border: '1.5px solid #1E4D3B',
            borderRadius: '0px',
            padding: '2px 6px',
            boxShadow: '2px 2px 0px #1E4D3B',
            lineHeight: '1.2',
          }}
        >
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '8px',
              color: '#1E4D3B',
              fontWeight: 400,
              letterSpacing: '0.04em',
            }}
          >
            VIDHITAM
          </span>
        </div>

        {/* Speech Bubble */}
        <AnimatePresence>
          {bubble && (
            <MascotBubble
              bubble={bubble}
              facing={facing}
              onClose={dismissBubble}
            />
          )}
        </AnimatePresence>

        {/* Help Menu Popover */}
        <AnimatePresence>
          {isMenuOpen && (
            <MascotMenu
              onClose={() => setIsMenuOpen(false)}
              onTriggerSpin={onTriggerSpin}
              onNavigateTab={onNavigateTab}
              onStartTimer={onStartTimer}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Global Mascot Styles for Sprout sway & mouth */}
      <style>{`
        @keyframes sproutSway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .mascot-sprout {
          animation: sproutSway 2.2s ease-in-out infinite;
        }
        @keyframes mouthFlap {
          0%, 100% { transform: scaleY(0.7); }
          50% { transform: scaleY(1.3); }
        }
        .mascot-mouth {
          transform-origin: 48px 64px;
          animation: mouthFlap 0.22s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
