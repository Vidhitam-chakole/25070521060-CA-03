// src/components/TopTabs.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const TABS = [
  { id: 'random-topics', label: 'Random Topics' },
  { id: 'interview-prep', label: 'Interview Prep' },
  { id: 'learn-vocab', label: 'Learn Vocab' },
  { id: 'deep-research', label: 'Deep Research' },
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
          backgroundColor: '#EDE8DB',
          border: '2px solid #1E4D3B',
          borderRadius: '0px',
          padding: '3px',
          height: '40px',
          position: 'relative',
          maxWidth: '92vw',
          boxShadow: '3px 3px 0px #1E4D3B',
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 12px',
                height: '32px',
                borderRadius: '0px',
                fontSize: '11px',
                fontFamily: "'Press Start 2P', monospace",
                fontWeight: isActive ? 700 : 400,
                color: isActive ? '#1E4D3B' : '#4E6A5E',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                zIndex: 1,
                transition: 'color 0.1s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #1E4D3B',
                    borderRadius: '0px',
                    boxShadow: '2px 2px 0px #1E4D3B',
                    zIndex: -1,
                  }}
                />
              )}

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
            </button>
          );
        })}
      </nav>
    </div>
  );
}
