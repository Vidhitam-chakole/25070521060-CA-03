// src/components/NicknamePromptModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export function NicknamePromptModal() {
  const { currentUser, isAskingNickname, setIsAskingNickname, saveNickname, isLoading } = useAuth();
  const [nicknameInput, setNicknameInput] = useState(currentUser?.nickname || currentUser?.username || '');

  if (!isAskingNickname) return null;

  const handleConfirm = (e) => {
    if (e) e.preventDefault();
    const finalName = nicknameInput.trim() || currentUser?.username || 'Speaker';
    saveNickname(finalName);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(20, 40, 30, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9000,
          padding: '16px',
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #1E4D3B',
            boxShadow: '6px 6px 0px rgba(30, 77, 59, 0.2)',
            padding: '24px',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '20px',
              fontWeight: '700',
              color: '#1E4D3B',
              marginBottom: '6px',
            }}
          >
            Personalize Your Profile
          </div>

          <p
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '14px',
              color: '#55655D',
              marginBottom: '16px',
              lineHeight: '1.4',
            }}
          >
            What nickname would you like us to use on your dashboard and feedback?
          </p>

          <form onSubmit={handleConfirm}>
            <div style={{ marginBottom: '18px' }}>
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="Enter your nickname"
                autoFocus
                maxLength={24}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '16px',
                  color: '#1E4D3B',
                  backgroundColor: '#FAF8F0',
                  border: '2px solid #1E4D3B',
                  outline: 'none',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#1E4D3B',
                  color: '#F9F6EC',
                  border: 'none',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: isLoading ? 'wait' : 'pointer',
                }}
              >
                {isLoading ? 'Saving...' : 'Save Nickname'}
              </button>

              <button
                type="button"
                onClick={() => setIsAskingNickname(false)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#FFFFFF',
                  color: '#7A8B83',
                  border: '1.5px solid #D9D5C7',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Skip
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
