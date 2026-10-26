// src/context/MascotContext.jsx
import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { sound } from '../utils/audio';

const MascotContext = createContext(null);

export function MascotProvider({ children }) {
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem('speechpact_mascot_hidden') !== 'true';
  });
  const [mood, setMood] = useState('idle'); // idle | happy | surprised | talking | sleepy | pointing
  const [isAsleep, setIsAsleep] = useState(false);
  const [stayPut, setStayPut] = useState(() => {
    return localStorage.getItem('speechpact_mascot_stay_put') === 'true';
  });
  const [bubble, setBubble] = useState(null); // { text, buttons, onNext, onSkip, progress, autoDismiss }
  const [position, setPosition] = useState(() => {
    return { x: 22, y: 180 };
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

  // Sleep and Wake controls
  const putToSleep = useCallback(() => {
    setIsAsleep(true);
    setMood('sleepy');
    sound.playMascotSleep();
    say('Zzz... Going to take a nap. Click me to wake me up! 🌙', { autoDismiss: 3200 });
  }, [say]);

  const wakeUp = useCallback(() => {
    setIsAsleep(false);
    setMood('happy');
    sound.playMascotWake();
    say("Yaaawn! Good morning! Let's practice speaking! ☀️", { autoDismiss: 3200 });
  }, [say]);

  const toggleSleep = useCallback(() => {
    if (isAsleep || mood === 'sleepy') {
      wakeUp();
    } else {
      putToSleep();
    }
  }, [isAsleep, mood, putToSleep, wakeUp]);

  const toggleStayPut = useCallback(() => {
    setStayPut((prev) => {
      const next = !prev;
      localStorage.setItem('speechpact_mascot_stay_put', next ? 'true' : 'false');
      sound.playButtonClick();
      if (next) {
        say('Staying put right here! 📌', { autoDismiss: 2500 });
      } else {
        say('Slow floating resumed! 🚀', { autoDismiss: 2500 });
      }
      return next;
    });
  }, [say]);

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
    isAsleep,
    putToSleep,
    wakeUp,
    toggleSleep,
    stayPut,
    setStayPut,
    toggleStayPut,
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
