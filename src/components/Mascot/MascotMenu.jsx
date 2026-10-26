// src/components/Mascot/MascotMenu.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  RotateCw,
  Timer,
  Compass,
  BookOpen,
  Brain,
  Briefcase,
  Moon,
  Sun,
  Pin,
  PinOff,
  Award,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useMascot } from '../../context/MascotContext';
import { sound } from '../../utils/audio';
import { RANDOM_TOPICS } from '../../data/randomTopics';
import { BEHAVIORAL_QUESTIONS, CONSULTING_QUESTIONS } from '../../data/interviewPrep';
import { VOCAB_WORDS } from '../../data/vocab';

export function MascotMenu({
  onClose,
  onTriggerSpin,
  onNavigateTab,
  onStartTimer,
  onOpenAnalysis,
}) {
  const {
    say,
    setMood,
    isAsleep,
    toggleSleep,
    stayPut,
    toggleStayPut,
  } = useMascot();

  const [searchQuery, setSearchQuery] = useState('');

  // Live Multi-Search indexing Navigation, Actions, Topics, Vocab, and Questions
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results = [];

    // 1. Navigation items & actions
    const navItems = [
      {
        id: 'nav-random',
        type: 'Navigation',
        title: 'Random Topics',
        desc: 'Quick impromptu speaking prompts',
        icon: <Compass size={14} color="#2A6B52" />,
        action: () => {
          onNavigateTab('random-topics');
          say('Navigated to Random Topics!');
        },
      },
      {
        id: 'nav-interview',
        type: 'Navigation',
        title: 'Interview Prep',
        desc: 'STAR & consulting question frameworks',
        icon: <Briefcase size={14} color="#8B5CF6" />,
        action: () => {
          onNavigateTab('interview-prep');
          say('Navigated to Interview Prep!');
        },
      },
      {
        id: 'nav-vocab',
        type: 'Navigation',
        title: 'Learn Vocab',
        desc: '100+ vocabulary words & 30s timer',
        icon: <BookOpen size={14} color="#E3A857" />,
        action: () => {
          onNavigateTab('learn-vocab');
          say('Navigated to Learn Vocab!');
        },
      },
      {
        id: 'nav-research',
        type: 'Navigation',
        title: 'Deep Research',
        desc: '10-minute thesis preparation topics',
        icon: <Brain size={14} color="#EC4899" />,
        action: () => {
          onNavigateTab('deep-research');
          say('Navigated to Deep Research!');
        },
      },
      {
        id: 'act-timer',
        type: 'Action',
        title: 'Start Speech Timer',
        desc: 'Begin countdown practice',
        icon: <Timer size={14} color="#B79AE6" />,
        action: () => {
          onStartTimer();
          say('Starting speech timer!');
        },
      },
      {
        id: 'act-analysis',
        type: 'Action',
        title: 'Speech Analysis Report',
        desc: 'Review clarity, pacing & filler metrics',
        icon: <Award size={14} color="#1E4D3B" />,
        action: () => {
          onOpenAnalysis?.();
        },
      },
      {
        id: 'act-spin',
        type: 'Action',
        title: 'Spin Random Topic',
        desc: 'Pull lever for fresh topic',
        icon: <RotateCw size={14} color="#1E4D3B" />,
        action: () => {
          onTriggerSpin();
          say('Spinning topic reel!');
        },
      },
      {
        id: 'mascot-sleep',
        type: 'Mascot',
        title: isAsleep ? 'Wake Up Vidhitam' : 'Put Vidhitam to Sleep',
        desc: isAsleep ? 'Wake up buddy from nap' : 'Put buddy to nap',
        icon: isAsleep ? <Sun size={14} color="#E8A857" /> : <Moon size={14} color="#8E6EC4" />,
        action: () => {
          toggleSleep();
        },
      },
      {
        id: 'mascot-stay',
        type: 'Mascot',
        title: stayPut ? 'Resume Slow Floating' : "Stay Put (Don't Move)",
        desc: stayPut ? 'Start floating up and down' : 'Freeze mascot in place',
        icon: stayPut ? <PinOff size={14} color="#1E4D3B" /> : <Pin size={14} color="#1E4D3B" />,
        action: () => {
          toggleStayPut();
        },
      },
    ];

    navItems.forEach((item) => {
      if (item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)) {
        results.push(item);
      }
    });

    // 2. Vocab Words (matching word or definition)
    VOCAB_WORDS.forEach((item) => {
      if (item.word.toLowerCase().includes(q) || item.definition.toLowerCase().includes(q)) {
        results.push({
          id: `vocab-${item.word}`,
          type: 'Vocab Word',
          title: item.word,
          desc: item.definition,
          icon: <BookOpen size={14} color="#E3A857" />,
          action: () => {
            onNavigateTab('learn-vocab');
            say(`Word: "${item.word}" - ${item.definition}`, { autoDismiss: 4000 });
          },
        });
      }
    });

    // 3. Random Topics (matching title or category)
    RANDOM_TOPICS.forEach((item) => {
      if (item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)) {
        results.push({
          id: `topic-${item.id}`,
          type: 'Topic',
          title: item.title,
          desc: `${item.category.toUpperCase()} • ${item.difficulty}`,
          icon: <Compass size={14} color="#2A6B52" />,
          action: () => {
            onNavigateTab('random-topics');
            say(`Topic: "${item.title}"`, { autoDismiss: 4000 });
          },
        });
      }
    });

    // 4. Interview Prep (Behavioral & Consulting)
    [...BEHAVIORAL_QUESTIONS, ...CONSULTING_QUESTIONS].forEach((item) => {
      if (item.title.toLowerCase().includes(q)) {
        results.push({
          id: `interview-${item.id}`,
          type: 'Interview Question',
          title: item.title,
          desc: `Framework: ${item.framework || 'STAR'}`,
          icon: <Briefcase size={14} color="#8B5CF6" />,
          action: () => {
            onNavigateTab('interview-prep');
            say(`Interview question: "${item.title}"`, { autoDismiss: 4000 });
          },
        });
      }
    });

    return results.slice(0, 10);
  }, [searchQuery, isAsleep, stayPut, onNavigateTab, onStartTimer, onTriggerSpin, onOpenAnalysis, toggleSleep, toggleStayPut, say]);

  const handleItemClick = (item) => {
    sound.playButtonClick();
    item.action();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, x: -10 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.92, x: -10 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: '-16px',
        left: '106px',
        width: '320px',
        maxWidth: 'calc(100vw - 120px)',
        maxHeight: '85vh',
        backgroundColor: '#FCFBF7',
        border: '2.5px solid #1E4D3B',
        borderRadius: '0px',
        boxShadow: '5px 5px 0px #1E4D3B',
        padding: '14px',
        color: '#1E4D3B',
        fontFamily: "'Pixelify Sans', monospace",
        zIndex: 1050,
        pointerEvents: 'auto',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #E8E2D2',
          paddingBottom: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: '#1E4D3B' }}>★</span>
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
              color: '#1E4D3B',
              fontWeight: 400,
              letterSpacing: '0.04em',
            }}
          >
            VIDHITAM MENU
          </span>
        </div>
        <button
          onClick={() => {
            sound.playModalClose();
            onClose();
          }}
          title="Close menu"
          style={{
            background: 'none',
            border: 'none',
            color: '#658274',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Instant Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#F3EFE3',
          border: '2px solid #1E4D3B',
          borderRadius: '0px',
          padding: '6px 10px',
          boxShadow: 'inset 1px 1px 0px rgba(0,0,0,0.06)',
        }}
      >
        <Search size={14} color="#5C7A6D" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics, vocab, navigation..."
          autoFocus
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            width: '100%',
            fontSize: '13px',
            color: '#1E4D3B',
            fontFamily: "'Pixelify Sans', monospace",
            fontWeight: 500,
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#849C90',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* If Searching: Render Live Matching Results */}
      {searchQuery.trim().length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              fontSize: '8px',
              fontFamily: "'Press Start 2P', monospace",
              color: '#6D897C',
              textTransform: 'uppercase',
              marginBottom: '2px',
            }}
          >
            SEARCH RESULTS ({searchResults.length})
          </div>

          {searchResults.length === 0 ? (
            <div
              style={{
                padding: '12px',
                textAlign: 'center',
                color: '#7A9185',
                fontSize: '13px',
                backgroundColor: '#F5F4EE',
                border: '1px dashed #D5D0C2',
              }}
            >
              No matching topics or commands found.
            </div>
          ) : (
            searchResults.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                style={{
                  ...menuItemStyle,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #1E4D3B',
                  boxShadow: '2px 2px 0px #1E4D3B',
                  padding: '7px 10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  {item.icon}
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#1E4D3B',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#6E8B7E',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.desc}
                    </span>
                  </div>
                </div>
                <ArrowRight size={13} color="#2A6B52" />
              </button>
            ))
          )}
        </div>
      ) : (
        /* Default Categorized Menu: Mascot Controls, Navigation, Actions */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* SECTION 1: MASCOT CONTROLS (Sleep & Stay Put) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div
              style={{
                fontSize: '8px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#6D897C',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              MASCOT CONTROLS
            </div>

            {/* SLEEP TOGGLE */}
            <button
              onClick={() => {
                sound.playButtonClick();
                toggleSleep();
                onClose();
              }}
              style={{
                ...menuItemStyle,
                backgroundColor: isAsleep ? '#F5EEF8' : '#FFFFFF',
                border: `1.5px solid ${isAsleep ? '#7E22CE' : '#1E4D3B'}`,
                boxShadow: `2px 2px 0px ${isAsleep ? '#7E22CE' : '#1E4D3B'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isAsleep ? <Sun size={15} color="#E8A857" /> : <Moon size={15} color="#7E22CE" />}
                <span style={{ fontWeight: 700, color: isAsleep ? '#7E22CE' : '#1E4D3B' }}>
                  {isAsleep ? 'Wake Up Vidhitam' : 'Put Vidhitam to Sleep'}
                </span>
              </div>
              <span
                style={{
                  fontSize: '7.5px',
                  fontFamily: "'Press Start 2P', monospace",
                  color: isAsleep ? '#7E22CE' : '#5C7A6D',
                }}
              >
                {isAsleep ? 'ASLEEP' : 'AWAKE'}
              </span>
            </button>

            {/* STAY PUT / DON'T MOVE TOGGLE */}
            <button
              onClick={() => {
                toggleStayPut();
                onClose();
              }}
              style={{
                ...menuItemStyle,
                backgroundColor: stayPut ? '#EFF6FF' : '#FFFFFF',
                border: `1.5px solid ${stayPut ? '#2563EB' : '#1E4D3B'}`,
                boxShadow: `2px 2px 0px ${stayPut ? '#2563EB' : '#1E4D3B'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {stayPut ? <PinOff size={15} color="#2563EB" /> : <Pin size={15} color="#1E4D3B" />}
                <span style={{ fontWeight: 700, color: stayPut ? '#2563EB' : '#1E4D3B' }}>
                  {stayPut ? "Stay Put (Don't Move): ON" : "Stay Put (Don't Move)"}
                </span>
              </div>
              <span
                style={{
                  fontSize: '7.5px',
                  fontFamily: "'Press Start 2P', monospace",
                  color: stayPut ? '#2563EB' : '#5C7A6D',
                }}
              >
                {stayPut ? 'PINNED' : 'FLOAT'}
              </span>
            </button>
          </div>

          {/* SECTION 2: WEBSITE NAVIGATION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div
              style={{
                fontSize: '8px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#6D897C',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginTop: '4px',
              }}
            >
              WEBSITE NAVIGATION
            </div>

            <button
              onClick={() => {
                sound.playTabSwitch();
                onNavigateTab('random-topics');
                onClose();
              }}
              style={menuItemStyle}
            >
              <Compass size={14} color="#2A6B52" />
              <span>Random Topics</span>
            </button>

            <button
              onClick={() => {
                sound.playTabSwitch();
                onNavigateTab('interview-prep');
                onClose();
              }}
              style={menuItemStyle}
            >
              <Briefcase size={14} color="#8B5CF6" />
              <span>Interview Prep (STAR / PREP)</span>
            </button>

            <button
              onClick={() => {
                sound.playTabSwitch();
                onNavigateTab('learn-vocab');
                onClose();
              }}
              style={menuItemStyle}
            >
              <BookOpen size={14} color="#E3A857" />
              <span>Learn Vocab (100+ Words)</span>
            </button>

            <button
              onClick={() => {
                sound.playTabSwitch();
                onNavigateTab('deep-research');
                onClose();
              }}
              style={menuItemStyle}
            >
              <Brain size={14} color="#EC4899" />
              <span>Deep Research (10m Prep)</span>
            </button>
          </div>

          {/* SECTION 3: QUICK ACTIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div
              style={{
                fontSize: '8px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#6D897C',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginTop: '4px',
              }}
            >
              QUICK ACTIONS
            </div>

            <button
              onClick={() => {
                sound.playButtonClick();
                onTriggerSpin();
                onClose();
              }}
              style={menuItemStyle}
            >
              <RotateCw size={14} color="#1E4D3B" />
              <span>Spin Topic (Pull Lever)</span>
            </button>

            <button
              onClick={() => {
                sound.playTimerStart();
                onStartTimer();
                onClose();
              }}
              style={menuItemStyle}
            >
              <Timer size={14} color="#B79AE6" />
              <span>Start Speech Timer</span>
            </button>

            {onOpenAnalysis && (
              <button
                onClick={() => {
                  sound.playAnalysisOpen();
                  onOpenAnalysis();
                  onClose();
                }}
                style={menuItemStyle}
              >
                <Award size={14} color="#1E4D3B" />
                <span>Get Speech Analysis</span>
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  padding: '6px 10px',
  borderRadius: '0px',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E0DBD0',
  fontSize: '13px',
  fontFamily: "'Pixelify Sans', monospace",
  fontWeight: 600,
  color: '#1E4D3B',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.1s ease',
};
