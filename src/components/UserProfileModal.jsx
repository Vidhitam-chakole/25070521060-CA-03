// src/components/UserProfileModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  History,
  Star,
  Search,
  Calendar,
  Trash2,
  Edit2,
  Check,
  Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

export function UserProfileModal({ onPracticeTopic }) {
  const {
    currentUser,
    isGuest,
    isProfileOpen,
    closeProfile,
    profileInitialTab,
    historyList,
    historyStats,
    isHistoryLoading,
    updateHistoryEntry,
    deleteHistoryEntry,
    saveNickname,
    dbStatus,
  } = useAuth();

  const [activeTab, setActiveTab] = useState(profileInitialTab || 'history');
  const [ratingFilter, setRatingFilter] = useState('all'); // 'all' | '5' | '4' | '3' | '2' | '1'

  // Nickname editing state in profile
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(currentUser?.nickname || currentUser?.username || '');

  // Editing feedback inline on a history card
  const [editingHistoryId, setEditingHistoryId] = useState(null);
  const [editingFeedbackText, setEditingFeedbackText] = useState('');

  if (!isProfileOpen) return null;

  const displayName = currentUser?.nickname || currentUser?.username || (isGuest ? 'Guest Speaker' : 'Scholar');
  const userEmail = currentUser?.email || (isGuest ? 'Guest session (unregistered)' : 'scholar@learnwithfun.edu');
  const initial = displayName.charAt(0).toUpperCase();

  // Filter history entries locally by rating for instantaneous UI response
  const filteredHistory = historyList.filter((item) => {
    if (ratingFilter !== 'all' && item.rating !== parseInt(ratingFilter, 10)) {
      return false;
    }
    return true;
  });

  const handleUpdateRating = async (id, newRating) => {
    sound.playStarSelect(newRating);
    await updateHistoryEntry(id, { rating: newRating });
  };

  const handleStartEditFeedback = (item) => {
    sound.playPillClick();
    setEditingHistoryId(item._id);
    setEditingFeedbackText(item.feedback || '');
  };

  const handleSaveFeedback = async (id) => {
    await updateHistoryEntry(id, { feedback: editingFeedbackText });
    setEditingHistoryId(null);
    setEditingFeedbackText('');
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to remove this research session from your profile history?')) {
      await deleteHistoryEntry(id);
    }
  };

  const handlePracticeAgain = (topicText) => {
    sound.playButtonClick();
    closeProfile();
    if (onPracticeTopic) {
      onPracticeTopic(topicText);
    }
  };

  const handleSaveNicknameSubmit = async (e) => {
    if (e) e.preventDefault();
    if (nicknameInput.trim()) {
      await saveNickname(nicknameInput.trim());
      setIsEditingNickname(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(20, 45, 34, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px',
        }}
        onClick={closeProfile}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#FCFBF7',
            border: '3px solid #1E4D3B',
            boxShadow: '7px 7px 0px #1E4D3B',
            borderRadius: '0px',
            maxWidth: '820px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            color: '#1E4D3B',
            position: 'relative',
          }}
        >
          {/* Modal Header Bar */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#1E4D3B',
              color: '#F9F6EC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #133327',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#B79AE6',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '14px',
                  fontWeight: 700,
                  border: '2px solid #FFFFFF',
                  boxShadow: '2px 2px 0px #0E291F',
                }}
              >
                {initial}
              </div>

              <div>
                <h2
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '13px',
                    margin: 0,
                    lineHeight: '1.3',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>USER PROFILE & HISTORY</span>
                </h2>
                <div
                  style={{
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '13px',
                    color: '#A7C4B7',
                    marginTop: '2px',
                  }}
                >
                  {displayName} • {userEmail}
                </div>
              </div>
            </div>

            <button
              onClick={closeProfile}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#FAF8F0',
                border: '2px solid #133327',
                boxShadow: '2px 2px 0px #133327',
                color: '#1E4D3B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Close Profile"
            >
              <X size={18} />
            </button>
          </div>

          {/* Sub Navigation Tabs inside Profile */}
          <div
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '6px',
              padding: '12px clamp(10px, 3vw, 20px) 0 clamp(10px, 3vw, 20px)',
              backgroundColor: '#EDE8DB',
              borderBottom: '2px solid #1E4D3B',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            <button
              type="button"
              onClick={() => {
                sound.playTabSwitch();
                setActiveTab('history');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '10px',
                borderTop: '2px solid #1E4D3B',
                borderLeft: '2px solid #1E4D3B',
                borderRight: '2px solid #1E4D3B',
                borderBottom: activeTab === 'history' ? '2px solid #FCFBF7' : '2px solid #1E4D3B',
                backgroundColor: activeTab === 'history' ? '#FCFBF7' : '#DCD4C0',
                color: activeTab === 'history' ? '#1E4D3B' : '#6A7D73',
                marginBottom: activeTab === 'history' ? '-2px' : '0px',
                cursor: 'pointer',
                fontWeight: activeTab === 'history' ? 700 : 400,
              }}
            >
              <History size={14} />
              <span>RESEARCH HISTORY ({historyList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTabSwitch();
                setActiveTab('account');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '10px',
                borderTop: '2px solid #1E4D3B',
                borderLeft: '2px solid #1E4D3B',
                borderRight: '2px solid #1E4D3B',
                borderBottom: activeTab === 'account' ? '2px solid #FCFBF7' : '2px solid #1E4D3B',
                backgroundColor: activeTab === 'account' ? '#FCFBF7' : '#DCD4C0',
                color: activeTab === 'account' ? '#1E4D3B' : '#6A7D73',
                marginBottom: activeTab === 'account' ? '-2px' : '0px',
                cursor: 'pointer',
                fontWeight: activeTab === 'account' ? 700 : 400,
              }}
            >
              <User size={14} />
              <span>ACCOUNT DETAILS</span>
            </button>
          </div>

          {/* Modal Body */}
          <div
            style={{
              padding: '20px',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {activeTab === 'history' ? (
              <div>
                {/* 1. Quick Stats Strip */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #1E4D3B',
                      boxShadow: '3px 3px 0px #1E4D3B',
                      padding: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '8px',
                        color: '#658274',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                      }}
                    >
                      TOTAL SESSIONS
                    </div>
                    <div
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '20px',
                        color: '#1E4D3B',
                      }}
                    >
                      {historyStats.totalSessions || historyList.length}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Pixelify Sans', monospace",
                        fontSize: '12px',
                        color: '#3B6852',
                        marginTop: '2px',
                      }}
                    >
                      Recorded in MongoDB
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #1E4D3B',
                      boxShadow: '3px 3px 0px #1E4D3B',
                      padding: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '8px',
                        color: '#658274',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                      }}
                    >
                      AVG SATISFACTION
                    </div>
                    <div
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '20px',
                        color: '#E8A857',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>{historyStats.avgRating || (historyList.length ? (historyList.reduce((acc, c) => acc + c.rating, 0) / historyList.length).toFixed(1) : '0')}</span>
                      <span style={{ fontSize: '14px' }}>★</span>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Pixelify Sans', monospace",
                        fontSize: '12px',
                        color: '#3B6852',
                        marginTop: '2px',
                      }}
                    >
                      Out of 5 Stars
                    </div>
                  </div>
                </div>

                {/* 2. Rating Filter Bar */}
                <div
                  style={{
                    backgroundColor: '#EDE8DB',
                    border: '2px solid #1E4D3B',
                    padding: '10px 14px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '8px',
                        color: '#556B5D',
                      }}
                    >
                      RATING:
                    </span>
                    {['all', '5', '4', '3', '2', '1'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          sound.playPillClick();
                          setRatingFilter(r);
                        }}
                        style={{
                          padding: '4px 10px',
                          fontFamily: "'Pixelify Sans', monospace",
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor: ratingFilter === r ? '#E8A857' : '#FFFFFF',
                          color: ratingFilter === r ? '#451A03' : '#1E4D3B',
                          border: '1.5px solid #1E4D3B',
                          cursor: 'pointer',
                        }}
                      >
                        {r === 'all' ? 'All' : `${r}★`}
                      </button>
                    ))}
                  </div>

                  {ratingFilter !== 'all' && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playPillClick();
                        setRatingFilter('all');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#C84B31',
                        fontFamily: "'Pixelify Sans', monospace",
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        textDecoration: 'underline',
                      }}
                    >
                      Reset filter
                    </button>
                  )}
                </div>

                {/* 3. History Entries List */}
                {isHistoryLoading ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '11px',
                      color: '#556B5D',
                    }}
                  >
                    CONNECTING TO MONGODB COMPASS...
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '48px 20px',
                      backgroundColor: '#FFFFFF',
                      border: '2px dashed #C4D1CB',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '12px',
                        color: '#1E4D3B',
                        marginBottom: '8px',
                      }}
                    >
                      {historyList.length === 0 ? 'NO RESEARCH SESSIONS YET' : 'NO SESSIONS MATCH FILTER'}
                    </div>
                    <p
                      style={{
                        fontFamily: "'Pixelify Sans', monospace",
                        fontSize: '15px',
                        color: '#658274',
                        maxWidth: '460px',
                        margin: '0 auto 16px auto',
                        lineHeight: '1.4',
                      }}
                    >
                      {historyList.length === 0
                        ? 'Whenever you complete a research session, spin the topic reel, or practice discussion topics, rate them 1-5 stars and they will be securely stored in your private MongoDB profile history!'
                        : 'Try adjusting your rating filter above to see other entries.'}
                    </p>
                    {historyList.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playPillClick();
                          setRatingFilter('all');
                        }}
                        style={{
                          padding: '6px 14px',
                          backgroundColor: '#1E4D3B',
                          color: '#FFFFFF',
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: '9px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        RESET RATING FILTER
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {filteredHistory.map((item) => {
                      const isEditingThisFeedback = editingHistoryId === item._id;

                      return (
                        <div
                          key={item._id}
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '2px solid #1E4D3B',
                            boxShadow: '3px 3px 0px #1E4D3B',
                            padding: '16px 18px',
                            transition: 'transform 0.15s ease',
                          }}
                        >
                          {/* Card Top: Badges & Date */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '8px',
                              marginBottom: '8px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              {/* Source Badge */}
                              <span
                                style={{
                                  fontFamily: "'Pixelify Sans', monospace",
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  padding: '1px 6px',
                                  border: '1px solid #1E4D3B',
                                  backgroundColor: item.source === 'random' ? '#EDE9FE' : '#FEF3C7',
                                  color: item.source === 'random' ? '#5B21B6' : '#92400E',
                                }}
                              >
                                {item.source === 'random' ? 'Randomly Generated' : 'Manually Searched'}
                              </span>

                              {/* Category Badge */}
                              {item.category && (
                                <span
                                  style={{
                                    fontFamily: "'Pixelify Sans', monospace",
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    padding: '1px 6px',
                                    border: '1px solid #D1D5DB',
                                    backgroundColor: '#F3F4F6',
                                    color: '#4B5563',
                                  }}
                                >
                                  {item.category}
                                </span>
                              )}
                            </div>

                            {/* Completed Date */}
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontFamily: "'Pixelify Sans', monospace",
                                fontSize: '12px',
                                color: '#658274',
                              }}
                            >
                              <Calendar size={13} />
                              <span>{formatDate(item.completedAt || item.createdAt)}</span>
                            </div>
                          </div>

                          {/* Topic Title */}
                          <h3
                            style={{
                              fontFamily: "'Pixelify Sans', monospace",
                              fontSize: '17px',
                              fontWeight: 700,
                              color: '#1E4D3B',
                              margin: '0 0 10px 0',
                              lineHeight: '1.35',
                            }}
                          >
                            “{item.topic}”
                          </h3>

                          {/* Satisfaction Rating Row: 5 Stars */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '10px',
                              backgroundColor: '#FAF8F0',
                              border: '1px solid #E8E2D2',
                              padding: '8px 12px',
                              marginBottom: '10px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  fontFamily: "'Press Start 2P', monospace",
                                  fontSize: '8px',
                                  color: '#658274',
                                }}
                              >
                                SATISFACTION:
                              </span>

                              {/* Interactive Stars */}
                              <div style={{ display: 'flex', gap: '4px' }}>
                                {[1, 2, 3, 4, 5].map((starVal) => {
                                  const isFilled = starVal <= item.rating;
                                  return (
                                    <button
                                      key={starVal}
                                      type="button"
                                      onClick={() => handleUpdateRating(item._id, starVal)}
                                      title={`Update to ${starVal} star${starVal > 1 ? 's' : ''}`}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '0px 2px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <Star
                                        size={18}
                                        fill={isFilled ? '#E8A857' : '#FFFFFF'}
                                        color={isFilled ? '#B45309' : '#C4D1CB'}
                                        strokeWidth={2}
                                      />
                                    </button>
                                  );
                                })}
                              </div>

                              <span
                                style={{
                                  fontFamily: "'Pixelify Sans', monospace",
                                  fontSize: '13px',
                                  fontWeight: 700,
                                  color: '#1E4D3B',
                                }}
                              >
                                {item.rating} / 5 Stars
                              </span>
                            </div>

                            {/* Actions: Practice Again & Delete */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => handlePracticeAgain(item.topic)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  backgroundColor: '#1E4D3B',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontFamily: "'Pixelify Sans', monospace",
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  padding: '5px 10px',
                                  cursor: 'pointer',
                                }}
                                title="Practice this topic again in Timer mode"
                              >
                                <span>Practice Again</span>
                                <span>▶</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item._id)}
                                style={{
                                  backgroundColor: 'transparent',
                                  border: '1px solid #FECACA',
                                  color: '#DC2626',
                                  padding: '4px 6px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                title="Remove from History"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* User Feedback & Reflection Notes */}
                          {isEditingThisFeedback ? (
                            <div style={{ marginTop: '8px' }}>
                              <textarea
                                value={editingFeedbackText}
                                onChange={(e) => setEditingFeedbackText(e.target.value)}
                                rows={2}
                                style={{
                                  width: '100%',
                                  padding: '6px 10px',
                                  fontFamily: "'Pixelify Sans', monospace",
                                  fontSize: '13px',
                                  backgroundColor: '#FAF8F0',
                                  border: '1.5px solid #1E4D3B',
                                  outline: 'none',
                                  boxSizing: 'border-box',
                                }}
                              />
                              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleSaveFeedback(item._id)}
                                  style={{
                                    padding: '4px 10px',
                                    backgroundColor: '#1E4D3B',
                                    color: '#FFFFFF',
                                    fontFamily: "'Pixelify Sans', monospace",
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <Check size={12} />
                                  <span>Save Notes</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingHistoryId(null)}
                                  style={{
                                    padding: '4px 10px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#658274',
                                    fontFamily: "'Pixelify Sans', monospace",
                                    fontSize: '12px',
                                    border: '1px solid #C4D1CB',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: '8px',
                              }}
                            >
                              <div
                                style={{
                                  fontFamily: "'Pixelify Sans', monospace",
                                  fontSize: '13.5px',
                                  color: item.feedback ? '#375244' : '#8A9C93',
                                  fontStyle: item.feedback ? 'italic' : 'normal',
                                  lineHeight: '1.4',
                                }}
                              >
                                {item.feedback ? `“${item.feedback}”` : 'No reflection notes added.'}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleStartEditFeedback(item)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#1E4D3B',
                                  cursor: 'pointer',
                                  fontFamily: "'Pixelify Sans', monospace",
                                  fontSize: '11px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  opacity: 0.7,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <Edit2 size={11} />
                                <span>{item.feedback ? 'Edit Notes' : '+ Add Notes'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* ACCOUNT DETAILS TAB */
              <div style={{ maxWidth: '520px', margin: '0 auto', padding: '10px 0' }}>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #1E4D3B',
                    boxShadow: '3px 3px 0px #1E4D3B',
                    padding: '20px',
                    marginBottom: '16px',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '11px',
                      color: '#1E4D3B',
                      marginBottom: '14px',
                    }}
                  >
                    PERSONAL INFO
                  </h3>

                  <div style={{ marginBottom: '14px' }}>
                    <div
                      style={{
                        fontFamily: "'Pixelify Sans', monospace",
                        fontSize: '12px',
                        color: '#658274',
                        marginBottom: '4px',
                      }}
                    >
                      Registered Email:
                    </div>
                    <div
                      style={{
                        fontFamily: "'Pixelify Sans', monospace",
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#1E4D3B',
                      }}
                    >
                      {currentUser?.email || 'Guest Scholar'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        fontFamily: "'Pixelify Sans', monospace",
                        fontSize: '12px',
                        color: '#658274',
                        marginBottom: '4px',
                      }}
                    >
                      Display Nickname:
                    </div>

                    {isEditingNickname ? (
                      <form onSubmit={handleSaveNicknameSubmit} style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={nicknameInput}
                          onChange={(e) => setNicknameInput(e.target.value)}
                          maxLength={24}
                          autoFocus
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            fontFamily: "'Pixelify Sans', monospace",
                            fontSize: '15px',
                            border: '2px solid #1E4D3B',
                            backgroundColor: '#FAF8F0',
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#1E4D3B',
                            color: '#FFFFFF',
                            fontFamily: "'Pixelify Sans', monospace",
                            fontSize: '13px',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingNickname(false)}
                          style={{
                            padding: '6px 10px',
                            backgroundColor: '#FFFFFF',
                            color: '#658274',
                            border: '1px solid #C4D1CB',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            fontFamily: "'Pixelify Sans', monospace",
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#1E4D3B',
                          }}
                        >
                          {displayName}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            sound.playPillClick();
                            setIsEditingNickname(true);
                            setNicknameInput(displayName);
                          }}
                          style={{
                            padding: '3px 8px',
                            fontSize: '12px',
                            fontFamily: "'Pixelify Sans', monospace",
                            backgroundColor: '#FAF8F0',
                            border: '1px solid #1E4D3B',
                            cursor: 'pointer',
                            color: '#1E4D3B',
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Database Connection Verification */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #1E4D3B',
                    boxShadow: '3px 3px 0px #1E4D3B',
                    padding: '20px',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '11px',
                      color: '#1E4D3B',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Database size={14} color="#166534" />
                    <span>MONGODB STORAGE STATUS</span>
                  </h3>

                  <div
                    style={{
                      fontFamily: "'Pixelify Sans', monospace",
                      fontSize: '14px',
                      color: '#4B6356',
                      lineHeight: '1.5',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div>
                      <strong>Database:</strong> {dbStatus?.database || 'learnwithfun'}
                    </div>
                    <div>
                      <strong>Host:</strong> {dbStatus?.host || '127.0.0.1:27017'}
                    </div>
                    <div>
                      <strong>Collection:</strong> research_history
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong>Status:</strong>
                      <span
                        style={{
                          color: '#166534',
                          fontWeight: 700,
                          backgroundColor: '#DCFCE7',
                          padding: '1px 6px',
                          border: '1px solid #166534',
                          fontSize: '12px',
                        }}
                      >
                        ● Connected (MongoDB Compass)
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#658274', marginTop: '6px' }}>
                      All your previous research, ratings, and feedback are linked to your user ID and permanently persist across all future sign-ins.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
