// src/components/AnalysisButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { sound } from '../utils/audio';

export function AnalysisButton({ onClick }) {
  return (
    <motion.button
      whileHover={{ y: -2, boxShadow: '5px 5px 0px #0E3B33' }}
      whileTap={{ y: 2, x: 2, boxShadow: '1px 1px 0px #0E3B33' }}
      onClick={(e) => {
        sound.playAnalysisOpen();
        onClick(e);
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E4D3B',
        backgroundImage: 'linear-gradient(180deg, #245743 0%, #1A4434 100%)',
        color: '#FFFFFF',
        fontFamily: "'Press Start 2P', monospace",
        fontWeight: 400,
        fontSize: '10.5px',
        lineHeight: '1.4',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        padding: '13px 22px',
        borderRadius: '0px',
        border: '2px solid #0E3B33',
        boxShadow: '4px 4px 0px #0E3B33',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      GET SPEECH ANALYSIS
    </motion.button>
  );
}
