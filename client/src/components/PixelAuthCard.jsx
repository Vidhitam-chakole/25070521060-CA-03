// src/components/PixelAuthCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

export function PixelAuthCard({ onGuestAccess }) {
  const { login, register, loginAsGuest, authError, setAuthError, isLoading } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regNickname, setRegNickname] = useState('');

  // Guest input state (quick optional name)
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [guestName, setGuestName] = useState('');

  const handleTabSwitch = (newMode) => {
    sound.playTabSwitch();
    setMode(newMode);
    setAuthError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthError('Please enter both email and password.');
      return;
    }
    await login(loginEmail, loginPassword);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regEmail || !regPassword) {
      setAuthError('Email and password are required.');
      return;
    }
    if (regPassword.length < 4) {
      setAuthError('Password must be at least 4 characters long.');
      return;
    }
    await register(regEmail, regPassword, regNickname);
  };

  const handleGuestSubmit = () => {
    loginAsGuest(guestName || 'Guest');
    if (onGuestAccess) onGuestAccess();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: '#F9F6EC',
        backgroundImage:
          'linear-gradient(rgba(30, 77, 59, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 77, 59, 0.04) 1px, transparent 1px)',
        backgroundSize: '12px 12px',
        position: 'relative',
        zIndex: 50,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          border: '3px solid #1E4D3B',
          boxShadow: '6px 6px 0px #1E4D3B, 12px 12px 0px rgba(30, 77, 59, 0.12)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            backgroundColor: '#1E4D3B',
            color: '#F9F6EC',
            padding: '16px 20px',
            borderBottom: '3px solid #133327',
          }}
        >
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '14px',
              color: '#F9F6EC',
              letterSpacing: '0.5px',
              marginBottom: '6px',
            }}
          >
            LearnWithFun
          </div>
          <div
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '14px',
              color: '#E8A857',
            }}
          >
            Sign in to LearnWithFun
          </div>
        </div>

        {/* Live Vercel / Remote Hosted Notice */}
        {typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && (
          <div
            style={{
              backgroundColor: '#FEF3C7',
              borderBottom: '2px solid #D97706',
              padding: '9px 16px',
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '12px',
              color: '#92400E',
              lineHeight: 1.45,
            }}
          >
            <strong>🌐 Live Vercel Preview:</strong> Connects to local <strong>MongoDB Compass</strong> when run locally at{' '}
            <code style={{ backgroundColor: '#FDE68A', padding: '1px 5px', fontWeight: 'bold' }}>http://localhost:5173</code>.
            On this live deployment, instant Demo registration and Guest Access are active!
          </div>
        )}

        {/* Tab Selector */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '3px solid #1E4D3B',
            backgroundColor: '#F3EFE6',
          }}
        >
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            style={{
              padding: '12px 10px',
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '15px',
              fontWeight: mode === 'login' ? '700' : '500',
              backgroundColor: mode === 'login' ? '#FFFFFF' : '#E8E3D5',
              color: mode === 'login' ? '#1E4D3B' : '#7A8B83',
              borderRight: '1.5px solid #1E4D3B',
              borderBottom: mode === 'login' ? '3px solid #1E4D3B' : 'none',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('register')}
            style={{
              padding: '12px 10px',
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '15px',
              fontWeight: mode === 'register' ? '700' : '500',
              backgroundColor: mode === 'register' ? '#FFFFFF' : '#E8E3D5',
              color: mode === 'register' ? '#1E4D3B' : '#7A8B83',
              borderLeft: '1.5px solid #1E4D3B',
              borderBottom: mode === 'register' ? '3px solid #1E4D3B' : 'none',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            Register
          </button>
        </div>

        {/* Card Body */}
        <div style={{ padding: '22px 20px' }}>
          {/* Error Message Toast */}
          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 14 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                style={{
                  backgroundColor: '#FEE2E2',
                  border: '2px solid #EF4444',
                  boxShadow: '3px 3px 0px #EF4444',
                  padding: '10px 12px',
                  color: '#991B1B',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {authError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Content */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1E4D3B',
                    marginBottom: '6px',
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '15px',
                    color: '#1E4D3B',
                    backgroundColor: '#FAF8F0',
                    border: '2px solid #1E4D3B',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1E4D3B',
                    marginBottom: '6px',
                  }}
                >
                  Password *
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '15px',
                    color: '#1E4D3B',
                    backgroundColor: '#FAF8F0',
                    border: '2px solid #1E4D3B',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: '6px',
                  backgroundColor: '#1E4D3B',
                  color: '#F9F6EC',
                  padding: '12px 16px',
                  border: '2px solid #133327',
                  boxShadow: '3px 3px 0px #133327',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: isLoading ? 'wait' : 'pointer',
                  textAlign: 'center',
                }}
              >
                {isLoading ? 'Verifying details...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1E4D3B',
                    marginBottom: '4px',
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '15px',
                    color: '#1E4D3B',
                    backgroundColor: '#FAF8F0',
                    border: '2px solid #1E4D3B',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1E4D3B',
                    marginBottom: '4px',
                  }}
                >
                  Password *
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 4 characters"
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '15px',
                    color: '#1E4D3B',
                    backgroundColor: '#FAF8F0',
                    border: '2px solid #1E4D3B',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2A6B52',
                    marginBottom: '4px',
                  }}
                >
                  Your Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={regNickname}
                  onChange={(e) => setRegNickname(e.target.value)}
                  placeholder="What should we call you?"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '15px',
                    color: '#1E4D3B',
                    backgroundColor: '#FAF8F0',
                    border: '2px solid #2A6B52',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: '6px',
                  backgroundColor: '#1E4D3B',
                  color: '#F9F6EC',
                  padding: '12px 16px',
                  border: '2px solid #133327',
                  boxShadow: '3px 3px 0px #133327',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: isLoading ? 'wait' : 'pointer',
                  textAlign: 'center',
                }}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '18px 0 14px 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#D9D5C7' }} />
            <span
              style={{
                fontFamily: "'Pixelify Sans', monospace",
                fontSize: '13px',
                color: '#7A8B83',
              }}
            >
              or
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#D9D5C7' }} />
          </div>

          {/* Guest Mode: "Use without signing in" button */}
          {!showGuestInput ? (
            <button
              type="button"
              onClick={() => {
                sound.playPillClick();
                setShowGuestInput(true);
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#FAF8F0',
                color: '#1E4D3B',
                border: '1.5px dashed #1E4D3B',
                fontFamily: "'Pixelify Sans', monospace",
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              Use without signing in
            </button>
          ) : (
            <div
              style={{
                padding: '10px 12px',
                backgroundColor: '#F3EFE6',
                border: '1.5px solid #1E4D3B',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '13px',
                  color: '#1E4D3B',
                  fontWeight: '600',
                }}
              >
                Your nickname (optional):
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Alex"
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '14px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #1E4D3B',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={handleGuestSubmit}
                  style={{
                    padding: '7px 14px',
                    backgroundColor: '#1E4D3B',
                    color: '#F9F6EC',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '14px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
