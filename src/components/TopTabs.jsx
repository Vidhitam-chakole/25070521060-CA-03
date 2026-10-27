// src/components/TopTabs.jsx
import React, { useRef, useEffect } from 'react';
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
  const activeTabRef = useRef(null);
  const navRef = useRef(null);

  // Smoothly auto-scroll the active tab into view on mobile screens
  useEffect(() => {
    if (activeTabRef.current && navRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  return (
    <div className="mobile-horizontal-nav-wrapper">
      <nav
        ref={navRef}
        aria-label="Mode tabs"
        className="mobile-horizontal-nav-bar no-scrollbar"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              whileHover={{ y: -2, x: -1, boxShadow: '4px 4px 0px #1E4D3B' }}
              whileTap={{ y: 2, x: 2, boxShadow: '1px 1px 0px #1E4D3B' }}
              onClick={() => {
                sound.playTabSwitch();
                onChangeTab(tab.id);
              }}
              className={`nav-tab-button ${isActive ? 'active' : ''}`}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(7px, 1.8vw, 9px) clamp(10px, 2.2vw, 14px)',
                borderRadius: '0px',
                fontSize: 'clamp(8.5px, 2vw, 11px)',
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
                flexShrink: 0,
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

