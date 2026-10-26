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
      sound.playTimerStart();
      sound.playRecordStart();
      setTimeLeft(totalSeconds);
      setIsFinished(false);
      setIsRunning(true);
      startRecording();
      return;
    }

    if (!isRunning) {
      sound.playTimerStart();
      sound.playRecordStart();
      setIsRunning(true);
      startRecording();
    } else {
      sound.playTimerPause();
      sound.playRecordStop();
      setIsRunning(false);
      stopRecording();
    }
  };

  const resetTimer = () => {
    sound.playTimerReset();
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(totalSeconds);
    stopRecording();
    setAudioUrl(null);
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
          onClick={() => {
            sound.playModalClose();
            onBack();
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#1E4D3B',
            fontSize: '10px',
            fontFamily: "'Press Start 2P', monospace",
            fontWeight: 400,
            cursor: 'pointer',
            padding: '8px 14px',
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
        <div
          style={{
            marginBottom: '28px',
            maxWidth: '680px',
            backgroundColor: '#FCFBF7',
            border: '2px solid #1E4D3B',
            boxShadow: '4px 4px 0px #1E4D3B',
            borderRadius: '0px',
            padding: '16px 20px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: 400,
              letterSpacing: '0.08em',
              color: '#849C90',
              textTransform: 'uppercase',
              marginBottom: '8px',
              fontFamily: "'Press Start 2P', monospace",
            }}
          >
            CURRENT TOPIC:
          </div>
          <h2
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: 'clamp(20px, 2.5vw, 25px)',
              fontWeight: 600,
              color: '#1E4D3B',
              lineHeight: '1.4',
              margin: 0,
            }}
          >
            {topic}
          </h2>
        </div>

        <div
          style={{
            height: '28px',
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
                padding: '4px 12px',
                borderRadius: '0px',
                border: '1.5px solid #FFCCBC',
                boxShadow: '2px 2px 0px #C62828',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '0px',
                  backgroundColor: '#D32F2F',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 400,
                  color: '#C62828',
                  fontFamily: "'Press Start 2P', monospace",
                  letterSpacing: '0.04em',
                }}
              >
                RECORDING AUDIO
              </span>
              <div
                style={{
                  width: '32px',
                  height: '8px',
                  backgroundColor: '#FFCDD2',
                  borderRadius: '0px',
                  border: '1px solid #D32F2F',
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
                padding: '4px 14px',
                borderRadius: '0px',
                border: '1.5px solid #2E7D32',
                boxShadow: '2px 2px 0px #2E7D32',
                fontWeight: 700,
                fontSize: '13px',
                fontFamily: "'Pixelify Sans', monospace",
              }}
            >
              <Sparkles size={14} color="#2E7D32" />
              <span>TIME’S UP! GREAT EFFORT!</span>
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
              strokeLinecap="square"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: isRunning ? 'stroke-dashoffset 1s steps(10, end)' : 'stroke-dashoffset 0.3s ease',
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
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '44px',
                color: timeLeft === 0 ? '#E8A857' : '#1E4D3B',
                lineHeight: '1.2',
                fontWeight: 400,
                letterSpacing: '0.04em',
                textShadow: '3px 3px 0px #A9C4B8',
                transition: 'color 0.3s ease',
              }}
            >
              {formatTime(timeLeft)}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '16px',
              }}
            >
              <button
                onClick={() => adjustTime(-30)}
                disabled={isRunning || totalSeconds <= 30}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '9px',
                  fontWeight: 400,
                  color: totalSeconds <= 30 || isRunning ? '#A9BDB4' : '#1E4D3B',
                  backgroundColor: '#FCFBF7',
                  border: `2px solid ${totalSeconds <= 30 || isRunning ? '#D2DDD7' : '#1E4D3B'}`,
                  boxShadow: `2px 2px 0px ${totalSeconds <= 30 || isRunning ? '#D2DDD7' : '#1E4D3B'}`,
                  borderRadius: '0px',
                  padding: '5px 10px',
                  cursor: totalSeconds <= 30 || isRunning ? 'not-allowed' : 'pointer',
                  transition: 'all 0.1s ease',
                }}
              >
                −0:30
              </button>

              <button
                onClick={() => adjustTime(30)}
                disabled={isRunning}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '9px',
                  fontWeight: 400,
                  color: isRunning ? '#A9BDB4' : '#1E4D3B',
                  backgroundColor: '#FCFBF7',
                  border: `2px solid ${isRunning ? '#D2DDD7' : '#1E4D3B'}`,
                  boxShadow: `2px 2px 0px ${isRunning ? '#D2DDD7' : '#1E4D3B'}`,
                  borderRadius: '0px',
                  padding: '5px 10px',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  transition: 'all 0.1s ease',
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
            whileHover={{ y: -2, boxShadow: '4px 4px 0px #1E4D3B' }}
            whileTap={{ y: 2, x: 2, boxShadow: '1px 1px 0px #1E4D3B' }}
            onClick={resetTimer}
            title="Reset Timer"
            style={{
              width: '46px',
              height: '46px',
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
            <RotateCcw size={18} color="#1E4D3B" />
          </motion.button>

          <motion.button
            whileHover={{ y: -2, boxShadow: '5px 5px 0px #1E4D3B' }}
            whileTap={{ y: 2, x: 2, boxShadow: '1px 1px 0px #1E4D3B' }}
            onClick={toggleTimer}
            title={isRunning ? 'Pause' : 'Start'}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '0px',
              backgroundColor: '#B79AE6',
              border: '2px solid #1E4D3B',
              boxShadow: '4px 4px 0px #1E4D3B',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
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
              gap: '14px',
            }}
          >
            {audioUrl && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#FCFBF7',
                  border: '2px solid #1E4D3B',
                  borderRadius: '0px',
                  boxShadow: '3px 3px 0px #1E4D3B',
                  padding: '8px 16px',
                }}
              >
                <Volume2 size={16} color="#1E4D3B" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#315444', fontFamily: "'Pixelify Sans', monospace" }}>
                  Listen back:
                </span>
                <audio src={audioUrl} controls style={{ height: '28px', maxWidth: '240px' }} />
              </div>
            )}

            <button
              onClick={() => {
                sound.playAnalysisOpen();
                onOpenAnalysis({ topic, mode, duration: totalSeconds - timeLeft || totalSeconds });
              }}
              style={{
                backgroundColor: '#1E4D3B',
                backgroundImage: 'linear-gradient(180deg, #245743 0%, #1A4434 100%)',
                color: '#FFFFFF',
                fontFamily: "'Press Start 2P', monospace",
                fontWeight: 400,
                fontSize: '10.5px',
                lineHeight: '1.4',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '13px 26px',
                borderRadius: '0px',
                border: '2px solid #0E3B33',
                boxShadow: '4px 4px 0px #0E3B33',
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
