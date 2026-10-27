// src/components/VideoIntro.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function VideoIntro({ onComplete }) {
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const videoRef = useRef(null);

  // Attempt immediate playback on mount
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
          videoRef.current.volume = 1.0;
          videoRef.current.play().catch(() => {});
        }
      }
    };
    playVideo();

    // Whenever someone clicks or interacts with the webpage, automatically open in full screen just for the video part
    const handleGlobalInteraction = () => {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      if (videoRef.current) {
        videoRef.current.volume = 1.0;
        if (videoRef.current.muted) {
          videoRef.current.muted = false;
        }
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        }
      }
    };

    window.addEventListener('click', handleGlobalInteraction);
    window.addEventListener('keydown', handleGlobalInteraction);
    window.addEventListener('touchstart', handleGlobalInteraction);

    return () => {
      // Exit fullscreen when component unmounts
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      window.removeEventListener('click', handleGlobalInteraction);
      window.removeEventListener('keydown', handleGlobalInteraction);
      window.removeEventListener('touchstart', handleGlobalInteraction);
    };
  }, []);

  const handleFinish = () => {
    // When the video part is over, automatically come back to normal size
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
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
        {/* Fullscreen Video directly playing with cover fit so NO black bars on sides */}
        <video
          ref={videoRef}
          src="/got_free_time_intro.mp4"
          playsInline
          autoPlay
          onEnded={handleFinish}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: '#000000',
            display: 'block',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
