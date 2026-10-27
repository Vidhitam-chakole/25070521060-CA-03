import { useEffect, useRef, useCallback } from 'react';
import { useMascot } from '../context/MascotContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export function useMascotGuide({
  activeTab,
  currentPage,
  timeLeft,
  isTimerRunning,
  isSpinning,
  onTriggerSpin,
  onNavigateTab,
  onStartTimer,
  onOpenAnalysis,
}) {
  const { currentUser } = useAuth();
  const nickname = currentUser?.nickname || currentUser?.username || 'Speaker';

  const {
    isVisible,
    mood,
    setMood,
    isAsleep,
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

  // Tour can still be triggered on manual help request from mascot menu
  const startTour = useCallback(() => {
    isTourActiveRef.current = true;
    setTourStep(0);
    setMood('happy');
    say("Hi! I'm Vidhitam, your speech guide. Pull the lever to practice speaking!", {
      autoDismiss: 4000,
    });
  }, [say, setMood, setTourStep]);

  const endTour = useCallback(() => {
    isTourActiveRef.current = false;
    setTourStep(null);
    setCurrentTargetKey(null);
    setMood('happy');
  }, [setCurrentTargetKey, setMood, setTourStep]);

  // Welcome greeting when user enters
  const hasGreetedRef = useRef(false);
  useEffect(() => {
    if (nickname && !hasGreetedRef.current && isVisible && !isAsleep) {
      hasGreetedRef.current = true;
      setTimeout(() => {
        setMood('happy');
        say(`Welcome, ${nickname}! Let's crush today's speech practice!`, {
          autoDismiss: 5000,
          actions: [
            { label: '🎲 Roll Topic', primary: true, onClick: onTriggerSpin },
            { label: '⏱️ 60s Practice', onClick: onStartTimer },
          ],
        });
      }, 1200);
    }
  }, [nickname, isVisible, isAsleep, say, setMood, onTriggerSpin, onStartTimer]);

  // Reactive Spin Cheering
  const prevSpinningRef = useRef(false);
  useEffect(() => {
    if (isSpinning && !prevSpinningRef.current && isVisible && !isAsleep) {
      setMood('happy');
      say("Rolling the lucky reel! Let's see what topic fate gives you! 🎰", {
        autoDismiss: 3200,
      });
    }
    prevSpinningRef.current = isSpinning;
  }, [isSpinning, isVisible, isAsleep, say, setMood]);

  // Contextual hints when user is on a tab
  useEffect(() => {
    if (isTourActiveRef.current || !isVisible || currentPage === 'timer' || isAsleep || mood === 'sleepy') return;

    clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      if (activeTab === 'random-topics') {
        setMood('happy');
        say(`Stuck on what to say, ${nickname}? Try pulling the lever to spin a new prompt!`, {
          autoDismiss: 7000,
          actions: [
            { label: '🎲 Spin Reel', primary: true, onClick: onTriggerSpin },
            { label: '⏱️ 60s Timer', onClick: onStartTimer },
          ],
        });
      } else if (activeTab === 'interview-prep') {
        setMood('pointing');
        say(`Pro-tip for ${nickname}: Use the STAR framework (Situation, Task, Action, Result) for behavioral questions!`, {
          autoDismiss: 7000,
          actions: [
            { label: '🎲 Roll Question', primary: true, onClick: onTriggerSpin },
            { label: '⏱️ Practice', onClick: onStartTimer },
          ],
        });
      } else if (activeTab === 'learn-vocab') {
        setMood('talking');
        say(`Challenge for ${nickname}: Try using this word in your opening sentence within 30 seconds!`, {
          autoDismiss: 7000,
          actions: [
            { label: '⏱️ Start 30s', primary: true, onClick: onStartTimer },
            { label: '🎲 Next Word', onClick: onTriggerSpin },
          ],
        });
      } else if (activeTab === 'deep-research') {
        setMood('talking');
        say(`Take 10 minutes to formulate your thesis before recording your speech, ${nickname}.`, {
          autoDismiss: 7000,
          actions: [
            { label: '⏱️ 10m Timer', primary: true, onClick: onStartTimer },
          ],
        });
      } else if (activeTab === 'debate-hub') {
        setMood('happy');
        say(`Explore 107 real multi-turn debate topics from Hugging Face research, ${nickname}!`, {
          autoDismiss: 7000,
          actions: [
            { label: '🎲 Spin Topic', primary: true, onClick: onTriggerSpin },
          ],
        });
      }
    }, 9000);

    return () => clearTimeout(hintTimeoutRef.current);
  }, [activeTab, currentPage, isVisible, say, setMood, nickname, onTriggerSpin, onStartTimer]);

  // Reactive Timer Guidance
  const prevTimerRunningRef = useRef(false);
  useEffect(() => {
    if (currentPage === 'timer' && isTimerRunning && !prevTimerRunningRef.current && isVisible) {
      setMood('happy');
      say("Timer is ticking! Breathe, project your voice, and stay clear! 🎤", { autoDismiss: 4000 });
    }
    prevTimerRunningRef.current = isTimerRunning;
  }, [currentPage, isTimerRunning, isVisible, say, setMood]);

  useEffect(() => {
    if (currentPage !== 'timer' || !isVisible) return;

    if (isTimerRunning && timeLeft === 10) {
      setMood('happy');
      say(`10 seconds left, ${nickname}! Wrap up with a strong conclusion!`, { autoDismiss: 4000 });
    }

    if (timeLeft === 0) {
      setMood('happy');
      say(`Time's up, ${nickname}! Great job! Review your delivery in Speech Analysis! 🏆`, {
        autoDismiss: 7000,
        actions: [
          { label: '🎤 Speech Analysis', primary: true, onClick: () => onOpenAnalysis?.() },
          { label: '🎲 Next Topic', onClick: onTriggerSpin },
        ],
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
  }, [currentPage, isTimerRunning, timeLeft, isVisible, say, setMood, nickname, onOpenAnalysis, onTriggerSpin]);

  return {
    startTour,
    endTour,
    hopToTarget,
  };
}
