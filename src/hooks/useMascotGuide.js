// src/hooks/useMascotGuide.js
import { useEffect, useRef, useCallback } from 'react';
import { useMascot } from '../context/MascotContext';
import confetti from 'canvas-confetti';

export function useMascotGuide({ activeTab, currentPage, timeLeft, isTimerRunning, onTriggerSpin, onNavigateTab, onStartTimer, onOpenAnalysis }) {
  const {
    isVisible,
    mood,
    setMood,
    say,
    dismissBubble,
    setPosition,
    setFacing,
    setIsMenuOpen,
    tourStep,
    setTourStep,
    setCurrentTargetKey,
    getTargetRect,
  } = useMascot();

  const lastActivityRef = useRef(Date.now());
  const idleTimerRef = useRef(null);
  const hintTimeoutRef = useRef(null);
  const isTourActiveRef = useRef(false);

  // Hop to a target element
  const hopToTarget = useCallback((targetKey, offset = { x: -80, y: 10 }, faceDirection = 1) => {
    setCurrentTargetKey(targetKey);
    const rect = getTargetRect(targetKey);
    if (!rect) return;

    const targetX = Math.max(30, Math.min(window.innerWidth - 130, rect.left + offset.x));
    const targetY = Math.max(70, Math.min(window.innerHeight - 130, rect.top + offset.y));

    setFacing(faceDirection);
    setPosition({ x: targetX, y: targetY });
  }, [getTargetRect, setFacing, setPosition, setCurrentTargetKey]);

  // ONBOARDING TOUR
  const startTour = useCallback(() => {
    localStorage.removeItem('speechpact_tour_completed');
    isTourActiveRef.current = true;
    setTourStep(0);
    setMood('surprised');

    // Drop in at center of screen
    const centerX = typeof window !== 'undefined' ? Math.round((window.innerWidth - 96) / 2) : 450;
    const centerY = typeof window !== 'undefined' ? Math.round((window.innerHeight - 92) / 2) : 280;
    setPosition({ x: centerX, y: centerY });
    setFacing(1);

    say("Hi! I'm Buddy, your speech guide. Pick a mode up here!", {
      buttons: ['Next', 'Skip tour'],
      progress: { current: 1, total: 5 },
      onNext: () => nextTourStep(1),
      onSkip: () => endTour(),
    });
    setCurrentTargetKey('tabs');
  }, [say, setMood, setPosition, setFacing, setTourStep, setCurrentTargetKey]);

  const nextTourStep = useCallback((step) => {
    setTourStep(step);

    if (step === 1) {
      setMood('pointing');
      hopToTarget('filterPills', { x: 340, y: -20 }, -1);
      say('Choose your preferred language and topic category.', {
        buttons: ['Next', 'Skip tour'],
        progress: { current: 2, total: 5 },
        onNext: () => nextTourStep(2),
        onSkip: () => endTour(),
      });
    } else if (step === 2) {
      setMood('surprised');
      hopToTarget('lever', { x: 70, y: 20 }, -1);
      say('Pull this lever to spin the reel for a random topic!', {
        buttons: ['Next', 'Skip tour'],
        progress: { current: 3, total: 5 },
        onNext: () => nextTourStep(3),
        onSkip: () => endTour(),
      });
    } else if (step === 3) {
      setMood('pointing');
      hopToTarget('startTimerBtn', { x: -90, y: -10 }, 1);
      say("Hit 'Start Timer' when you're ready to speak and record.", {
        buttons: ['Next', 'Skip tour'],
        progress: { current: 4, total: 5 },
        onNext: () => nextTourStep(4),
        onSkip: () => endTour(),
      });
    } else if (step === 4) {
      setMood('happy');
      hopToTarget('speechAnalysisBtn', { x: -90, y: -20 }, 1);
      say('After speaking, click here to get instant feedback on pace, clarity, and filler words!', {
        buttons: ['Finish Tour'],
        progress: { current: 5, total: 5 },
        onNext: () => endTour(),
        onSkip: () => endTour(),
      });
    } else {
      endTour();
    }
  }, [hopToTarget, say, setMood, setTourStep]);

  const endTour = useCallback(() => {
    isTourActiveRef.current = false;
    setTourStep(null);
    setCurrentTargetKey(null);
    localStorage.setItem('speechpact_tour_completed', 'true');
    setMood('happy');
    say("You're all set! Click me anytime if you need help.", { autoDismiss: 4000 });
    // Move to comfortable bottom-right safe corner
    setTimeout(() => {
      setPosition({ x: window.innerWidth - 130, y: window.innerHeight - 150 });
      setMood('idle');
    }, 2000);
  }, [say, setCurrentTargetKey, setMood, setPosition, setTourStep]);

  // First visit check
  useEffect(() => {
    const tourDone = localStorage.getItem('speechpact_tour_completed');
    if (!tourDone && isVisible) {
      const timer = setTimeout(() => {
        startTour();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, startTour]);

  // Activity tracking for idle roaming and sleep
  useEffect(() => {
    const handleActivity = () => {
      const wasSleeping = mood === 'sleepy';
      lastActivityRef.current = Date.now();

      if (wasSleeping) {
        setMood('surprised');
        say('I am awake! Ready to practice?', { autoDismiss: 3000 });
        setTimeout(() => setMood('idle'), 2000);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    // Roaming / Sleep loop
    const interval = setInterval(() => {
      if (isTourActiveRef.current || !isVisible) return;

      const idleDuration = Date.now() - lastActivityRef.current;

      // 60s idle -> sleep
      if (idleDuration > 60000 && mood !== 'sleepy') {
        setMood('sleepy');
        say('Zzz...', { autoDismiss: 4000 });
        return;
      }

      // 5s to 12s idle -> subtle roaming in safe zones (bottom 25% or side margins)
      if (idleDuration > 5000 && idleDuration < 58000 && mood === 'idle') {
        // Safe spots: bottom quarter of screen
        const safeMargin = 40;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        const randomX = safeMargin + Math.random() * (screenW - safeMargin * 2 - 100);
        const randomY = screenH - 160 + (Math.random() * 50 - 25);

        setPosition((prev) => {
          setFacing(randomX > prev.x ? 1 : -1);
          return { x: randomX, y: Math.max(screenH - 180, Math.min(screenH - 110, randomY)) };
        });
      }
    }, 7000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, [isVisible, mood, say, setFacing, setMood, setPosition]);

  // Contextual hints when user is on a tab
  useEffect(() => {
    if (isTourActiveRef.current || !isVisible || currentPage === 'timer') return;

    clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      if (activeTab === 'random-topics') {
        setMood('happy');
        say('Stuck on what to say? Try pulling the lever to spin a new prompt!', { autoDismiss: 5000 });
      } else if (activeTab === 'interview-prep') {
        setMood('pointing');
        say('Pro-tip: Use the STAR framework (Situation, Task, Action, Result) for behavioral questions!', {
          autoDismiss: 6000,
        });
      } else if (activeTab === 'learn-vocab') {
        setMood('talking');
        say('Challenge: Try using this word in your opening sentence within 30 seconds!', { autoDismiss: 6000 });
      } else if (activeTab === 'deep-research') {
        setMood('talking');
        say('Take 10 minutes to formulate your thesis before recording your speech.', { autoDismiss: 6000 });
      }
    }, 9000);

    return () => clearTimeout(hintTimeoutRef.current);
  }, [activeTab, currentPage, isVisible, say, setMood]);

  // Timer Page Guidance
  useEffect(() => {
    if (currentPage !== 'timer' || !isVisible) return;

    if (isTimerRunning && timeLeft === 10) {
      setMood('happy');
      say('10 seconds left! Wrap up with a strong conclusion! 🌟', { autoDismiss: 4000 });
    }

    if (timeLeft === 0) {
      setMood('happy');
      say("Time's up! Great job! Click 'GET SPEECH ANALYSIS' to review your performance.", {
        autoDismiss: 6000,
      });
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#E3A857', '#B79AE6', '#11524A', '#B9C9BF'],
        });
      } catch {
        // ignore
      }
    }
  }, [currentPage, isTimerRunning, timeLeft, isVisible, say, setMood]);

  return {
    startTour,
    endTour,
    hopToTarget,
  };
}
