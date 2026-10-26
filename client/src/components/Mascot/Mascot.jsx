// src/components/Mascot/Mascot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useMascot } from '../../context/MascotContext';
import { MascotBubble } from './MascotBubble';
import { MascotMenu } from './MascotMenu';
import { sound } from '../../utils/audio';

export function Mascot({ onTriggerSpin, onNavigateTab, onStartTimer, onOpenAnalysis }) {
  const {
    isVisible,
    mood,
    setMood,
    isAsleep,
    stayPut,
    wakeUp,
    toggleSleep,
    bubble,
    say,
    dismissBubble,
    position,
    setPosition,
    facing,
    setFacing,
    isMenuOpen,
    setIsMenuOpen,
    currentTargetKey,
  } = useMascot();

  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [clickSparkles, setClickSparkles] = useState([]);
  const [isStabilized, setIsStabilized] = useState(false);
  const [stabilizedY, setStabilizedY] = useState(null);

  const mascotRef = useRef(null);
  const controls = useAnimation();
  const proximityTimerRef = useRef(null);

  // Constrain position to the leftmost side
  const [leftX, setLeftX] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 20));
  const [verticalBounds, setVerticalBounds] = useState(() => {
    const h = typeof window !== 'undefined' ? window.innerHeight : 768;
    return {
      top: 105,
      bottom: Math.max(260, h - 170),
    };
  });

  // Calculate screen bounds and ensure mascot stays on the most left side
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const targetLeft = w < 640 ? 10 : 20;
      setLeftX(targetLeft);
      setVerticalBounds({
        top: 105,
        bottom: Math.max(260, h - 170),
      });
      if (!currentTargetKey) {
        setFacing(1); // Always face toward screen content when not locked to a specific target
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setFacing, currentTargetKey]);

  // Cursor Proximity & Eye Tracking
  // When cursor gets close (< 145px), mascot automatically slows down & stabilizes so it's easy to click
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!mascotRef.current) return;

      const rect = mascotRef.current.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width / 2;
      const mascotCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - mascotCenterX;
      const deltaY = e.clientY - mascotCenterY;
      const dist = Math.hypot(deltaX, deltaY);

      // Eye pupil tracking
      if (!isAsleep && mood !== 'sleepy' && dist > 0) {
        const maxOffset = 3.5;
        const offsetX = (deltaX / dist) * Math.min(maxOffset, dist / 40);
        const offsetY = (deltaY / dist) * Math.min(maxOffset, dist / 40);
        setPupilOffset({ x: offsetX * facing, y: offsetY });
      }

      // Proximity stabilization: if cursor is near (within 145px) or on leftmost column, stabilize
      if (dist < 145 || (e.clientX < 130 && Math.abs(e.clientY - mascotCenterY) < 120)) {
        clearTimeout(proximityTimerRef.current);
        if (!isStabilized) {
          setStabilizedY(Math.round(rect.top));
          setIsStabilized(true);
        }
      } else if (isStabilized && !isMenuOpen) {
        clearTimeout(proximityTimerRef.current);
        proximityTimerRef.current = setTimeout(() => {
          setIsStabilized(false);
          setStabilizedY(null);
        }, 320);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(proximityTimerRef.current);
    };
  }, [facing, isAsleep, isMenuOpen, isStabilized, mood]);

  // Periodic Blink (only when awake)
  useEffect(() => {
    if (isAsleep || mood === 'sleepy' || mood === 'happy') return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, [isAsleep, mood]);

  // Mascot Click reaction: opens the rich menu
  const handleMascotClick = (e) => {
    e.stopPropagation();
    if (isDragging) return;

    sound.playPillClick();

    if (mascotRef.current) {
      setStabilizedY(Math.round(mascotRef.current.getBoundingClientRect().top));
    }
    setIsStabilized(true);

    // Open/toggle menu
    setIsMenuOpen((prev) => !prev);
  };

  if (!isVisible) return null;

  const hasCustomTarget = Boolean(currentTargetKey);
  const activeX = hasCustomTarget ? position.x : leftX;
  const activeY = hasCustomTarget
    ? position.y
    : (stabilizedY || position.y || verticalBounds.top + 70);

  // Determine if vertical motion should freeze/stabilize
  const isFrozen = isAsleep || stayPut || isStabilized || isMenuOpen;

  return (
    <>
      {/* Mascot Container: Anchored on the leftmost side, or flies to target element */}
      <motion.div
        ref={mascotRef}
        drag
        dragMomentum={false}
        onDragStart={() => {
          setIsDragging(true);
          dismissBubble();
        }}
        onDragEnd={(e, info) => {
          setIsDragging(false);
          if (hasCustomTarget) {
            setPosition((prev) => ({
              x: Math.max(10, Math.min(window.innerWidth - 110, prev.x + info.offset.x)),
              y: Math.max(50, Math.min(window.innerHeight - 110, prev.y + info.offset.y)),
            }));
          } else {
            setPosition((prev) => ({
              x: leftX,
              y: Math.max(verticalBounds.top, Math.min(verticalBounds.bottom, prev.y + info.offset.y)),
            }));
          }
        }}
        onMouseEnter={() => {
          clearTimeout(proximityTimerRef.current);
          if (mascotRef.current) {
            setStabilizedY(Math.round(mascotRef.current.getBoundingClientRect().top));
          }
          setIsStabilized(true);
        }}
        onMouseLeave={() => {
          if (!isMenuOpen) {
            proximityTimerRef.current = setTimeout(() => {
              setIsStabilized(false);
              setStabilizedY(null);
            }, 320);
          }
        }}
        animate={
          isDragging
            ? undefined
            : isFrozen
            ? {
                x: activeX,
                y: activeY,
              }
            : hasCustomTarget
            ? {
                x: activeX,
                y: [activeY - 4, activeY + 4, activeY - 4],
              }
            : {
                x: leftX,
                y: [verticalBounds.top, verticalBounds.bottom, verticalBounds.top],
              }
        }
        transition={
          hasCustomTarget
            ? {
                x: { type: 'spring', stiffness: 75, damping: 15 },
                y: isFrozen
                  ? { type: 'spring', stiffness: 75, damping: 15 }
                  : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
              }
            : isFrozen
            ? {
                type: 'spring',
                stiffness: 80,
                damping: 18,
              }
            : {
                x: { type: 'spring', stiffness: 50, damping: 15 },
                y: {
                  duration: 9.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
        }
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '96px',
          height: '92px',
          zIndex: 1000,
          cursor: isDragging ? 'grabbing' : 'pointer',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
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
            ★
          </motion.div>
        ))}

        {/* Animated Mascot Body */}
        <motion.div
          animate={isAsleep ? { y: [0, -3, 0] } : controls}
          transition={
            isAsleep
              ? {
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : undefined
          }
          className={isAsleep || isFrozen ? undefined : 'mascot-flight-bob'}
          onClick={handleMascotClick}
          style={{
            width: '100%',
            height: '100%',
            transformOrigin: 'bottom center',
            transform: `scaleX(${facing})`,
          }}
          title={isAsleep ? 'Vidhitam is sleeping (Click to open menu & wake up)' : 'Click Vidhitam for menu, navigation & actions'}
        >
          <svg
            width="96"
            height="92"
            viewBox="0 0 96 92"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible', imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
          >
            {/* BAMBOO COPTER (竹コプター): Head mount, shaft, center hub & 2-blade rotor */}
            <g id="bamboo-copter-assembly">
              {/* Head Base Suction Mount */}
              <ellipse cx="48" cy="16" rx="6" ry="2.5" fill="#C68A3B" stroke="#0E3B33" strokeWidth="1.5" />
              {/* Wooden Bamboo Shaft */}
              <rect x="46.5" y="3" width="3" height="13" fill="#E8A857" stroke="#0E3B33" strokeWidth="1.2" />
              {/* Spinning Propeller Blades (stops spinning when sleeping) */}
              <g
                className="bamboo-propeller"
                style={{
                  transformOrigin: '48px 3px',
                  animationPlayState: isAsleep || mood === 'sleepy' ? 'paused' : 'running',
                }}
              >
                {/* Left Propeller Blade */}
                <rect x="23" y="1" width="24" height="4" rx="2" fill="#E8A857" stroke="#0E3B33" strokeWidth="1.2" />
                {/* Right Propeller Blade */}
                <rect x="49" y="1" width="24" height="4" rx="2" fill="#E8A857" stroke="#0E3B33" strokeWidth="1.2" />
                {/* Center Rotor Cap */}
                <circle cx="48" cy="3" r="2.8" fill="#11524A" stroke="#0E3B33" strokeWidth="1.2" />
              </g>
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
              transform={mood === 'pointing' ? 'rotate(-25 0 52)' : undefined}
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

            {/* CHEEKS: Two orange/pink blush ellipses */}
            <ellipse
              cx="27"
              cy="62"
              rx="6"
              ry="4"
              fill={isAsleep || mood === 'sleepy' ? '#F472B6' : '#E3A857'}
              opacity="0.65"
            />
            <ellipse
              cx="69"
              cy="62"
              rx="6"
              ry="4"
              fill={isAsleep || mood === 'sleepy' ? '#F472B6' : '#E3A857'}
              opacity="0.65"
            />

            {/* EYES & SLEEPING / AWAKE EXPRESSIONS */}
            {isAsleep || mood === 'sleepy' ? (
              // Asleep: Peaceful closed curved eyelids + cute nightcap + floating Zs
              <g>
                <path
                  d="M31 52 Q 36.5 56 42 52"
                  stroke="#0E3B33"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M54 52 Q 59.5 56 65 52"
                  stroke="#0E3B33"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Cute purple sleeping nightcap */}
                <path
                  d="M26 21 Q 14 12, 10 24 Q 18 26, 26 23 Z"
                  fill="#8E6EC4"
                  stroke="#0E3B33"
                  strokeWidth="1.5"
                />
                <circle cx="9" cy="24" r="3.2" fill="#E8A857" stroke="#0E3B33" strokeWidth="1.2" />

                {/* Animated floating Z letters */}
                <text
                  x="72"
                  y="26"
                  fill="#8E6EC4"
                  fontSize="15"
                  fontWeight="bold"
                  fontFamily="'Press Start 2P', monospace"
                  className="mascot-sleep-z1"
                >
                  z
                </text>
                <text
                  x="82"
                  y="14"
                  fill="#B79AE6"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="'Press Start 2P', monospace"
                  className="mascot-sleep-z2"
                >
                  z
                </text>
                <text
                  x="64"
                  y="10"
                  fill="#7E22CE"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="'Press Start 2P', monospace"
                  className="mascot-sleep-z3"
                >
                  z
                </text>
              </g>
            ) : mood === 'happy' ? (
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
            {mood === 'surprised' && !isAsleep && (
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
            {mood === 'talking' && !isAsleep && (
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

        {/* Clean Name label below legs (clicking it also opens menu) */}
        <div
          onClick={handleMascotClick}
          title="Click to open menu"
          style={{
            position: 'absolute',
            bottom: '-18px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'auto',
            cursor: 'pointer',
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
              positionX={activeX}
              onClose={dismissBubble}
            />
          )}
        </AnimatePresence>

        {/* Comprehensive Mascot Menu Popover with Search & Options */}
        <AnimatePresence>
          {isMenuOpen && (
            <MascotMenu
              onClose={() => setIsMenuOpen(false)}
              onTriggerSpin={onTriggerSpin}
              onNavigateTab={onNavigateTab}
              onStartTimer={onStartTimer}
              onOpenAnalysis={onOpenAnalysis}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Global Mascot Styles for Propeller, Sleep Floating Zs, and bobbing */}
      <style>{`
        @keyframes zFloat1 {
          0% { opacity: 0; transform: translate(0, 0) scale(0.7); }
          50% { opacity: 0.95; }
          100% { opacity: 0; transform: translate(12px, -24px) scale(1.15); }
        }
        @keyframes zFloat2 {
          0% { opacity: 0; transform: translate(0, 0) scale(0.65); }
          50% { opacity: 0.9; }
          100% { opacity: 0; transform: translate(18px, -30px) scale(1.25); }
        }
        @keyframes zFloat3 {
          0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
          50% { opacity: 0.85; }
          100% { opacity: 0; transform: translate(8px, -20px) scale(1.1); }
        }
        .mascot-sleep-z1 {
          animation: zFloat1 2.2s ease-out infinite;
        }
        .mascot-sleep-z2 {
          animation: zFloat2 2.2s ease-out infinite 0.75s;
        }
        .mascot-sleep-z3 {
          animation: zFloat3 2.2s ease-out infinite 1.4s;
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
