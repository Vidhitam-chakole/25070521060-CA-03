// src/components/TopTabs.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const TABS = [
  { id: 'random-topics', label: 'Random Topics' },
  { id: 'interview-prep', label: 'Interview Prep' },
  { id: 'learn-vocab', label: 'Learn Vocab' },
  { id: 'deep-research', label: 'Deep Research', isNew: true },
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
          border: '1px solid #D9D5C7',
          borderRadius: '999px',
          padding: '3px',
          height: '38px',
          position: 'relative',
          maxWidth: '92vw',
          boxShadow: '0 1px 3px rgba(30, 77, 59, 0.05)',
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
                padding: '0 14px',
                height: '32px',
                borderRadius: '999px',
                fontSize: '13px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#1E4D3B' : '#4E6A5E',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                zIndex: 1,
                transition: 'color 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '999px',
                    boxShadow: '0 2px 6px rgba(30, 77, 59, 0.1), 0 1px 2px rgba(0,0,0,0.04)',
                    zIndex: -1,
                  }}
                />
              )}

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transform: tab.id === 'deep-research' ? 'rotate(-1.5deg)' : 'none',
                }}
              >
                {tab.label}
                {tab.isNew && (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      backgroundColor: '#1E4D3B',
                      color: '#F9F6EC',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      transform: 'rotate(4deg)',
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
