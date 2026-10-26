// src/components/PlayerHud.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

export function PlayerHud({ onReplayIntro }) {
  const { currentUser, isGuest, logout, openProfile, historyList } = useAuth();

  if (!currentUser) return null;

  const displayName = currentUser.nickname || currentUser.username || (isGuest ? 'Guest' : 'User');
  const initial = displayName.trim().charAt(0).toUpperCase() || 'U';

  const [isMuted, setIsMuted] = React.useState(() => sound.isMuted?.() || false);

  const handleOpenProfile = () => {
    sound.playPillClick();
    openProfile('history');
  };

  const handleLogout = () => {
    sound.playButtonClick();
    logout();
  };

  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.playButtonClick();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '4px clamp(10px, 3vw, 20px)',
        margin: '0 auto 8px auto',
        maxWidth: '1200px',
        width: '100%',
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      {/* Top Left: History Tab Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          type="button"
          onClick={handleOpenProfile}
          title="Open Research & Practice History"
          style={{
            padding: '7px 14px',
            backgroundColor: '#1E4D3B',
            color: '#F9F6EC',
            border: '2px solid #0E3B33',
            boxShadow: '2px 2px 0px #0E3B33',
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.1s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#29614C')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1E4D3B')}
        >
          <span>History</span>
          <span
            style={{
              backgroundColor: '#B79AE6',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '0px',
              border: '1px solid #FFFFFF',
            }}
          >
            {historyList.length}
          </span>
        </button>
      </div>

      {/* Top Right Controls: Watch Intro, Sign Out & Profile Initial Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {currentUser?.isDemoMode && (
          <span
            title="Running in Live Vercel Demo Mode"
            style={{
              padding: '3px 7px',
              backgroundColor: '#FEF3C7',
              border: '1px solid #D97706',
              color: '#92400E',
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            Live Demo Mode
          </span>
        )}
        <button
          type="button"
          onClick={handleToggleSound}
          title={isMuted ? 'Sound is Muted (Click to Unmute)' : 'Sound is Active & Loud (Click to Mute)'}
          style={{
            padding: '6px 12px',
            backgroundColor: isMuted ? '#FEE2E2' : '#F0FDF4',
            color: isMuted ? '#991B1B' : '#166534',
            border: `1.5px solid ${isMuted ? '#FCA5A5' : '#86EFAC'}`,
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: '13px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isMuted ? '#FECACA' : '#DCFCE7')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isMuted ? '#FEE2E2' : '#F0FDF4')}
        >
          <span>{isMuted ? '🔇 Muted' : '🔊 Sound'}</span>
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

        {/* Small Profile Icon with Initial of Nickname */}
        <div
          onClick={handleOpenProfile}
          title={`Profile: ${displayName} (Click to open profile)`}
          style={{
            width: '28px',
            height: '28px',
            backgroundColor: '#1E4D3B',
            color: '#F9F6EC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: '15px',
            fontWeight: 'bold',
            border: '2px solid #0E3B33',
            boxShadow: '1.5px 1.5px 0px #0E3B33',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'transform 0.1s ease, background-color 0.1s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#29614C';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1E4D3B';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {initial}
        </div>
      </div>
    </div>
  );
}
