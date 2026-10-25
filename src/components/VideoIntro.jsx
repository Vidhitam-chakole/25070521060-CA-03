// src/components/VideoIntro.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastForward } from 'lucide-react';

export function VideoIntro({ onComplete }) {
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const videoRef = useRef(null);

  // Attempt immediate playback on mount
  useEffect(() => {
    const playVideo = async () => {
      if (!videoRef.current) return;
      try {
        await videoRef.current.play();
      } catch {
        // If unmuted autoplay blocked by browser policy, try muted autoplay
        // and unmute on first user click anywhere
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      }
    };
    playVideo();

    // Any click anywhere on the page starts/resumes audio & playback directly
    const handleGlobalClick = () => {
      if (videoRef.current) {
        if (videoRef.current.muted) {
          videoRef.current.muted = false;
        }
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        }
      }
    };

    window.addEventListener('click', handleGlobalClick, { once: false });
    window.addEventListener('keydown', handleGlobalClick, { once: false });
    window.addEventListener('touchstart', handleGlobalClick, { once: false });

    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleGlobalClick);
      window.removeEventListener('touchstart', handleGlobalClick);
    };
  }, []);

  const handleFinish = () => {
    if (isZoomingOut) return;
    setIsZoomingOut(true);
    setTimeout(() => {
      onComplete();
    }, 850);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        animate={{
          opacity: isZoomingOut ? 0 : 1,
          scale: isZoomingOut ? 1.03 : 1,
          filter: isZoomingOut ? 'blur(6px)' : 'blur(0px)',
        }}
        exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#000000',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={handleFinish}
        title="Click to skip into website"
      >
        {/* Fullscreen Video directly playing with no play button UI */}
        <video
          ref={videoRef}
          src="/got_free_time_intro.mp4"
          playsInline
          autoPlay
          onEnded={handleFinish}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            backgroundColor: '#000000',
          }}
        />

        {/* Skip Intro Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
          style={{
            position: 'absolute',
            top: '24px',
            right: '28px',
            backgroundColor: '#F9F6EC',
            color: '#1E4D3B',
            border: '2px solid #1E4D3B',
            borderRadius: '0px',
            padding: '8px 14px',
            fontSize: '9.5px',
            fontFamily: "'Press Start 2P', monospace",
            fontWeight: 400,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '3px 3px 0px #1E4D3B',
            zIndex: 10,
            transition: 'transform 0.1s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translate(-1px, -1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
        >
          <span>SKIP INTRO</span>
          <FastForward size={13} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
