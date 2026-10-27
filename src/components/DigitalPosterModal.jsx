// src/components/DigitalPosterModal.jsx
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer,
  Layers,
  Maximize2,
  Minimize2,
  ExternalLink,
  TrendingUp,
  Brain,
} from 'lucide-react';
import { sound } from '../utils/audio';

export function DigitalPosterModal({ isOpen, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const posterRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    try {
      sound.playButtonClick?.();
    } catch {
      // safe
    }
    window.print();
  };

  const handleClose = () => {
    try {
      sound.playModalClose?.();
    } catch {
      // safe
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 43, 33, 0.75)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: isFullscreen ? '0' : 'clamp(10px, 2vw, 24px)',
          overflowY: 'auto',
        }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          ref={posterRef}
          style={{
            width: isFullscreen ? '100vw' : '100%',
            maxWidth: isFullscreen ? '100vw' : '1240px',
            height: isFullscreen ? '100vh' : 'auto',
            maxHeight: isFullscreen ? '100vh' : '92vh',
            backgroundColor: '#F9F6EC',
            border: isFullscreen ? 'none' : '3px solid #1E4D3B',
            boxShadow: isFullscreen ? 'none' : '8px 8px 0px #0E3B33',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Top Control Bar (Hidden during Print) */}
          <div
            className="no-print"
            style={{
              backgroundColor: '#1E4D3B',
              color: '#FFFFFF',
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #0E3B33',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  backgroundColor: '#E8A857',
                  color: '#1E4D3B',
                  fontWeight: 900,
                  fontSize: '10px',
                  padding: '3px 7px',
                  fontFamily: "'Press Start 2P', monospace",
                }}
              >
                EXECUTIVE POSTER
              </span>
              <span
                style={{
                  fontFamily: "'Pixelify Sans', monospace",
                  fontWeight: 700,
                  fontSize: '15px',
                  letterSpacing: '0.02em',
                }}
              >
                LearnWithFun — Digital Poster & CEO Showcase (CA-03)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handlePrint}
                style={{
                  padding: '5px 12px',
                  backgroundColor: '#FFFFFF',
                  color: '#1E4D3B',
                  border: '1.5px solid #0E3B33',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '2px 2px 0px #0E3B33',
                }}
                title="Print or Save as PDF"
              >
                <Printer size={13} />
                <span>Print / Save PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen((prev) => !prev)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#2A6B52',
                  color: '#FFFFFF',
                  border: '1.5px solid #0E3B33',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title="Toggle Fullscreen Poster Mode"
              >
                {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>

              <button
                type="button"
                onClick={handleClose}
                style={{
                  background: '#C84B31',
                  color: '#FFFFFF',
                  border: '1.5px solid #8A2B18',
                  padding: '4px 10px',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
                title="Close Poster"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Poster Printable Body */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 'clamp(14px, 2.5vw, 28px)',
              backgroundColor: '#F9F6EC',
              backgroundImage:
                'linear-gradient(rgba(30, 77, 59, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 77, 59, 0.04) 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          >
            {/* 1. Header Banner */}
            <header
              style={{
                backgroundColor: '#FFFFFF',
                border: '3px solid #1E4D3B',
                boxShadow: '4px 4px 0px #1E4D3B',
                padding: '18px 24px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '9px',
                      backgroundColor: '#1E4D3B',
                      color: '#F9F6EC',
                      padding: '3px 8px',
                    }}
                  >
                    CAPSTONE PROJECT CA-03
                  </span>
                  <span
                    style={{
                      fontFamily: "'Pixelify Sans', monospace",
                      fontSize: '12px',
                      color: '#E8A857',
                      fontWeight: 700,
                    }}
                  >
                    ★ EXECUTIVE EVALUATION READY
                  </span>
                </div>
                <h1
                  style={{
                    margin: 0,
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'clamp(16px, 2.4vw, 24px)',
                    color: '#1E4D3B',
                    letterSpacing: '-0.5px',
                    lineHeight: '1.3',
                  }}
                >
                  LearnWithFun (SpeechPact)
                </h1>
                <p
                  style={{
                    margin: '6px 0 0 0',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '15px',
                    color: '#4E6A5E',
                    fontWeight: 600,
                  }}
                >
                  Gamified Impromptu Speaking, Behavioral Interview Preparation & AI Debate Platform
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '4px',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ color: '#7A8B83' }}>Developer:</span>
                  <strong style={{ color: '#1E4D3B' }}>Vidhitam Chakole</strong>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ color: '#7A8B83' }}>Live URL:</span>
                  <a
                    href="https://exploreandlearn.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#1E4D3B',
                      fontWeight: 700,
                      textDecoration: 'underline',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    exploreandlearn.vercel.app
                    <ExternalLink size={12} />
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ color: '#7A8B83' }}>Backend:</span>
                  <span style={{ color: '#2A6B52', fontWeight: 600 }}>Node.js • Express • MongoDB Atlas</span>
                </div>
              </div>
            </header>

            {/* 2. Key Metrics Bar (High-Impact Executive Counters) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              {[
                { label: 'Research Debate Topics', value: '107 Topics', sub: 'Hugging Face Corpus', color: '#1E4D3B' },
                { label: 'Multi-Turn Debate Rounds', value: '47,713 Turns', sub: 'Depth & Breadth Modes', color: '#2A6B52' },
                { label: 'Speech Analysis Engine', value: 'Real-Time WPM', sub: 'Filler Detection & Pace', color: '#B79AE6' },
                { label: 'Vocab & STAR Frameworks', value: '100+ Cards', sub: 'Behavioral & Consulting', color: '#E8A857' },
                { label: 'Sound Synthesizer', value: '0ms Latency', sub: 'Web Audio API Synth', color: '#1E4D3B' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #1E4D3B',
                    boxShadow: '3px 3px 0px #1E4D3B',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#7A8B83', fontFamily: "'Pixelify Sans', monospace", fontWeight: 700 }}>
                    {m.label.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: '18px',
                      fontFamily: "'Press Start 2P', monospace",
                      color: m.color,
                      margin: '4px 0',
                    }}
                  >
                    {m.value}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#556B5D', fontFamily: "'Pixelify Sans', monospace" }}>
                    {m.sub}
                  </span>
                </div>
              ))}
            </div>

            {/* 3. Three-Column Poster Body */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '18px',
                marginBottom: '20px',
              }}
            >
              {/* Column 1: Problem & Pedagogical Innovation */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #1E4D3B',
                  boxShadow: '3px 3px 0px #1E4D3B',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #EDE8DB', paddingBottom: '8px' }}>
                  <Brain size={18} color="#E8A857" />
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '12px',
                      color: '#1E4D3B',
                    }}
                  >
                    PROBLEM & SOLUTION
                  </h2>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '14px', fontFamily: "'Pixelify Sans', monospace", color: '#C84B31' }}>
                    🚨 The Problem
                  </h3>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: '#4E6A5E', fontFamily: "'Pixelify Sans', monospace" }}>
                    Speech anxiety (Glossophobia) affects over 73% of students and professionals. Traditional practice tools are passive, lack gamification, provide zero real-time delivery feedback, and offer no structured impromptu frameworks.
                  </p>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '14px', fontFamily: "'Pixelify Sans', monospace", color: '#1E4D3B' }}>
                    💡 The LearnWithFun Innovation
                  </h3>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: '#4E6A5E', fontFamily: "'Pixelify Sans', monospace" }}>
                    A gamified retro-arcade environment combining an interactive 3D lucky draw lever, structured response frameworks (STAR, Case Trees), and an autonomous companion mascot ("Vidhitam") that tracks engagement and delivers real-time speech encouragement.
                  </p>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '14px', fontFamily: "'Pixelify Sans', monospace", color: '#2A6B52' }}>
                    🎯 Pedagogical Frameworks
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#4E6A5E', lineHeight: '1.6', fontFamily: "'Pixelify Sans', monospace" }}>
                    <li><strong>STAR Framework:</strong> Situation, Task, Action, Result for behavioral hiring interviews.</li>
                    <li><strong>Consulting Frameworks:</strong> Profitability & MECE market entry case trees.</li>
                    <li><strong>30s Rapid Vocabulary:</strong> Instant contextual sentence synthesis for active vocab mastery.</li>
                  </ul>
                </div>
              </div>

              {/* Column 2: System Architecture & Technical Highlights */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #1E4D3B',
                  boxShadow: '3px 3px 0px #1E4D3B',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #EDE8DB', paddingBottom: '8px' }}>
                  <Layers size={18} color="#B79AE6" />
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '12px',
                      color: '#1E4D3B',
                    }}
                  >
                    SYSTEM ARCHITECTURE
                  </h2>
                </div>

                <div
                  style={{
                    backgroundColor: '#F9F6EC',
                    border: '1.5px solid #1E4D3B',
                    padding: '10px 12px',
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '12px',
                    lineHeight: '1.4',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#1E4D3B', marginBottom: '4px' }}>
                    🌐 Decoupled Full-Stack Architecture
                  </div>
                  <div style={{ color: '#4E6A5E' }}>
                    React 19 SPA (Vercel) ➔ Edge Reverse Proxy ➔ Node.js Express 4 REST API (Render) ➔ MongoDB Atlas Cloud DB.
                  </div>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '14px', fontFamily: "'Pixelify Sans', monospace", color: '#1E4D3B' }}>
                    ⚙️ Key Technical Highlights
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#4E6A5E', lineHeight: '1.6', fontFamily: "'Pixelify Sans', monospace" }}>
                    <li><strong>Self-Healing Database Auto-Seeder:</strong> Detects unseeded collections on startup and bulk upserts 107 debate topics with zero downtime.</li>
                    <li><strong>Web Speech API Analysis:</strong> Analyzes speech duration, Words Per Minute (WPM), and filler word frequencies (<em>um, uh, like</em>).</li>
                    <li><strong>Retro Web Audio Synthesizer:</strong> Custom procedural sound oscillator providing 8-bit arcade feedback without external audio latency.</li>
                    <li><strong>Dual Access Authentication:</strong> Instant 1-click Guest Mode or persistent JWT-secured user accounts with private history and rating analytics.</li>
                  </ul>
                </div>
              </div>

              {/* Column 3: Feature Pillars & Business Value for CEO */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #1E4D3B',
                  boxShadow: '3px 3px 0px #1E4D3B',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #EDE8DB', paddingBottom: '8px' }}>
                  <TrendingUp size={18} color="#1E4D3B" />
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '12px',
                      color: '#1E4D3B',
                    }}
                  >
                    EXECUTIVE VALUE
                  </h2>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '14px', fontFamily: "'Pixelify Sans', monospace", color: '#1E4D3B' }}>
                    🌟 5 Core Product Pillars
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { title: '1. 3D Lucky Draw Slot Reel', desc: 'Engaging physical lever pull that randomizes impromptu speaking topics.' },
                      { title: '2. Curated Debate Hub', desc: '107 research debate topics with debater stances & multi-turn transcripts.' },
                      { title: '3. Real-Time Speech Analytics', desc: 'Pitch, pace, duration, and filler-word detection with detailed scorecards.' },
                      { title: '4. Companion Mascot ("Vidhitam")', desc: 'Interactive flight guide with pupil tracking, speech prompts & encouragement.' },
                      { title: '5. Private History & Ratings', desc: 'Cloud-synced session feedback, self-ratings, and topic replay.' },
                    ].map((p, i) => (
                      <div key={i} style={{ fontSize: '12px', fontFamily: "'Pixelify Sans', monospace" }}>
                        <strong style={{ color: '#1E4D3B' }}>{p.title}:</strong>{' '}
                        <span style={{ color: '#556B5D' }}>{p.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#E8F5E9',
                    border: '1.5px solid #2A6B52',
                    padding: '10px 12px',
                    fontFamily: "'Pixelify Sans', monospace",
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#1E4D3B', fontSize: '13px', marginBottom: '4px' }}>
                    💼 Market Scalability
                  </div>
                  <div style={{ fontSize: '12px', color: '#2A6B52', lineHeight: '1.4' }}>
                    Ready for integration across university placement cells, corporate onboarding, Toastmasters clubs, and ESL speaking institutes.
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Footer Banner */}
            <footer
              style={{
                backgroundColor: '#1E4D3B',
                color: '#FFFFFF',
                padding: '12px 18px',
                border: '2px solid #0E3B33',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                fontFamily: "'Pixelify Sans', monospace",
                fontSize: '12px',
              }}
            >
              <div>
                <strong>LearnWithFun (SpeechPact)</strong> • Continuous Assessment CA-03 Submission
              </div>
              <div style={{ color: '#E8A857' }}>
                Presented to CEO & Evaluation Panel • Developed by Vidhitam Chakole
              </div>
            </footer>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
