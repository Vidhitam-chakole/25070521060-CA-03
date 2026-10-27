// src/components/PlayerHud.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

export function PlayerHud({ onReplayIntro }) {
  const { currentUser, isGuest, logout, openProfile, historyList } = useAuth();
  const [isMuted, setIsMuted] = React.useState(() => sound.isMuted?.() || false);
  const [isFullscreen, setIsFullscreen] = React.useState(() => (typeof document !== 'undefined' ? !!document.fullscreenElement : false));

  React.useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  if (!currentUser) return null;

  const displayName = currentUser.nickname || currentUser.username || (isGuest ? 'Guest' : 'User');
  const initial = displayName.trim().charAt(0).toUpperCase() || 'U';

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

  const handleToggleFullscreen = () => {
    sound.playButtonClick();
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="player-hud-container">
      {/* Top Left: History Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          type="button"
          onClick={handleOpenProfile}
          title="Open Research & Practice History"
          className="hud-action-btn"
          style={{
            padding: '6px 12px',
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
            gap: '6px',
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

      {/* Top Right Controls: Fullscreen, Sound, Watch Intro, Sign Out & Profile Avatar */}
      <div className="hud-right-controls" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {currentUser?.isDemoMode && (
          <span
            title="Running in Live Vercel Demo Mode"
            className="hud-demo-badge"
            style={{
              padding: '3px 6px',
              backgroundColor: '#FEF3C7',
              border: '1px solid #D97706',
              color: '#92400E',
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            Live Demo
          </span>
        )}

        {/* Fullscreen Toggle Button */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (Optimal on Laptop)'}
          className="hud-action-btn"
          style={{
            padding: '5px 10px',
            backgroundColor: isFullscreen ? '#EDE8DB' : '#FAF8F0',
            color: '#1E4D3B',
            border: '1.5px solid #1E4D3B',
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFE9DA')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isFullscreen ? '#EDE8DB' : '#FAF8F0')}
        >
          <span>{isFullscreen ? '⛶' : '⛶'}</span>
          <span className="hud-btn-label">{isFullscreen ? 'Exit' : 'Full'}</span>
        </button>

        {/* Sound Toggle Button */}
        <button
          type="button"
          onClick={handleToggleSound}
          title={isMuted ? 'Sound is Muted (Click to Unmute)' : 'Sound is Active (Click to Mute)'}
          className="hud-action-btn"
          style={{
            padding: '5px 10px',
            backgroundColor: isMuted ? '#FEE2E2' : '#F0FDF4',
            color: isMuted ? '#991B1B' : '#166534',
            border: `1.5px solid ${isMuted ? '#FCA5A5' : '#86EFAC'}`,
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: '12px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'background-color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isMuted ? '#FECACA' : '#DCFCE7')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isMuted ? '#FEE2E2' : '#F0FDF4')}
        >
          <span>{isMuted ? '🔇' : '🔊'}</span>
          <span className="hud-btn-label">{isMuted ? 'Muted' : 'Sound'}</span>
        </button>

        {/* Watch Intro Button */}
        {onReplayIntro && (
          <button
            type="button"
            onClick={onReplayIntro}
            title="Replay Video Intro"
            className="hud-action-btn"
            style={{
              padding: '5px 10px',
              backgroundColor: '#FAF8F0',
              color: '#1E4D3B',
              border: '1.5px solid #1E4D3B',
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFE9DA')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FAF8F0')}
          >
            <span>🎬</span>
            <span className="hud-btn-label">Intro</span>
          </button>
        )}

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleLogout}
          title="Sign Out"
          className="hud-action-btn"
          style={{
            padding: '5px 10px',
            backgroundColor: '#FFFFFF',
            color: '#B91C1C',
            border: '1.5px solid #FCA5A5',
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: '12px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
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
          <span>🚪</span>
          <span className="hud-btn-label">Exit</span>
        </button>

        {/* Small Profile Icon with Initial of Nickname */}
        <div
          onClick={handleOpenProfile}
          title={`Profile: ${displayName} (Click to open)`}
          style={{
            width: '28px',
            height: '28px',
            backgroundColor: '#1E4D3B',
            color: '#F9F6EC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: '14px',
            fontWeight: 'bold',
            border: '2px solid #0E3B33',
            boxShadow: '1.5px 1.5px 0px #0E3B33',
            cursor: 'pointer',
            userSelect: 'none',
            flexShrink: 0,
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

