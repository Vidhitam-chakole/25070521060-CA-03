// src/components/ActionButtons.jsx
import React from 'react';
import { motion } from 'framer-motion';

export function ActionButtons({ onSpin, onStartTimer, isSpinning }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '20px',
        userSelect: 'none',
      }}
    >
      <motion.button
        whileHover={!isSpinning ? { y: -2, boxShadow: '0 5px 15px rgba(30, 77, 59, 0.25)' } : {}}
        whileTap={!isSpinning ? { scale: 0.96 } : {}}
        onClick={onSpin}
        disabled={isSpinning}
        style={{
          backgroundColor: isSpinning ? '#859F94' : '#1E4D3B',
          color: '#FFFFFF',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: '14px',
          padding: '10px 28px',
          borderRadius: '999px',
          border: 'none',
          boxShadow: '0 3px 8px rgba(30, 77, 59, 0.15)',
          cursor: isSpinning ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease, transform 0.15s ease',
          minWidth: '100px',
        }}
      >
        {isSpinning ? 'Spinning...' : 'Spin!'}
      </motion.button>

      <motion.button
        whileHover={{
          y: -2,
          backgroundColor: '#1E4D3B',
          color: '#FFFFFF',
          boxShadow: '0 5px 15px rgba(30, 77, 59, 0.18)',
        }}
        whileTap={{ scale: 0.96 }}
        onClick={onStartTimer}
        style={{
          backgroundColor: 'transparent',
          color: '#1E4D3B',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          fontSize: '14px',
          padding: '9px 24px',
          borderRadius: '999px',
          border: '1.5px solid #1E4D3B',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>Start Timer</span>
        <span>→</span>
      </motion.button>
    </div>
  );
}
