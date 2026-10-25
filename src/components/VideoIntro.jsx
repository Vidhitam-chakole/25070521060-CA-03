// src/components/VideoIntro.jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, FastForward, Sparkles } from 'lucide-react';

export function VideoIntro({ onComplete }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const videoRef = useRef(null);

  const startPlayback = () => {
    setHasStarted(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback if browser blocks unmuted audio
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  };

  const handleFinish = () => {
    setIsZoomingOut(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{
          opacity: isZoomingOut ? 0 : 1,
          scale: isZoomingOut ? 2.4 : 1,
        }}
        exit={{ opacity: 0, scale: 2.4 }}
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#F9F6EC',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: hasStarted ? 'default' : 'pointer',
        }}
        onClick={!hasStarted ? startPlayback : undefined}
      >
        {/* Subtle dot grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#D9D5C7 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />

        {/* Floating pastel squares */}
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '10%',
            width: '32px',
            height: '32px',
            backgroundColor: '#B9C9BF',
            opacity: 0.5,
            borderRadius: '6px',
            transform: 'rotate(18deg)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '25%',
            right: '14%',
            width: '28px',
            height: '28px',
            backgroundColor: '#E3A857',
            opacity: 0.45,
            borderRadius: '6px',
            transform: 'rotate(-12deg)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '18%',
            left: '16%',
            width: '36px',
            height: '36px',
            backgroundColor: '#B79AE6',
            opacity: 0.4,
            borderRadius: '8px',
            transform: 'rotate(24deg)',
            pointerEvents: 'none',
          }}
        />

        {/* BEFORE PLAYING: Click to Enter prompt */}
        {!hasStarted ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 2,
              padding: '24px',
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                backgroundColor: '#1E4D3B',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(30, 77, 59, 0.28)',
                marginBottom: '24px',
              }}
            >
              <Play size={32} fill="#FFFFFF" style={{ marginLeft: '4px' }} />
            </motion.div>

            <h1
              style={{
                fontFamily: "'Knewave', 'Shrikhand', cursive",
                fontSize: 'clamp(36px, 5vw, 64px)',
                color: '#2A6B52',
                letterSpacing: '0.02em',
                textShadow: '2px 2px 0px #A9C4B8',
                margin: '0 0 12px 0',
              }}
            >
              SpeechPact
            </h1>

            <p
              style={{
                fontFamily: "'Caveat Brush', cursive",
                fontSize: '24px',
                color: '#1E4D3B',
                margin: '0 0 24px 0',
              }}
            >
              Got Free Time? Click anywhere to start! 🚀
            </p>

            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '12px',
                fontWeight: 700,
                color: '#557667',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: '#EDE8DB',
                border: '1px solid #D9D5C7',
                padding: '6px 18px',
                borderRadius: '999px',
              }}
            >
              Click to Open
            </span>
          </div>
        ) : (
          /* VIDEO PLAYING STATE */
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#000000',
              zIndex: 5,
            }}
          >
            <video
              ref={videoRef}
              src="/got_free_time_intro.mp4"
              playsInline
              onEnded={handleFinish}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />

            {/* Skip Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFinish();
              }}
              style={{
                position: 'absolute',
                top: '24px',
                right: '28px',
                backgroundColor: 'rgba(249, 246, 236, 0.9)',
                color: '#1E4D3B',
                border: '1.5px solid #1E4D3B',
                borderRadius: '999px',
                padding: '8px 18px',
                fontSize: '13px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                zIndex: 10,
                backdropFilter: 'blur(4px)',
              }}
            >
              <span>Skip Intro</span>
              <FastForward size={15} />
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
