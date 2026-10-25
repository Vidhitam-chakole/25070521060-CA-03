// src/components/Mascot/MascotMenu.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, RotateCw, Timer, Sparkles, EyeOff, Compass, BookOpen, Brain, Briefcase } from 'lucide-react';
import { useMascot } from '../../context/MascotContext';

export function MascotMenu({ onClose, onTriggerSpin, onNavigateTab, onStartTimer }) {
  const { hide, say, setMood } = useMascot();
  const [commandText, setCommandText] = useState('');

  const handleCommand = (e) => {
    e.preventDefault();
    const query = commandText.trim().toLowerCase();
    if (!query) return;

    if (query.includes('random') || query.includes('topic')) {
      onNavigateTab('random-topics');
      say('Taking you to Random Topics!');
      onClose();
    } else if (query.includes('interview') || query.includes('prep') || query.includes('star')) {
      onNavigateTab('interview-prep');
      say('Here is Interview Prep!');
      onClose();
    } else if (query.includes('vocab') || query.includes('word') || query.includes('learn')) {
      onNavigateTab('learn-vocab');
      say('Here are 100+ Vocabulary words to practice!');
      onClose();
    } else if (query.includes('research') || query.includes('deep')) {
      onNavigateTab('deep-research');
      say('Opening Deep Research!');
      onClose();
    } else if (query.includes('spin') || query.includes('roll') || query.includes('lever')) {
      onTriggerSpin();
      say('Spinning the reel for you! 🎰');
      onClose();
    } else if (query.includes('timer') || query.includes('time') || query.includes('clock')) {
      onStartTimer();
      say('Starting your speech timer!');
      onClose();
    } else {
      say(`I couldn't quite find "${commandText}", but you can pick any mode from the menu!`, { autoDismiss: 4000 });
      setMood('surprised');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        bottom: '104px',
        left: '-110px',
        width: '310px',
        backgroundColor: '#FCFBF7',
        border: '2px solid #1E4D3B',
        borderRadius: '0px',
        boxShadow: '4px 4px 0px #1E4D3B',
        padding: '16px',
        color: '#1E4D3B',
        fontFamily: "'Pixelify Sans', monospace",
        zIndex: 1020,
        pointerEvents: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🌱</span>
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '11px',
              color: '#1E4D3B',
              fontWeight: 400,
            }}
          >
            BUDDY
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#658274',
            cursor: 'pointer',
            padding: '2px',
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Command Box */}
      <form onSubmit={handleCommand} style={{ marginBottom: '14px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#F3EFE3',
            border: '2px solid #1E4D3B',
            borderRadius: '0px',
            padding: '6px 10px',
          }}
        >
          <Search size={14} color="#5C7A6D" />
          <input
            type="text"
            value={commandText}
            onChange={(e) => setCommandText(e.target.value)}
            placeholder="Ask me where to go..."
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '13px',
              color: '#1E4D3B',
              fontFamily: "'Pixelify Sans', monospace",
            }}
          />
        </div>
      </form>

      {/* Quick Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={() => {
            onNavigateTab('random-topics');
            onClose();
          }}
          style={menuBtnStyle}
        >
          <Compass size={14} color="#2A6B52" />
          <span>Random Topics</span>
        </button>

        <button
          onClick={() => {
            onNavigateTab('interview-prep');
            onClose();
          }}
          style={menuBtnStyle}
        >
          <Briefcase size={14} color="#8B5CF6" />
          <span>Interview Prep (STAR / PREP)</span>
        </button>

        <button
          onClick={() => {
            onNavigateTab('learn-vocab');
            onClose();
          }}
          style={menuBtnStyle}
        >
          <BookOpen size={14} color="#E3A857" />
          <span>Learn Vocab (30s Timer)</span>
        </button>

        <button
          onClick={() => {
            onNavigateTab('deep-research');
            onClose();
          }}
          style={menuBtnStyle}
        >
          <Brain size={14} color="#EC4899" />
          <span>Deep Research (10m Prep)</span>
        </button>

        <div style={{ height: '0px', borderTop: '2px dashed #E4DFD2', margin: '4px 0' }} />

        <button
          onClick={() => {
            onTriggerSpin();
            onClose();
          }}
          style={menuBtnStyle}
        >
          <RotateCw size={14} color="#1E4D3B" />
          <span>Spin a topic for me!</span>
        </button>

        <button
          onClick={() => {
            onStartTimer();
            onClose();
          }}
          style={menuBtnStyle}
        >
          <Timer size={14} color="#B79AE6" />
          <span>Start Speech Timer</span>
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('speechpact_tour_completed');
            window.location.reload();
          }}
          style={menuBtnStyle}
        >
          <Sparkles size={14} color="#E3A857" />
          <span>Replay Onboarding Tour</span>
        </button>

        <button
          onClick={() => {
            hide();
            onClose();
          }}
          style={{ ...menuBtnStyle, color: '#889B91' }}
        >
          <EyeOff size={14} />
          <span>Hide Helper</span>
        </button>
      </div>
    </motion.div>
  );
}

const menuBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  padding: '6px 10px',
  borderRadius: '0px',
  backgroundColor: 'transparent',
  border: '1px solid transparent',
  fontSize: '13px',
  fontFamily: "'Pixelify Sans', monospace",
  fontWeight: 600,
  color: '#1E4D3B',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background-color 0.1s ease',
};
