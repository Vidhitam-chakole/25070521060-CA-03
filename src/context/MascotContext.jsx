// src/context/MascotContext.jsx
import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const MascotContext = createContext(null);

export function MascotProvider({ children }) {
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem('speechpact_mascot_hidden') !== 'true';
  });
  const [mood, setMood] = useState('idle'); // idle | happy | surprised | talking | sleepy | pointing
  const [bubble, setBubble] = useState(null); // { text, buttons, onNext, onSkip, progress, autoDismiss }
  const [position, setPosition] = useState(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const h = typeof window !== 'undefined' ? window.innerHeight : 768;
    return { x: Math.round((w - 96) / 2), y: Math.round((h - 92) / 2) };
  });
  const [facing, setFacing] = useState(1); // 1 = right, -1 = left
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tourStep, setTourStep] = useState(null); // null or step index 0..4
  const [currentTargetKey, setCurrentTargetKey] = useState(null);
  const [highlightRect, setHighlightRect] = useState(null);

  // Target DOM element registry
  const targetRegistryRef = useRef(new Map());

  const registerTarget = useCallback((key, element) => {
    if (element) {
      targetRegistryRef.current.set(key, element);
    } else {
      targetRegistryRef.current.delete(key);
    }
  }, []);

  const getTargetRect = useCallback((key) => {
    const el = targetRegistryRef.current.get(key);
    if (!el) return null;
    return el.getBoundingClientRect();
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem('speechpact_mascot_hidden', 'true');
    setBubble(null);
    setIsMenuOpen(false);
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
    localStorage.removeItem('speechpact_mascot_hidden');
  }, []);

  const say = useCallback((text, opts = {}) => {
    setBubble({
      text,
      buttons: opts.buttons || null,
      onNext: opts.onNext || null,
      onSkip: opts.onSkip || null,
      progress: opts.progress || null, // { current: 1, total: 5 }
      autoDismiss: opts.autoDismiss !== undefined ? opts.autoDismiss : (opts.buttons ? 0 : 6000),
    });
  }, []);

  const dismissBubble = useCallback(() => {
    setBubble(null);
  }, []);

  // Set target highlight
  useEffect(() => {
    if (!currentTargetKey) {
      setHighlightRect(null);
      return;
    }
    const update = () => {
      const rect = getTargetRect(currentTargetKey);
      setHighlightRect(rect);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, [currentTargetKey, getTargetRect]);

  const value = {
    isVisible,
    show,
    hide,
    mood,
    setMood,
    bubble,
    say,
    dismissBubble,
    position,
    setPosition,
    facing,
    setFacing,
    isMenuOpen,
    setIsMenuOpen,
    tourStep,
    setTourStep,
    currentTargetKey,
    setCurrentTargetKey,
    highlightRect,
    registerTarget,
    getTargetRect,
  };

  return <MascotContext.Provider value={value}>{children}</MascotContext.Provider>;
}

export function useMascot() {
  const ctx = useContext(MascotContext);
  if (!ctx) {
    throw new Error('useMascot must be used within MascotProvider');
  }
  return ctx;
}
