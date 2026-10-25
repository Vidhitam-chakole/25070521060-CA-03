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
        gap: 'clamp(8px, 2.5vw, 16px)',
        flexWrap: 'wrap',
        marginTop: '20px',
        userSelect: 'none',
        width: '100%',
      }}
    >
      <motion.button
        whileHover={!isSpinning ? { y: -2, x: -1, boxShadow: '5px 5px 0px #0E3B33' } : {}}
        whileTap={!isSpinning ? { y: 2, x: 2, boxShadow: '1px 1px 0px #0E3B33' } : {}}
        onClick={onSpin}
        disabled={isSpinning}
        style={{
          backgroundColor: isSpinning ? '#859F94' : '#1E4D3B',
          color: '#FFFFFF',
          fontFamily: "'Press Start 2P', monospace",
          fontWeight: 400,
          fontSize: 'clamp(9.5px, 2.4vw, 11px)',
          letterSpacing: '0.04em',
          padding: 'clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 26px)',
          borderRadius: '0px',
          border: '2px solid #0E3B33',
          boxShadow: '4px 4px 0px #0E3B33',
          cursor: isSpinning ? 'not-allowed' : 'pointer',
          minWidth: '100px',
        }}
      >
        {isSpinning ? 'SPINNING...' : 'SPIN!'}
      </motion.button>

      <motion.button
        whileHover={{
          y: -2,
          x: -1,
          backgroundColor: '#1E4D3B',
          color: '#FFFFFF',
          boxShadow: '4px 4px 0px #1E4D3B',
        }}
        whileTap={{ y: 2, x: 2, boxShadow: '1px 1px 0px #1E4D3B' }}
        onClick={onStartTimer}
        style={{
          backgroundColor: 'transparent',
          color: '#1E4D3B',
          fontFamily: "'Press Start 2P', monospace",
          fontWeight: 400,
          fontSize: 'clamp(9px, 2.2vw, 10px)',
          letterSpacing: '0.02em',
          padding: 'clamp(9px, 2.4vw, 11px) clamp(14px, 3.5vw, 22px)',
          borderRadius: '0px',
          border: '2px solid #1E4D3B',
          boxShadow: '3px 3px 0px #1E4D3B',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
        }}
      >
        <span>START TIMER</span>
        <span>▶</span>
      </motion.button>
    </div>
  );
}
