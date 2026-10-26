// src/components/TimerPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Play, Pause, Sparkles, BookOpen, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BrandLogo } from './BrandLogo';
import { SessionRatingSection } from './SessionRatingSection';
import { sound } from '../utils/audio';
import { useMascot } from '../context/MascotContext';

export function TimerPage({
  topic = 'Defend that cursive handwriting should be the only form of writing.',
  mode = 'random-topics',
  source = 'random',
  initialSeconds = 60,
  onBack,
  onOpenAnalysis,
}) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [hasCompletedSession, setHasCompletedSession] = useState(false);
  const [hasClickedDoneResearch, setHasClickedDoneResearch] = useState(false);

  const timerIntervalRef = useRef(null);
  const doneResearchBtnRef = useRef(null);
  const ratingSectionRef = useRef(null);

  const {
    registerTarget,
    setCurrentTargetKey,
    setPosition,
    setFacing,
    setMood,
    say,
    dismissBubble,
  } = useMascot();

  useEffect(() => {
    setTotalSeconds(initialSeconds);
    setTimeLeft(initialSeconds);
    setIsRunning(false);
    setIsFinished(false);
    setHasCompletedSession(false);
    setHasClickedDoneResearch(false);
  }, [initialSeconds, topic]);

  // Position mascot close to the Done Research button & guide user
  const positionMascotNearButton = useCallback(() => {
    if (!doneResearchBtnRef.current) return;
    const rect = doneResearchBtnRef.current.getBoundingClientRect();
    if (!rect || rect.width === 0) return;

    const mascotWidth = 96;
    const mascotHeight = 92;

    const roomOnRight = window.innerWidth - rect.right >= mascotWidth + 20;
    const roomOnLeft = rect.left >= mascotWidth + 20;

    let targetX;
    let targetY;
    let targetFacing;

    if (roomOnRight) {
      targetX = Math.min(window.innerWidth - mascotWidth - 14, rect.right + 18);
      targetY = Math.max(75, Math.min(window.innerHeight - mascotHeight - 20, rect.top - 18));
      targetFacing = -1; // face left toward button
    } else if (roomOnLeft) {
      targetX = Math.max(14, rect.left - mascotWidth - 18);
      targetY = Math.max(75, Math.min(window.innerHeight - mascotHeight - 20, rect.top - 18));
      targetFacing = 1; // face right toward button
    } else {
      // Narrow screen: float above button
      targetX = Math.max(14, Math.min(window.innerWidth - mascotWidth - 14, rect.left + (rect.width - mascotWidth) / 2));
      targetY = Math.max(70, rect.top - mascotHeight - 16);
      targetFacing = 1;
    }

    registerTarget('done-research-button', doneResearchBtnRef.current);
    setCurrentTargetKey('done-research-button');
    setFacing(targetFacing);
    setPosition({ x: targetX, y: targetY });
  }, [registerTarget, setCurrentTargetKey, setFacing, setPosition]);

  // Position mascot near Session Rating Section when session completes
  const positionMascotNearRating = useCallback(() => {
    if (!ratingSectionRef.current) return;
    const rect = ratingSectionRef.current.getBoundingClientRect();
    if (!rect || rect.width === 0) return;

    const mascotWidth = 96;
    const mascotHeight = 92;

    const roomOnRight = window.innerWidth - rect.right >= mascotWidth + 20;
    const roomOnLeft = rect.left >= mascotWidth + 20;

    let targetX;
    let targetY;
    let targetFacing;

    if (roomOnRight) {
      targetX = Math.min(window.innerWidth - mascotWidth - 14, rect.right + 18);
      targetY = Math.max(75, Math.min(window.innerHeight - mascotHeight - 20, rect.top + 20));
      targetFacing = -1;
    } else if (roomOnLeft) {
      targetX = Math.max(14, rect.left - mascotWidth - 18);
      targetY = Math.max(75, Math.min(window.innerHeight - mascotHeight - 20, rect.top + 20));
      targetFacing = 1;
    } else {
      targetX = Math.max(14, Math.min(window.innerWidth - mascotWidth - 14, rect.left + (rect.width - mascotWidth) / 2));
      targetY = Math.max(70, rect.top - mascotHeight - 16);
      targetFacing = 1;
    }

    registerTarget('rating-section', ratingSectionRef.current);
    setCurrentTargetKey('rating-section');
    setFacing(targetFacing);
    setPosition({ x: targetX, y: targetY });
    setMood('pointing');
    say("Great job on your speech! Rate your session below! ⭐", { autoDismiss: 9000 });
  }, [registerTarget, setCurrentTargetKey, setFacing, setPosition, setMood, say]);

  // Step 1: On navigation to Timer page, Mascot glides directly next to Done Research button & tells user to click it
  useEffect(() => {
    if (isFinished || hasCompletedSession) return;

    const timer = setTimeout(() => {
      positionMascotNearButton();
      setMood('pointing');
      say("Click 'Done research!!' to start your timer! ⏱️", { autoDismiss: 9000 });
    }, 180);

    const handleResize = () => {
      if (!isFinished && !hasCompletedSession) {
        positionMascotNearButton();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
      registerTarget('done-research-button', null);
      registerTarget('rating-section', null);
      setCurrentTargetKey(null);
      dismissBubble();
      setMood('happy');
      setFacing(1);
    };
  }, [positionMascotNearButton, registerTarget, setCurrentTargetKey, dismissBubble, setMood, setFacing, say, isFinished, hasCompletedSession]);

  // Step 4: When session completes, Mascot glides down to Session Rating card and directs the user to rate
  useEffect(() => {
    if (isFinished || hasCompletedSession) {
      const timer = setTimeout(() => {
        positionMascotNearRating();
      }, 350);

      const handleResize = () => {
        positionMascotNearRating();
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [isFinished, hasCompletedSession, positionMascotNearRating]);

  const handleFinishEarly = () => {
    sound.playTimerEndBuzz();
    setIsRunning(false);
    setHasCompletedSession(true);
    setIsFinished(true);
    setMood('happy');
  };

  // Timer interval countdown
  useEffect(() => {
    if (isRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsRunning(false);
            setIsFinished(true);
            sound.playTimerFinished();
            setMood('happy');
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#E8A857', '#B79AE6', '#1E4D3B', '#A9C4B8'],
              });
            } catch {
              // ignore
            }
            return 0;
          }
          if (prev === 11) {
            setMood('pointing');
            say("10 seconds left! Wrap up with a strong conclusion! ⏳", { autoDismiss: 4000 });
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [isRunning, say, setMood]);

  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  const toggleTimer = () => {
    if (timeLeft === 0) {
      sound.playTimerStart();
      setTimeLeft(totalSeconds);
      setIsFinished(false);
      setIsRunning(true);
      return;
    }

    if (!isRunning) {
      sound.playTimerStart();
      setIsRunning(true);
    } else {
      sound.playTimerPause();
      setIsRunning(false);
    }
  };

  // Step 2 & 3: Mascot guided actions on button click
  const handleMainButtonClick = () => {
    if (!isRunning && !hasClickedDoneResearch) {
      sound.playButtonClick();
      setHasClickedDoneResearch(true);
      setMood('happy');
      // Mascot tells user to click now to start the timer!
      say("Now click 'Now start the timer' to begin! 🎙️", { autoDismiss: 7000 });
      return;
    }

    if (!isRunning) {
      // Step 3: Starting speech timer
      setMood('talking');
      say("Timer started! Deliver your speech clearly and boldly! 🚀", { autoDismiss: 5000 });
    } else {
      // Pausing
      setMood('idle');
      say("Timer paused. Take a breath and resume when ready! ⏸️", { autoDismiss: 4000 });
    }

    toggleTimer();
  };

  const resetTimer = () => {
    sound.playTimerReset();
    setIsRunning(false);
    setIsFinished(false);
    setHasCompletedSession(false);
    setHasClickedDoneResearch(false);
    setTimeLeft(totalSeconds);
    setMood('happy');
    say("Timer reset! Ready when you are! ⏱️", { autoDismiss: 4000 });
  };

  const adjustTime = (delta) => {
    if (isRunning) return;
    sound.playTimerTimeAdjust();
    const next = Math.max(30, totalSeconds + delta);
    setTotalSeconds(next);
    setTimeLeft(next);
    setIsFinished(false);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const isRatingActive = isFinished || hasCompletedSession;
  const timerDiameter = isRatingActive ? 195 : 225;
  const strokeWidth = 10;
  const radius = (timerDiameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalSeconds > 0 ? timeLeft / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const handleBack = () => {
    sound.playModalClose();
    registerTarget('done-research-button', null);
    registerTarget('rating-section', null);
    setCurrentTargetKey(null);
    dismissBubble();
    setMood('happy');
    setFacing(1);
    onBack();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F9F6EC',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '8px 16px 14px 16px',
        color: '#1E4D3B',
        boxSizing: 'border-box',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1080px',
          margin: '0 auto 6px auto',
        }}
      >
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#1E4D3B',
            fontSize: '9.5px',
            fontFamily: "'Press Start 2P', monospace",
            fontWeight: 400,
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '0px',
            border: '2px solid #1E4D3B',
            backgroundColor: '#FCFBF7',
            boxShadow: '2px 2px 0px #1E4D3B',
            transition: 'transform 0.1s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ECE8DC';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FCFBF7';
          }}
        >
          ◀ BACK
        </motion.button>

        <BrandLogo onClick={handleBack} size="small" />
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          maxWidth: '1080px',
          margin: '0 auto',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* CURRENT TOPIC CARD */}
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            marginBottom: '10px',
            maxWidth: isRatingActive ? '880px' : '680px',
            width: '100%',
            backgroundColor: '#FCFBF7',
            border: '2px solid #1E4D3B',
            boxShadow: '3px 3px 0px #1E4D3B',
            borderRadius: '0px',
            padding: '7px 16px',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}
          >
            <div
              style={{
                fontSize: '8.5px',
                fontWeight: 400,
                letterSpacing: '0.08em',
                color: '#849C90',
                textTransform: 'uppercase',
                fontFamily: "'Press Start 2P', monospace",
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <BookOpen size={11} color="#849C90" />
              <span>CURRENT TOPIC</span>
            </div>

            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '7.5px',
                backgroundColor: '#EDE8D9',
                color: '#1E4D3B',
                padding: '2px 6px',
                border: '1px solid #1E4D3B',
              }}
            >
              {mode.toUpperCase()}
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: 'clamp(15px, 2vw, 19px)',
              fontWeight: 600,
              color: '#1E4D3B',
              lineHeight: '1.3',
              margin: 0,
            }}
          >
            {topic}
          </h2>
        </motion.div>

        {/* SIDE-BY-SIDE CONTENT: Timer Column + Rate Your Research Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isRatingActive ? 'clamp(16px, 3vw, 36px)' : '0px',
            width: '100%',
            maxWidth: isRatingActive ? '1040px' : '680px',
            flexWrap: 'wrap',
            margin: '0 auto',
          }}
        >
          {/* LEFT: TIMER & CONTROLS */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: isRatingActive ? '0 0 auto' : '1 1 auto',
            }}
          >
            {/* Status notification banner when finished */}
            {isFinished && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: '#E8F5E9',
                  color: '#2E7D32',
                  padding: '3px 10px',
                  borderRadius: '0px',
                  border: '1.5px solid #2E7D32',
                  boxShadow: '2px 2px 0px #2E7D32',
                  fontWeight: 700,
                  fontSize: '11px',
                  fontFamily: "'Pixelify Sans', monospace",
                  marginBottom: '6px',
                }}
              >
                <Sparkles size={12} color="#2E7D32" />
                <span>TIME’S UP! GREAT EFFORT!</span>
              </motion.div>
            )}

            {/* CIRCULAR TIMER DISPLAY */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'relative',
                width: `${timerDiameter}px`,
                height: `${timerDiameter}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: isRunning ? 'drop-shadow(0 0 12px rgba(183, 154, 230, 0.45))' : 'none',
                transition: 'filter 0.3s ease',
              }}
            >
              <svg
                width={timerDiameter}
                height={timerDiameter}
                style={{
                  transform: 'rotate(-90deg)',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              >
                <circle
                  cx={timerDiameter / 2}
                  cy={timerDiameter / 2}
                  r={radius}
                  stroke="#E8E2D2"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <circle
                  cx={timerDiameter / 2}
                  cy={timerDiameter / 2}
                  r={radius}
                  stroke={isRunning && timeLeft <= 10 ? '#EF4444' : '#B79AE6'}
                  strokeWidth={strokeWidth}
                  strokeLinecap="square"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transition: isRunning ? 'stroke-dashoffset 1s steps(10, end), stroke 0.3s ease' : 'stroke-dashoffset 0.3s ease, stroke 0.3s ease',
                  }}
                />
              </svg>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                <motion.div
                  key={timeLeft}
                  animate={isRunning ? { scale: [1.02, 1] } : {}}
                  transition={{ duration: 0.15 }}
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: isRatingActive ? '30px' : '38px',
                    color: timeLeft <= 10 && isRunning ? '#DC2626' : (timeLeft === 0 ? '#E8A857' : '#1E4D3B'),
                    lineHeight: '1.2',
                    fontWeight: 400,
                    letterSpacing: '0.04em',
                    textShadow: timeLeft <= 10 && isRunning ? '2px 2px 0px #FECACA' : '2px 2px 0px #A9C4B8',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {formatTime(timeLeft)}
                </motion.div>

                {/* Time Adjust Buttons */}
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    marginTop: isRatingActive ? '6px' : '10px',
                  }}
                >
                  <motion.button
                    whileHover={!isRunning && totalSeconds > 30 ? { scale: 1.05, y: -1 } : {}}
                    whileTap={!isRunning && totalSeconds > 30 ? { scale: 0.95, y: 1 } : {}}
                    onClick={() => adjustTime(-30)}
                    disabled={isRunning || totalSeconds <= 30}
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '8px',
                      fontWeight: 400,
                      color: totalSeconds <= 30 || isRunning ? '#A9BDB4' : '#1E4D3B',
                      backgroundColor: '#FCFBF7',
                      border: `1.5px solid ${totalSeconds <= 30 || isRunning ? '#D2DDD7' : '#1E4D3B'}`,
                      boxShadow: `2px 2px 0px ${totalSeconds <= 30 || isRunning ? '#D2DDD7' : '#1E4D3B'}`,
                      borderRadius: '0px',
                      padding: '3px 8px',
                      cursor: totalSeconds <= 30 || isRunning ? 'not-allowed' : 'pointer',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    −0:30
                  </motion.button>

                  <motion.button
                    whileHover={!isRunning ? { scale: 1.05, y: -1 } : {}}
                    whileTap={!isRunning ? { scale: 0.95, y: 1 } : {}}
                    onClick={() => adjustTime(30)}
                    disabled={isRunning}
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '8px',
                      fontWeight: 400,
                      color: isRunning ? '#A9BDB4' : '#1E4D3B',
                      backgroundColor: '#FCFBF7',
                      border: `1.5px solid ${isRunning ? '#D2DDD7' : '#1E4D3B'}`,
                      boxShadow: `2px 2px 0px ${isRunning ? '#D2DDD7' : '#1E4D3B'}`,
                      borderRadius: '0px',
                      padding: '3px 8px',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    +0:30
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* BUTTON CONTROLS ROW */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginTop: isRatingActive ? '10px' : '16px',
                flexWrap: 'wrap',
              }}
            >
              {/* Reset Timer Button */}
              <motion.button
                whileHover={{ y: -2, boxShadow: '4px 4px 0px #1E4D3B' }}
                whileTap={{ y: 2, x: 2, boxShadow: '1px 1px 0px #1E4D3B' }}
                onClick={resetTimer}
                title="Reset Timer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '0px',
                  backgroundColor: '#FCFBF7',
                  border: '2px solid #1E4D3B',
                  boxShadow: '3px 3px 0px #1E4D3B',
                  color: '#1E4D3B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={16} color="#1E4D3B" />
              </motion.button>

              {/* Main Action Button */}
              <motion.button
                ref={doneResearchBtnRef}
                whileHover={{ y: -2, boxShadow: '5px 5px 0px #1E4D3B' }}
                whileTap={{ y: 2, x: 2, boxShadow: '1px 1px 0px #1E4D3B' }}
                onClick={handleMainButtonClick}
                title={
                  isRunning
                    ? 'Pause'
                    : !hasClickedDoneResearch
                    ? 'Done research!!'
                    : 'Now start the timer'
                }
                style={{
                  height: '38px',
                  padding: '0 16px',
                  borderRadius: '0px',
                  backgroundColor: !hasClickedDoneResearch ? '#B79AE6' : (!isRunning ? '#10B981' : '#E8A857'),
                  border: '2px solid #1E4D3B',
                  boxShadow: '3px 3px 0px #1E4D3B',
                  color: '#FFFFFF',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!hasClickedDoneResearch) e.currentTarget.style.backgroundColor = '#9F7AEA';
                  else if (!isRunning) e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  if (!hasClickedDoneResearch) e.currentTarget.style.backgroundColor = '#B79AE6';
                  else if (!isRunning) e.currentTarget.style.backgroundColor = '#10B981';
                }}
              >
                {isRunning ? (
                  <>
                    <Pause size={16} fill="#FFFFFF" color="#FFFFFF" />
                    <span>Pause</span>
                  </>
                ) : !hasClickedDoneResearch ? (
                  <span>Done research!!</span>
                ) : timeLeft < totalSeconds && !isFinished ? (
                  <>
                    <Play size={14} fill="#FFFFFF" color="#FFFFFF" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Play size={14} fill="#FFFFFF" color="#FFFFFF" />
                    <span>Now start the timer</span>
                  </>
                )}
              </motion.button>

              {/* Finish Early & Rate Button */}
              {(isRunning || (timeLeft < totalSeconds && !isFinished)) && (
                <motion.button
                  whileHover={{ y: -2, boxShadow: '4px 4px 0px #166534' }}
                  whileTap={{ y: 2, x: 2, boxShadow: '1px 1px 0px #166534' }}
                  onClick={handleFinishEarly}
                  title="Finish Session and Rate"
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '0px',
                    backgroundColor: '#DCFCE7',
                    border: '2px solid #166534',
                    boxShadow: '3px 3px 0px #166534',
                    color: '#166534',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <span>★ FINISH & RATE</span>
                </motion.button>
              )}
            </div>

            {/* GET SPEECH ANALYSIS button */}
            {onOpenAnalysis && (
              <motion.button
                whileHover={{ y: -2, boxShadow: '4px 4px 0px #0E3B33' }}
                whileTap={{ y: 2, x: 2, boxShadow: '1px 1px 0px #0E3B33' }}
                onClick={() => {
                  sound.playAnalysisOpen();
                  onOpenAnalysis({
                    topic,
                    mode,
                    duration: totalSeconds - timeLeft || totalSeconds,
                  });
                }}
                style={{
                  backgroundColor: '#1E4D3B',
                  backgroundImage: 'linear-gradient(180deg, #245743 0%, #1A4434 100%)',
                  color: '#FFFFFF',
                  fontFamily: "'Press Start 2P', monospace",
                  fontWeight: 400,
                  fontSize: '9px',
                  lineHeight: '1.4',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '9px 18px',
                  borderRadius: '0px',
                  border: '2px solid #0E3B33',
                  boxShadow: '3px 3px 0px #0E3B33',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '10px',
                }}
              >
                <Award size={14} />
                <span>GET SPEECH ANALYSIS</span>
              </motion.button>
            )}
          </div>

          {/* RIGHT: RATE YOUR RESEARCH SECTION (Beside Timer) */}
          {isRatingActive && (
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                flex: '1 1 360px',
                maxWidth: '460px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <SessionRatingSection
                topic={topic}
                source={source || (mode === 'random-topics' ? 'random' : 'manual')}
                topicType={mode}
                category={mode === 'deep-research' ? 'Deep Research' : 'General'}
                durationSeconds={totalSeconds - timeLeft || totalSeconds}
                compact={true}
                showTopicSnippet={false}
              />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
