// src/components/VideoIntro.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function VideoIntro({ onComplete }) {
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(() => (typeof document !== 'undefined' ? !!document.fullscreenElement : false));
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRef = useRef(null);

  // Safely request full screen on laptop screens
  const requestLaptopFullscreen = useCallback(async () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch {
        // Handled silently if browser security blocks non-gesture fullscreen
      }
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Listen for native browser fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Attempt immediate playback and laptop fullscreen on mount
  useEffect(() => {
    const playVideo = async () => {
      if (!videoRef.current) return;
      try {
        videoRef.current.volume = 1.0;
        await videoRef.current.play();
      } catch {
        // If unmuted autoplay blocked by browser policy, try muted autoplay
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.volume = 1.0;
          videoRef.current.play().catch(() => {});
        }
      }
    };

    playVideo();
    requestLaptopFullscreen();

    // User interaction unmutes if muted and ensures laptop full screen
    const handleGlobalInteraction = () => {
      setHasInteracted(true);
      if (videoRef.current) {
        videoRef.current.volume = 1.0;
        if (videoRef.current.muted) {
          videoRef.current.muted = false;
          setIsMuted(false);
        }
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        }
      }
      // On laptop screens, automatically enter full screen on click
      requestLaptopFullscreen();
    };

    window.addEventListener('click', handleGlobalInteraction);
    window.addEventListener('keydown', handleGlobalInteraction);
    window.addEventListener('touchstart', handleGlobalInteraction);

    return () => {
      window.removeEventListener('click', handleGlobalInteraction);
      window.removeEventListener('keydown', handleGlobalInteraction);
      window.removeEventListener('touchstart', handleGlobalInteraction);
    };
  }, [requestLaptopFullscreen]);

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
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000000',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Fullscreen Video directly playing with cinema fit so NO cropping on any laptop screen */}
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
            display: 'block',
          }}
        />

        {/* Top-Right Control Overlays for Fullscreen and Skip */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(12px, 3vw, 20px)',
            right: 'clamp(12px, 3vw, 20px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 10000,
          }}
        >
          {/* Laptop / Desktop Fullscreen Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            style={{
              padding: '7px 12px',
              backgroundColor: 'rgba(30, 77, 59, 0.9)',
              color: '#F9F6EC',
              border: '2px solid #A9C4B8',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span>{isFullscreen ? '⛶ EXIT' : '⛶ FULLSCREEN'}</span>
          </button>

          {/* Quick Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
            title="Skip Intro Video"
            style={{
              padding: '7px 14px',
              backgroundColor: '#E8A857',
              color: '#1E4D3B',
              border: '2px solid #1E4D3B',
              boxShadow: '3px 3px 0px #0E3B33',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>SKIP ✕</span>
          </button>
        </div>

        {/* Subtle Bottom Unmute Notice if Autoplay Muted */}
        {isMuted && !hasInteracted && (
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '8px 16px',
              backgroundColor: 'rgba(14, 59, 51, 0.92)',
              border: '2px solid #E8A857',
              boxShadow: '2px 2px 0px #000000',
              color: '#F9F6EC',
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '14px',
              fontWeight: 600,
              pointerEvents: 'none',
              zIndex: 10000,
              letterSpacing: '0.02em',
            }}
          >
            🔊 Click anywhere to play in full screen with audio!
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

