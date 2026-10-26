// src/components/PlayerHud.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

export function PlayerHud({ onReplayIntro }) {
  const { currentUser, isGuest, logout, openProfile, historyList } = useAuth();

  if (!currentUser) return null;

  const displayName = currentUser.nickname || currentUser.username || (isGuest ? 'Guest' : 'User');
  const initial = displayName.charAt(0).toUpperCase();

  const handleOpenProfile = () => {
    sound.playPillClick();
    openProfile('history');
  };

  const handleLogout = () => {
    sound.playButtonClick();
    logout();
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '8px 18px',
        margin: '0 auto 14px auto',
        maxWidth: '1200px',
        width: 'calc(100% - 32px)',
        backgroundColor: '#FFFFFF',
        border: '2px solid #1E4D3B',
        boxShadow: '3px 3px 0px rgba(30, 77, 59, 0.15)',
      }}
    >
      {/* Left: User greeting and nickname / profile button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          onClick={handleOpenProfile}
          title="Open User Profile & History"
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#1E4D3B',
            color: '#F9F6EC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: '16px',
            fontWeight: 'bold',
            border: '2px solid #133327',
            cursor: 'pointer',
            boxShadow: '1.5px 1.5px 0px rgba(30, 77, 59, 0.2)',
            transition: 'transform 0.1s ease',
          }}
        >
          {initial}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '15px',
              color: '#55655D',
            }}
          >
            Welcome,
          </span>
          <span
            onClick={handleOpenProfile}
            title="Click to view Profile & Research History"
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '16px',
              fontWeight: '700',
              color: '#1E4D3B',
              cursor: 'pointer',
              borderBottom: '1px dashed #1E4D3B',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {displayName}
            <span style={{ fontSize: '11px', opacity: 0.6 }}>👤</span>
          </span>
          {isGuest && (
            <span
              style={{
                fontFamily: "'Pixelify Sans', monospace",
                fontSize: '11px',
                color: '#854D0E',
                backgroundColor: '#FEF9C3',
                padding: '1px 6px',
                border: '1px solid #E4D89A',
              }}
            >
              Guest
            </span>
          )}
        </div>
      </div>

      {/* Right Controls: Research History, Video Intro & Sign Out */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Profile History Button */}
        <button
          type="button"
          onClick={handleOpenProfile}
          style={{
            padding: '6px 12px',
            backgroundColor: '#1E4D3B',
            color: '#F9F6EC',
            border: '1.5px solid #0E3B33',
            boxShadow: '2px 2px 0px #0E3B33',
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'transform 0.1s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#29614C')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1E4D3B')}
        >
          <span>📜</span>
          <span>History</span>
          <span
            style={{
              backgroundColor: '#B79AE6',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              padding: '0px 5px',
              borderRadius: '0px',
              border: '1px solid #FFFFFF',
            }}
          >
            {historyList.length}
          </span>
        </button>

        {onReplayIntro && (
          <button
            type="button"
            onClick={onReplayIntro}
            style={{
              padding: '6px 12px',
              backgroundColor: '#FAF8F0',
              color: '#1E4D3B',
              border: '1.5px solid #1E4D3B',
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFE9DA')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FAF8F0')}
          >
            <span>▶</span>
            <span>Watch Intro</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleLogout}
          style={{
            padding: '6px 12px',
            backgroundColor: '#FFFFFF',
            color: '#B91C1C',
            border: '1.5px solid #FCA5A5',
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: '13px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEE2E2';
            e.currentTarget.style.borderColor = '#B91C1C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#FCA5A5';
          }}
        >
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
