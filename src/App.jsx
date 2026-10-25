// src/App.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

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

import { RANDOM_TOPICS } from './data/randomTopics';
import { BEHAVIORAL_QUESTIONS, CONSULTING_QUESTIONS } from './data/interviewPrep';
import { VOCAB_WORDS } from './data/vocab';
import { DEEP_RESEARCH_TOPICS } from './data/deepResearch';
import { sound } from './utils/audio';

export default function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [timerTopic, setTimerTopic] = useState('');
  const [timerInitialSeconds, setTimerInitialSeconds] = useState(60);

  const [activeTab, setActiveTab] = useState('random-topics');

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topicParam = params.get('topic');
    const tabParam = params.get('tab');
    const pageParam = params.get('page') || (window.location.pathname.includes('timer') ? 'timer' : null);

    if (tabParam && ['random-topics', 'interview-prep', 'learn-vocab', 'deep-research'].includes(tabParam)) {
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

  const handleStartTimer = () => {
    const topicText =
      activeTab === 'learn-vocab'
        ? `Use "${currentTopic?.word}" in speech: ${currentTopic?.definition}`
        : currentTopic?.title || currentTopic?.text || '';

    let defaultSecs = 60;
    if (activeTab === 'learn-vocab') defaultSecs = 30;
    if (activeTab === 'deep-research') defaultSecs = 600;

    setTimerTopic(topicText);
    setTimerInitialSeconds(defaultSecs);
    setCurrentPage('timer');

    const url = new URL(window.location);
    url.searchParams.set('page', 'timer');
    url.searchParams.set('topic', encodeURIComponent(topicText));
    window.history.pushState({}, '', url);
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
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

  if (currentPage === 'timer') {
    return (
      <TimerPage
        topic={timerTopic}
        mode={activeTab}
        initialSeconds={timerInitialSeconds}
        onBack={handleBackToMain}
        onOpenAnalysis={handleOpenAnalysis}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F9F6EC',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Sound Mute Button */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          zIndex: 20,
        }}
      >
        <button
          onClick={handleToggleMute}
          title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#EDE8DB',
            border: '1px solid #D9D5C7',
            color: '#1E4D3B',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E0DACB')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EDE8DB')}
        >
          {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
      </div>

      {/* Top Floating Pill Tabs */}
      <header>
        <TopTabs activeTab={activeTab} onChangeTab={handleTabChange} />
      </header>

      {/* Main Two-Column Layout */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px 48px 20px',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1180px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(28px, 5vw, 72px)',
            alignItems: 'center',
          }}
        >
          {/* LEFT COLUMN */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '12px 0 12px clamp(12px, 3vw, 48px)',
              position: 'relative',
            }}
          >
            <HeroTitle mode={activeTab} />
            <StepsList mode={activeTab} />

            {activeTab === 'interview-prep' ? (
              <div style={{ marginTop: '24px', width: '100%' }}>
                <AnalysisButton onClick={() => handleOpenAnalysis()} />
                <FrameworkAccordion />
              </div>
            ) : (
              <div style={{ marginTop: '4px' }}>
                <AnalysisButton onClick={() => handleOpenAnalysis()} />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '12px 0',
            }}
          >
            <FilterPills
              mode={activeTab}
              filters={filters}
              onChangeFilter={handleFilterChange}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
                maxWidth: '620px',
              }}
            >
              <div style={{ flex: 1 }}>
                <TopicReel
                  mode={activeTab}
                  currentTopic={currentTopic}
                  prevTopic={prevTopic}
                  nextTopic={nextTopic}
                  isSpinning={isSpinning}
                />
              </div>

              <div
                style={{
                  marginLeft: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Lever
                  onPull={handleSpin}
                  isSpinning={isSpinning}
                  showAnnotation={true}
                />
              </div>
            </div>

            <ActionButtons
              onSpin={handleSpin}
              onStartTimer={handleStartTimer}
              isSpinning={isSpinning}
            />
          </div>
        </div>
      </main>

      <SpeechAnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        topicData={analysisTarget}
        onTryAgain={handleSpin}
      />
    </div>
  );
}
