// src/components/TimerPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Play, Pause, Volume2, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BrandLogo } from './BrandLogo';
import { sound } from '../utils/audio';

export function TimerPage({
  topic = 'Defend that cursive handwriting should be the only form of writing.',
  mode = 'random-topics',
  initialSeconds = 60,
  onBack,
  onOpenAnalysis,
}) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioVolume, setAudioVolume] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    setTotalSeconds(initialSeconds);
    setTimeLeft(initialSeconds);
    setIsRunning(false);
    setIsFinished(false);
    setAudioUrl(null);
  }, [initialSeconds]);

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsRecording(true);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setAudioVolume(Math.min(1, avg / 70));
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      mediaRecorder.start(250);
      setIsRecording(true);
    } catch {
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    setIsRecording(false);
    setAudioVolume(0);
  };

  useEffect(() => {
    if (isRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsRunning(false);
            setIsFinished(true);
            stopRecording();
            sound.playTimerFinished();
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
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
      stopRecording();
    };
  }, []);

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(totalSeconds);
      setIsFinished(false);
      setIsRunning(true);
      startRecording();
      return;
    }

    if (!isRunning) {
      setIsRunning(true);
      startRecording();
    } else {
      setIsRunning(false);
      stopRecording();
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(totalSeconds);
    stopRecording();
    setAudioUrl(null);
  };

  const adjustTime = (delta) => {
    if (isRunning) return;
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

  const size = 300;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalSeconds > 0 ? timeLeft / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F9F6EC',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '24px 28px',
        color: '#1E4D3B',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto 16px auto',
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#4C6E5E',
            fontSize: '14.5px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '999px',
            backgroundColor: 'transparent',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#1E4D3B';
            e.currentTarget.style.backgroundColor = '#ECE8DC';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#4C6E5E';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          ← Back
        </button>

        <BrandLogo onClick={onBack} size="small" />
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '820px',
          margin: '0 auto',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '28px', maxWidth: '640px' }}>
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#849C90',
              textTransform: 'uppercase',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            TOPIC:
          </div>
          <h2
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(20px, 2.5vw, 25px)',
              fontWeight: 500,
              color: '#1E4D3B',
              lineHeight: '1.35',
              margin: 0,
            }}
          >
            {topic}
          </h2>
        </div>

        <div
          style={{
            height: '24px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FBE9E7',
                padding: '3px 12px',
                borderRadius: '999px',
                border: '1px solid #FFCCBC',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#D32F2F',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#C62828',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  letterSpacing: '0.04em',
                }}
              >
                RECORDING AUDIO
              </span>
              <div
                style={{
                  width: '32px',
                  height: '6px',
                  backgroundColor: '#FFCDD2',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.max(15, audioVolume * 100)}%`,
                    backgroundColor: '#D32F2F',
                    transition: 'width 0.1s ease',
                  }}
                />
              </div>
            </motion.div>
          )}

          {isFinished && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#E8F5E9',
                color: '#2E7D32',
                padding: '3px 14px',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '12px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <Sparkles size={14} color="#2E7D32" />
              <span>Time’s up! Fantastic effort!</span>
            </motion.div>
          )}
        </div>

        <div
          style={{
            position: 'relative',
            width: `${size}px`,
            height: `${size}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width={size}
            height={size}
            style={{
              transform: 'rotate(-90deg)',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E8E2D2"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#B79AE6"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: isRunning ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.3s ease',
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
            <div
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: '72px',
                color: timeLeft === 0 ? '#E8A857' : '#1E4D3B',
                lineHeight: '1',
                fontWeight: 500,
                letterSpacing: '-0.02em',
                transition: 'color 0.3s ease',
              }}
            >
              {formatTime(timeLeft)}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '12px',
              }}
            >
              <button
                onClick={() => adjustTime(-30)}
                disabled={isRunning || totalSeconds <= 30}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '12px',
                  fontWeight: 600,
                  color: totalSeconds <= 30 || isRunning ? '#A9BDB4' : '#1E4D3B',
                  backgroundColor: 'transparent',
                  border: `1.2px solid ${totalSeconds <= 30 || isRunning ? '#D2DDD7' : '#1E4D3B'}`,
                  borderRadius: '999px',
                  padding: '3px 11px',
                  cursor: totalSeconds <= 30 || isRunning ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                −0:30
              </button>

              <button
                onClick={() => adjustTime(30)}
                disabled={isRunning}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '12px',
                  fontWeight: 600,
                  color: isRunning ? '#A9BDB4' : '#1E4D3B',
                  backgroundColor: 'transparent',
                  border: `1.2px solid ${isRunning ? '#D2DDD7' : '#1E4D3B'}`,
                  borderRadius: '999px',
                  padding: '3px 11px',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                +0:30
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '32px',
          }}
        >
          <motion.button
            whileHover={{ scale: 1.08, borderColor: '#1E4D3B' }}
            whileTap={{ scale: 0.94 }}
            onClick={resetTimer}
            title="Reset Timer"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: '1.5px solid #8FA69B',
              color: '#1E4D3B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <RotateCcw size={18} color="#1E4D3B" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 6px 20px rgba(183, 154, 230, 0.55)' }}
            whileTap={{ scale: 0.94 }}
            onClick={toggleTimer}
            title={isRunning ? 'Pause' : 'Start'}
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              backgroundColor: '#B79AE6',
              border: 'none',
              boxShadow: '0 4px 16px rgba(183, 154, 230, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {isRunning ? (
              <Pause size={24} fill="#FFFFFF" color="#FFFFFF" />
            ) : (
              <Play size={24} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: '3px' }} />
            )}
          </motion.button>
        </div>

        {(isFinished || audioUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {audioUrl && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#FCFBF7',
                  border: '1px solid #D9D5C7',
                  borderRadius: '999px',
                  padding: '6px 16px',
                }}
              >
                <Volume2 size={16} color="#1E4D3B" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#315444' }}>
                  Listen back:
                </span>
                <audio src={audioUrl} controls style={{ height: '28px', maxWidth: '240px' }} />
              </div>
            )}

            <button
              onClick={() => onOpenAnalysis({ topic, mode, duration: totalSeconds - timeLeft || totalSeconds })}
              style={{
                backgroundColor: '#1E4D3B',
                backgroundImage: 'linear-gradient(180deg, #245743 0%, #1A4434 100%)',
                color: '#FFFFFF',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '13.5px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '11px 26px',
                borderRadius: '5px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 14px rgba(30, 77, 59, 0.24)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Award size={16} />
              <span>GET SPEECH ANALYSIS</span>
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
