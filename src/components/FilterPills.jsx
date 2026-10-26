// src/components/FilterPills.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Check,
  Target,
  MessageSquare,
  Briefcase,
  Brain,
  Crown,
  Dna,
  Share2,
  MessageCircle,
  Building2,
  Binary,
} from 'lucide-react';
import { RANDOM_CATEGORIES, RANDOM_DIFFICULTIES } from '../data/randomTopics';
import { INTERVIEW_FILTERS } from '../data/interviewPrep';
import { VOCAB_DIFFICULTIES } from '../data/vocab';
import { RESEARCH_CATEGORIES } from '../data/deepResearch';
import { sound } from '../utils/audio';

function PillButton({ children, onClick, isOpen, minWidth = 'auto' }) {
  return (
    <button
      onClick={(e) => {
        sound.playPillClick();
        onClick(e);
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#FCFBF7',
        border: `2px solid ${isOpen ? '#1E4D3B' : '#1E4D3B'}`,
        borderRadius: '0px',
        padding: '5px 12px',
        fontSize: '13px',
        fontFamily: "'Pixelify Sans', monospace",
        fontWeight: 600,
        color: '#1E4D3B',
        cursor: 'pointer',
        boxShadow: isOpen ? '1px 1px 0px #1E4D3B' : '2px 2px 0px #1E4D3B',
        transform: isOpen ? 'translate(1px, 1px)' : 'none',
        transition: 'background-color 0.1s ease',
        minWidth,
        justifyContent: 'center',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!isOpen) e.currentTarget.style.backgroundColor = '#F2EFE5';
      }}
      onMouseLeave={(e) => {
        if (!isOpen) e.currentTarget.style.backgroundColor = '#FCFBF7';
      }}
    >
      {children}
      <ChevronDown
        size={14}
        color="#5E7C6E"
        style={{
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.15s ease',
        }}
      />
    </button>
  );
}

function DropdownMenu({ items, selectedId, onSelect, onClose, headerTitle }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 2, scale: 0.98 }}
      transition={{ duration: 0.12 }}
      style={{
        position: 'absolute',
        top: 'calc(100% + 5px)',
        left: 0,
        zIndex: 50,
        backgroundColor: '#FFFFFF',
        border: '2px solid #1E4D3B',
        borderRadius: '0px',
        boxShadow: '4px 4px 0px #1E4D3B',
        padding: '6px 4px 4px 4px',
        minWidth: '200px',
        maxWidth: 'calc(100vw - 28px)',
        maxHeight: '260px',
        overflowY: 'auto',
      }}
    >
      {headerTitle && (
        <div
          style={{
            padding: '3px 8px 6px 8px',
            fontSize: '9px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#557667',
            letterSpacing: '0.04em',
            borderBottom: '1px solid #ECE7D9',
            marginBottom: '4px',
            textTransform: 'uppercase',
          }}
        >
          {headerTitle}
        </div>
      )}
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        return (
          <button
            key={item.id}
            onClick={() => {
              sound.playDropdownSelect();
              onSelect(item.id);
              onClose();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: '0px',
              fontSize: '13px',
              fontFamily: "'Pixelify Sans', monospace",
              fontWeight: isSelected ? 700 : 500,
              color: '#1E4D3B',
              backgroundColor: isSelected ? '#F3EFE3' : 'transparent',
              border: isSelected ? '1px dashed #1E4D3B' : '1px solid transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.1s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.backgroundColor = '#F5F4EE';
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.renderIcon ? item.renderIcon() : null}
              <span>{item.label}</span>
            </div>
            {isSelected && <Check size={14} color="#1E4D3B" strokeWidth={2.5} />}
          </button>
        );
      })}
    </motion.div>
  );
}

export function FilterPills({
  mode,
  filters,
  onChangeFilter,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggle = (name) => {
    setOpenDropdown((curr) => (curr === name ? null : name));
  };

  const close = () => setOpenDropdown(null);

  const renderResearchIcon = (iconName, color) => {
    const size = 14;
    switch (iconName) {
      case 'Brain':
        return <Brain size={size} color={color} />;
      case 'Crown':
        return <Crown size={size} color={color} />;
      case 'Dna':
        return <Dna size={size} color={color} />;
      case 'Share2':
        return <Share2 size={size} color={color} />;
      case 'MessageCircle':
        return <MessageCircle size={size} color={color} />;
      case 'Building2':
        return <Building2 size={size} color={color} />;
      case 'Binary':
        return <Binary size={size} color={color} />;
      default:
        return <Target size={size} color={color} />;
    }
  };

  if (mode === 'random-topics') {
    const currentCat = RANDOM_CATEGORIES.find((c) => c.id === (filters.category || 'random')) || RANDOM_CATEGORIES[0];
    const currentDiff = RANDOM_DIFFICULTIES.find((d) => d.id === (filters.difficulty || 'random')) || RANDOM_DIFFICULTIES[0];

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '16px',
        }}
      >
        {/* Category Pill */}
        <div style={{ position: 'relative' }}>
          <PillButton onClick={() => toggle('cat')} isOpen={openDropdown === 'cat'}>
            <span style={{ fontSize: '9px', fontFamily: "'Press Start 2P', monospace", color: '#557667', letterSpacing: '0.04em' }}>
              CATEGORY:
            </span>
            <span style={{ fontWeight: 700, color: '#1E4D3B' }}>{currentCat.label}</span>
          </PillButton>
          <AnimatePresence>
            {openDropdown === 'cat' && (
              <DropdownMenu
                headerTitle="SELECT CATEGORY"
                items={RANDOM_CATEGORIES}
                selectedId={currentCat.id}
                onSelect={(id) => onChangeFilter('category', id)}
                onClose={close}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Difficulty Pill */}
        <div style={{ position: 'relative' }}>
          <PillButton onClick={() => toggle('diff')} isOpen={openDropdown === 'diff'}>
            <span style={{ fontSize: '9px', fontFamily: "'Press Start 2P', monospace", color: '#557667', letterSpacing: '0.04em' }}>
              DIFFICULTY:
            </span>
            <span style={{ fontWeight: 700, color: '#1E4D3B' }}>{currentDiff.label}</span>
          </PillButton>
          <AnimatePresence>
            {openDropdown === 'diff' && (
              <DropdownMenu
                headerTitle="SELECT DIFFICULTY"
                items={RANDOM_DIFFICULTIES}
                selectedId={currentDiff.id}
                onSelect={(id) => onChangeFilter('difficulty', id)}
                onClose={close}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (mode === 'interview-prep') {
    const currentTrack = INTERVIEW_FILTERS.find((f) => f.id === (filters.interviewTrack || 'behavioral')) || INTERVIEW_FILTERS[0];

    const interviewItems = INTERVIEW_FILTERS.map((f) => ({
      id: f.id,
      label: f.label,
      renderIcon: () =>
        f.id === 'behavioral' ? (
          <MessageSquare size={14} color={f.iconColor} />
        ) : (
          <Briefcase size={14} color={f.iconColor} />
        ),
    }));

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <PillButton onClick={() => toggle('interview')} isOpen={openDropdown === 'interview'}>
            <span style={{ fontSize: '9px', fontFamily: "'Press Start 2P', monospace", color: '#557667', letterSpacing: '0.04em' }}>
              TRACK:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {currentTrack.id === 'behavioral' ? (
                <MessageSquare size={14} color="#8B5CF6" />
              ) : (
                <Briefcase size={14} color="#EF4444" />
              )}
              <span style={{ fontWeight: 700, color: '#1E4D3B' }}>{currentTrack.label}</span>
            </div>
          </PillButton>

          <AnimatePresence>
            {openDropdown === 'interview' && (
              <DropdownMenu
                headerTitle="SELECT INTERVIEW TRACK"
                items={interviewItems}
                selectedId={currentTrack.id}
                onSelect={(id) => onChangeFilter('interviewTrack', id)}
                onClose={close}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (mode === 'learn-vocab') {
    const currentDiff = VOCAB_DIFFICULTIES.find((v) => v.id === (filters.vocabDifficulty || 'random')) || VOCAB_DIFFICULTIES[0];

    const vocabItems = VOCAB_DIFFICULTIES.map((v) => ({
      id: v.id,
      label: v.id === 'random' ? 'All Difficulties' : v.label,
      renderIcon: () => (
        <span style={{ color: v.color, fontSize: '13px', lineHeight: 1 }}>●</span>
      ),
    }));

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <PillButton onClick={() => toggle('vocabDiff')} isOpen={openDropdown === 'vocabDiff'}>
            <span style={{ fontSize: '9px', fontFamily: "'Press Start 2P', monospace", color: '#557667', letterSpacing: '0.04em' }}>
              LEVEL:
            </span>
            <span style={{ color: currentDiff.color, fontSize: '13px' }}>●</span>
            <span style={{ fontWeight: 700, color: '#1E4D3B' }}>
              {currentDiff.id === 'random' ? 'All Difficulties' : currentDiff.label}
            </span>
          </PillButton>
          <AnimatePresence>
            {openDropdown === 'vocabDiff' && (
              <DropdownMenu
                headerTitle="SELECT VOCAB LEVEL"
                items={vocabItems}
                selectedId={currentDiff.id}
                onSelect={(id) => onChangeFilter('vocabDifficulty', id)}
                onClose={close}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (mode === 'deep-research') {
    const currentResCat =
      RESEARCH_CATEGORIES.find((r) => r.id === (filters.researchCategory || 'random')) || RESEARCH_CATEGORIES[0];

    const researchItems = RESEARCH_CATEGORIES.map((r) => ({
      id: r.id,
      label: r.id === 'random' ? 'All Domains' : r.label,
      renderIcon: () => renderResearchIcon(r.icon, r.color),
    }));

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <PillButton onClick={() => toggle('researchCat')} isOpen={openDropdown === 'researchCat'}>
            <span style={{ fontSize: '9px', fontFamily: "'Press Start 2P', monospace", color: '#557667', letterSpacing: '0.04em' }}>
              DOMAIN:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {renderResearchIcon(currentResCat.icon, currentResCat.color)}
              <span style={{ fontWeight: 700, color: '#1E4D3B' }}>
                {currentResCat.id === 'random' ? 'All Domains' : currentResCat.label}
              </span>
            </div>
          </PillButton>
          <AnimatePresence>
            {openDropdown === 'researchCat' && (
              <DropdownMenu
                headerTitle="SELECT RESEARCH DOMAIN"
                items={researchItems}
                selectedId={currentResCat.id}
                onSelect={(id) => onChangeFilter('researchCategory', id)}
                onClose={close}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return null;
}
