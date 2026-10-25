// src/components/AnalysisButton.jsx
import React from 'react';
import { motion } from 'framer-motion';

export function AnalysisButton({ onClick }) {
  return (
    <motion.button
      whileHover={{ y: -2, boxShadow: '0 6px 18px rgba(30, 77, 59, 0.28)' }}
      whileTap={{ y: 0, scale: 0.98 }}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E4D3B',
        backgroundImage: 'linear-gradient(180deg, #245743 0%, #1A4434 100%)',
        color: '#FFFFFF',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 700,
        fontSize: '13.5px',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '11px 22px',
        borderRadius: '5px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 12px rgba(30, 77, 59, 0.22)',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        userSelect: 'none',
      }}
    >
      GET SPEECH ANALYSIS
    </motion.button>
  );
}
