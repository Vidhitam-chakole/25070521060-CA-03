// src/components/TopTabs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { sound } from '../utils/audio';

export const TABS = [
  { id: 'random-topics', label: 'Random Topics' },
  { id: 'interview-prep', label: 'Interview Prep' },
  { id: 'learn-vocab', label: 'Learn Vocab' },
  { id: 'deep-research', label: 'Deep Research' },
  { id: 'debate-hub', label: 'Debate Archive', isNew: true },
];

export function TopTabs({ activeTab, onChangeTab }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '20px',
        paddingBottom: '16px',
        width: '100%',
      }}
    >
      <nav
        aria-label="Mode tabs"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          maxWidth: '96vw',
          border: 'none',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          padding: '0 8px',
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ y: -2, x: -1, boxShadow: '4px 4px 0px #1E4D3B' }}
              whileTap={{ y: 2, x: 2, boxShadow: '1px 1px 0px #1E4D3B' }}
              onClick={() => {
                sound.playTabSwitch();
                onChangeTab(tab.id);
              }}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px 14px',
                borderRadius: '0px',
                fontSize: 'clamp(9px, 2vw, 11px)',
                fontFamily: "'Press Start 2P', monospace",
                fontWeight: isActive ? 700 : 400,
                color: isActive ? '#1E4D3B' : '#4E6A5E',
                backgroundColor: isActive ? '#FFFFFF' : '#EDE8DB',
                border: '2px solid #1E4D3B',
                boxShadow: isActive ? '3px 3px 0px #1E4D3B' : '2px 2px 0px #1E4D3B',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease, color 0.15s ease',
                whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {tab.label}
                {tab.isNew && (
                  <span
                    style={{
                      fontSize: '8px',
                      fontWeight: 700,
                      backgroundColor: '#1E4D3B',
                      color: '#F9F6EC',
                      padding: '2px 4px',
                      borderRadius: '0px',
                      border: '1px solid #1E4D3B',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      display: 'inline-block',
                    }}
                  >
                    NEW
                  </span>
                )}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
