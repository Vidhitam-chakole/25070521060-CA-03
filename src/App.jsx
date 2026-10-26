// src/App.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { MascotProvider, useMascot } from './context/MascotContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Mascot } from './components/Mascot/Mascot';
import { useMascotGuide } from './hooks/useMascotGuide';
import { VideoIntro } from './components/VideoIntro';
import { PixelAuthCard } from './components/PixelAuthCard';
import { NicknamePromptModal } from './components/NicknamePromptModal';
import { UserProfileModal } from './components/UserProfileModal';
import { PlayerHud } from './components/PlayerHud';

import { TopTabs } from './components/TopTabs';
import { HeroTitle } from './components/HeroTitle';
import { StepsList } from './components/StepsList';
import { AnalysisButton } from './components/AnalysisButton';
import { FrameworkAccordion } from './components/FrameworkAccordion';
import { FilterPills } from './components/FilterPills';
import { TopicReel } from './components/TopicReel';
import { Lever } from './components/Lever';
import { ActionButtons } from './components/ActionButtons';
import { TimerPage } from './components/TimerPage';
import { SpeechAnalysisModal } from './components/SpeechAnalysisModal';
import { DebateHub } from './components/DebateHub';

import { RANDOM_TOPICS } from './data/randomTopics';
import { BEHAVIORAL_QUESTIONS, CONSULTING_QUESTIONS } from './data/interviewPrep';
import { VOCAB_WORDS } from './data/vocab';
import { DEEP_RESEARCH_TOPICS } from './data/deepResearch';
import { sound } from './utils/audio';

function AppContent() {
  const { registerTarget } = useMascot();

  // Video intro state: show on first load or on manual replay
  const [showVideoIntro, setShowVideoIntro] = useState(() => {
    return !sessionStorage.getItem('speechpact_intro_played');
  });

  // Navigation / Page State: 'main' | 'timer'
  const [currentPage, setCurrentPage] = useState('main');
  const [timerTopic, setTimerTopic] = useState('');
  const [timerSource, setTimerSource] = useState('random');
  const [timerInitialSeconds, setTimerInitialSeconds] = useState(60);
  const [timerTimeLeft, setTimerTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Active Tab: 'random-topics' | 'interview-prep' | 'learn-vocab' | 'deep-research'
  const [activeTab, setActiveTab] = useState('random-topics');

  // Filter States
  const [filters, setFilters] = useState({
    lang: 'en-us',
    category: 'random',
    difficulty: 'random',
    interviewTrack: 'behavioral',
    vocabDifficulty: 'random',
    researchCategory: 'random',
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [analysisTarget, setAnalysisTarget] = useState(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);

  // Read URL query params on initial mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topicParam = params.get('topic');
    const tabParam = params.get('tab');
    const pageParam = params.get('page') || (window.location.pathname.includes('timer') ? 'timer' : null);

    if (tabParam && ['random-topics', 'interview-prep', 'learn-vocab', 'deep-research', 'debate-hub'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    if (topicParam || pageParam === 'timer') {
      const decodedTopic = topicParam ? decodeURIComponent(topicParam) : '';
      if (decodedTopic) {
        setTimerTopic(decodedTopic);
      }
      setCurrentPage('timer');
    }

    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const qTopic = currentParams.get('topic');
      if (qTopic || window.location.pathname.includes('timer')) {
        setTimerTopic(qTopic ? decodeURIComponent(qTopic) : '');
        setCurrentPage('timer');
      } else {
        setCurrentPage('main');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Filter items based on activeTab and filters
  const currentList = useMemo(() => {
    if (activeTab === 'random-topics') {
      let list = [...RANDOM_TOPICS];
      if (filters.category !== 'random') {
        list = list.filter((item) => item.category === filters.category);
      }
      if (filters.difficulty !== 'random') {
        list = list.filter((item) => item.difficulty === filters.difficulty);
      }
      return list.length > 0 ? list : RANDOM_TOPICS;
    }

    if (activeTab === 'interview-prep') {
      return filters.interviewTrack === 'consulting' ? CONSULTING_QUESTIONS : BEHAVIORAL_QUESTIONS;
    }

    if (activeTab === 'learn-vocab') {
      let list = [...VOCAB_WORDS];
      if (filters.vocabDifficulty !== 'random') {
        list = list.filter((item) => item.difficulty === filters.vocabDifficulty);
      }
      return list.length > 0 ? list : VOCAB_WORDS;
    }

    if (activeTab === 'deep-research') {
      let list = [...DEEP_RESEARCH_TOPICS];
      if (filters.researchCategory !== 'random') {
        list = list.filter((item) => item.category === filters.researchCategory);
      }
      return list.length > 0 ? list : DEEP_RESEARCH_TOPICS;
    }

    return RANDOM_TOPICS;
  }, [activeTab, filters]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab, filters]);

  const len = currentList.length;
  const currentTopic = currentList[((currentIndex % len) + len) % len];
  const prevTopic = currentList[(((currentIndex - 1) % len) + len) % len];
  const nextTopic = currentList[(((currentIndex + 1) % len) + len) % len];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const url = new URL(window.location);
    url.searchParams.set('tab', tabId);
    window.history.replaceState({}, '', url);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Spin Logic with mechanical sound
  const handleSpin = useCallback(() => {
    if (isSpinning || len === 0) return;

    setIsSpinning(true);
    let step = 0;
    const totalSteps = 16;
    let delay = 50;

    const tick = () => {
      step++;
      setCurrentIndex((prev) => (prev + 1) % len);
      sound.playReelTick(440 + (step % 4) * 40);

      if (step < totalSteps) {
        delay = Math.floor(50 + Math.pow(step / totalSteps, 2.5) * 220);
        setTimeout(tick, delay);
      } else {
        const randomIndex = Math.floor(Math.random() * len);
        setCurrentIndex(randomIndex);
        setIsSpinning(false);
        sound.playSnapChime();
      }
    };

    setTimeout(tick, delay);
  }, [isSpinning, len]);

  const handleStartTimer = (customSource = null) => {
    const topicText =
      activeTab === 'learn-vocab'
        ? `Use "${currentTopic?.word}" in speech: ${currentTopic?.definition}`
        : currentTopic?.title || currentTopic?.text || '';

    let defaultSecs = 60;
    if (activeTab === 'learn-vocab') defaultSecs = 30;
    if (activeTab === 'deep-research') defaultSecs = 600;

    setTimerTopic(topicText);
    setTimerSource(customSource || (activeTab === 'random-topics' ? 'random' : 'manual'));
    setTimerInitialSeconds(defaultSecs);
    setTimerTimeLeft(defaultSecs);
    setCurrentPage('timer');

    const url = new URL(window.location);
    url.searchParams.set('page', 'timer');
    url.searchParams.set('topic', encodeURIComponent(topicText));
    window.history.pushState({}, '', url);
  };

  const handlePracticeDebateTopic = (topicText, source = 'manual') => {
    setTimerTopic(topicText);
    setTimerSource(source || 'manual');
    setTimerInitialSeconds(120);
    setTimerTimeLeft(120);
    setCurrentPage('timer');

    const url = new URL(window.location);
    url.searchParams.set('page', 'timer');
    url.searchParams.set('topic', encodeURIComponent(topicText));
    window.history.pushState({}, '', url);
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
    setIsTimerRunning(false);
    const url = new URL(window.location);
    url.searchParams.delete('page');
    url.searchParams.delete('topic');
    window.history.pushState({}, '', url);
  };

  const handleOpenAnalysis = (customTarget) => {
    const target = customTarget || {
      topic:
        activeTab === 'learn-vocab'
          ? currentTopic?.word
          : currentTopic?.title || currentTopic?.text,
      mode: activeTab,
    };
    setAnalysisTarget(target);
    setIsAnalysisOpen(true);
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleVideoIntroComplete = () => {
    setShowVideoIntro(false);
    sessionStorage.setItem('speechpact_intro_played', 'true');
  };

  // Connect Mascot Guide Hook
  useMascotGuide({
    activeTab,
    currentPage,
    timeLeft: timerTimeLeft,
    isTimerRunning,
    onTriggerSpin: handleSpin,
    onNavigateTab: handleTabChange,
    onStartTimer: handleStartTimer,
    onOpenAnalysis: handleOpenAnalysis,
  });

  const { isAuthenticated } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F9F6EC',
        backgroundImage:
          'linear-gradient(rgba(30, 77, 59, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 77, 59, 0.035) 1px, transparent 1px)',
        backgroundSize: '8px 8px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* 1. Fullscreen Video Intro on initial visit or manual replay */}
      {showVideoIntro ? (
        <VideoIntro onComplete={handleVideoIntroComplete} />
      ) : !isAuthenticated ? (
        /* 2. Pixelated Sign In / Register Card before opening the website */
        <PixelAuthCard onGuestAccess={() => {}} />
      ) : (
        /* 3. Main Customized Website once signed in or guest access */
        <>
          {/* Modal to customize nickname if needed */}
          <NicknamePromptModal />

          {/* User Profile & Private Research History Modal */}
          <UserProfileModal
            onPracticeTopic={(topicText) => {
              handlePracticeDebateTopic(topicText, 'manual');
            }}
          />

          {/* Persistent Mascot "Vidhitam" mounted once at app root */}
          <Mascot
            onTriggerSpin={handleSpin}
            onNavigateTab={handleTabChange}
            onStartTimer={handleStartTimer}
            onOpenAnalysis={handleOpenAnalysis}
          />

          {/* Top Player HUD with Nickname & Mongo Status */}
          <header style={{ paddingTop: '12px' }}>
            <PlayerHud onReplayIntro={() => setShowVideoIntro(true)} />
            <TopTabs activeTab={activeTab} onChangeTab={handleTabChange} />
          </header>

          {/* RENDER TIMER PAGE OR MAIN DASHBOARD */}
          {currentPage === 'timer' ? (
            <TimerPage
              topic={timerTopic}
              mode={activeTab}
              source={timerSource}
              initialSeconds={timerInitialSeconds}
              onBack={handleBackToMain}
              onOpenAnalysis={handleOpenAnalysis}
            />
          ) : activeTab === 'debate-hub' ? (
            <main
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: 'clamp(8px, 2vw, 16px)',
                width: '100%',
              }}
            >
              <DebateHub onSelectTopicForPractice={handlePracticeDebateTopic} />
            </main>
          ) : (
            <main
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(12px, 3vw, 24px) clamp(10px, 3vw, 20px) 48px clamp(10px, 3vw, 20px)',
                width: '100%',
              }}
            >
              <div className="app-main-grid">
                {/* LEFT COLUMN: Hero Title Art, Steps / Accordion, Green CTA */}
                <div className="app-left-col">
                  <HeroTitle mode={activeTab} />
                  <StepsList mode={activeTab} />

                  {activeTab === 'interview-prep' ? (
                    <div style={{ marginTop: '20px', width: '100%' }}>
                      <div ref={(el) => registerTarget('speechAnalysisBtn', el)}>
                        <AnalysisButton onClick={() => handleOpenAnalysis()} />
                      </div>
                      <div ref={(el) => registerTarget('frameworksAccordion', el)}>
                        <FrameworkAccordion />
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '4px' }} ref={(el) => registerTarget('speechAnalysisBtn', el)}>
                      <AnalysisButton onClick={() => handleOpenAnalysis()} />
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: Filter Pills, Topic Reel, Lever, Buttons */}
                <div className="app-right-col">
                  <div ref={(el) => registerTarget('filterPills', el)}>
                    <FilterPills
                      mode={activeTab}
                      filters={filters}
                      onChangeFilter={handleFilterChange}
                    />
                  </div>

                  <div
                    id="topic-reel-container"
                    className="reel-lever-wrapper"
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: '570px',
                        position: 'relative',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <TopicReel
                          mode={activeTab}
                          currentTopic={currentTopic}
                          prevTopic={prevTopic}
                          nextTopic={nextTopic}
                          isSpinning={isSpinning}
                        />
                      </div>

                      <div
                        ref={(el) => registerTarget('lever', el)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexShrink: 0,
                          marginLeft: '-8px',
                          zIndex: 5,
                        }}
                      >
                        <Lever
                          onPull={handleSpin}
                          isSpinning={isSpinning}
                          showAnnotation={true}
                        />
                      </div>
                    </div>
                  </div>

                  <div ref={(el) => registerTarget('startTimerBtn', el)}>
                    <ActionButtons
                      onSpin={handleSpin}
                      onStartTimer={handleStartTimer}
                      isSpinning={isSpinning}
                    />
                  </div>
                </div>
              </div>
            </main>
          )}

          {/* Speech Analysis Modal */}
          <SpeechAnalysisModal
            isOpen={isAnalysisOpen}
            onClose={() => setIsAnalysisOpen(false)}
            topicData={analysisTarget}
            onTryAgain={handleSpin}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MascotProvider>
        <AppContent />
      </MascotProvider>
    </AuthProvider>
  );
}

