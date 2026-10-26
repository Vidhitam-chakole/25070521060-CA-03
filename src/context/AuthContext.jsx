// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sound } from '../utils/audio';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'learnwithfun_auth_user';
const STORAGE_KEY_TOKEN = 'learnwithfun_auth_token';

// API base paths - uses VITE_API_URL if configured, else Vite dev proxy with localhost:5000 fallback
const SERVER_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = `${SERVER_BASE}/api/auth`;
const DIRECT_API_BASE = 'http://127.0.0.1:5000/api/auth';
const HISTORY_API_BASE = `${SERVER_BASE}/api/history`;
const DIRECT_HISTORY_API_BASE = 'http://127.0.0.1:5000/api/history';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER) || localStorage.getItem('speechpact_auth_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed?.isDemoMode) {
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem('speechpact_auth_user');
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem('speechpact_auth_token');
        localStorage.removeItem('learnwithfun_demo_accounts');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_TOKEN) || localStorage.getItem('speechpact_auth_token') || null;
  });

  const [dbStatus, setDbStatus] = useState({
    checked: false,
    connected: false,
    database: 'learnwithfun',
    host: '127.0.0.1:27017',
  });

  const [isAskingNickname, setIsAskingNickname] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // History & Profile State
  const [historyList, setHistoryList] = useState([]);
  const [historyStats, setHistoryStats] = useState({
    totalSessions: 0,
    avgRating: 0,
    manualCount: 0,
    randomCount: 0,
  });
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState('history');

  // Helper fetch with fallback
  const apiFetch = useCallback(async (endpoint, options = {}) => {
    let res;
    let proxyFailed = false;

    try {
      // First attempt relative proxy URL
      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      });
      if (!res || res.status === 502 || res.status === 504) {
        proxyFailed = true;
      }
    } catch {
      proxyFailed = true;
    }

    // If relative fails (e.g. proxy mismatch), attempt direct backend on 127.0.0.1:5000
    if (proxyFailed || !res) {
      try {
        res = await fetch(`${DIRECT_API_BASE}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
          },
        });
      } catch {
        throw new Error('Unable to communicate with Node.js / MongoDB backend. Is the server running?');
      }
    }

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error(`Server returned unexpected response (${res?.status || 500})`);
    }

    if (!res.ok && data?.message) {
      throw new Error(data.message);
    }

    return data;
  }, [token]);

  // Check DB health on mount
  const checkDbHealth = useCallback(async () => {
    try {
      const data = await apiFetch('/health');
      setDbStatus({
        checked: true,
        connected: Boolean(data?.mongoConnected),
        database: data?.database || 'learnwithfun',
        host: `${data?.host || '127.0.0.1'}:${data?.port || 27017}`,
      });
      return data;
    } catch {
      setDbStatus({
        checked: true,
        connected: false,
        database: 'learnwithfun',
        host: '127.0.0.1:27017',
      });
      return null;
    }
  }, [apiFetch]);

  useEffect(() => {
    checkDbHealth();
    const interval = setInterval(checkDbHealth, 15000);
    return () => clearInterval(interval);
  }, [checkDbHealth]);

  // Persist user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }, [token]);

  // Register with mandatory email and password
  const register = async (email, password, nickname) => {
    setIsLoading(true);
    setAuthError('');
    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail) {
        throw new Error('Please enter a valid email address.');
      }
      if (!password || password.length < 7) {
        throw new Error('Password must be at least 7 characters long.');
      }

      const data = await apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password, nickname }),
      });

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      setToken(data.token);
      const user = data.user;
      setCurrentUser(user);

      // Play sound
      sound.playSuccessCelebration();

      // If user provided nickname, we are set; otherwise prompt
      if (!user.nickname) {
        setIsAskingNickname(true);
      }

      return { success: true, user };
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      sound.playTimerEndBuzz();
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError('');
    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail || !password) {
        throw new Error('Please enter both email and password.');
      }

      const data = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      const user = data.user;
      setCurrentUser(user);

      sound.playSnapChime();

      // If no nickname yet, ask for it
      if (!user.nickname) {
        setIsAskingNickname(true);
      }

      return { success: true, user };
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      sound.playTimerEndBuzz();
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Guest login ("Use without signing")
  const loginAsGuest = (guestName = '') => {
    const trimmed = guestName.trim() || 'Guest Speaker';
    const guestUser = {
      _id: 'guest_' + Date.now(),
      username: 'guest',
      nickname: trimmed,
      isGuest: true,
      avatar: 'parrot',
      loginCount: 1,
    };
    setToken(null);
    setCurrentUser(guestUser);
    sound.playButtonClick();
    return guestUser;
  };

  // Set / Update Nickname
  const saveNickname = async (newNickname) => {
    const trimmed = (newNickname || '').trim();
    if (!trimmed) return;

    if (currentUser?.isGuest) {
      setCurrentUser((prev) => ({ ...prev, nickname: trimmed }));
      setIsAskingNickname(false);
      sound.playSnapChime();
      return;
    }

    try {
      setIsLoading(true);
      const data = await apiFetch('/nickname', {
        method: 'POST',
        body: JSON.stringify({
          userId: currentUser._id,
          nickname: trimmed,
        }),
      });

      if (data.success && data.user) {
        setCurrentUser(data.user);
      } else {
        // Fallback local update
        setCurrentUser((prev) => ({ ...prev, nickname: trimmed }));
      }
      setIsAskingNickname(false);
      sound.playSnapChime();
    } catch (err) {
      console.warn('Nickname save fallback to local:', err);
      setCurrentUser((prev) => ({ ...prev, nickname: trimmed }));
      setIsAskingNickname(false);
    } finally {
      setIsLoading(false);
    }
  };

  // History Fetch with Fallback
  const historyFetch = useCallback(async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const res = await fetch(`${HISTORY_API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
      return await res.json();
    } catch {
      try {
        const directRes = await fetch(`${DIRECT_HISTORY_API_BASE}${endpoint}`, {
          ...options,
          headers,
        });
        return await directRes.json();
      } catch {
        throw new Error('Unable to connect to MongoDB research history service.');
      }
    }
  }, [token]);

  // Fetch History for Authenticated User
  const fetchHistory = useCallback(async (filters = {}) => {
    if (!token || currentUser?.isGuest) {
      setHistoryList([]);
      return { success: true, history: [], stats: { totalSessions: 0, avgRating: 0, manualCount: 0, randomCount: 0 } };
    }

    setIsHistoryLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.source && filters.source !== 'all') params.append('source', filters.source);
      if (filters.q && filters.q.trim()) params.append('q', filters.q.trim());
      if (filters.minRating) params.append('minRating', filters.minRating);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const data = await historyFetch(qs, { method: 'GET' });

      if (data.success) {
        setHistoryList(data.history || []);
        if (data.stats) {
          setHistoryStats(data.stats);
        }
        return data;
      } else {
        throw new Error(data.message || 'Failed to load research history');
      }
    } catch (err) {
      console.warn('Error fetching research history from MongoDB:', err.message);
      return { success: false, error: err.message, history: [] };
    } finally {
      setIsHistoryLoading(false);
    }
  }, [token, currentUser, historyFetch]);

  // Automatically fetch research history when authenticated user signs in
  useEffect(() => {
    if (currentUser && !currentUser.isGuest && token) {
      fetchHistory();
    } else {
      setHistoryList([]);
      setHistoryStats({ totalSessions: 0, avgRating: 0, manualCount: 0, randomCount: 0 });
    }
  }, [currentUser, token, fetchHistory]);

  // Save new research session with satisfaction rating (1-5 stars) and feedback
  const addHistoryEntry = async (sessionData) => {
    if (!token || currentUser?.isGuest) {
      const localEntry = {
        _id: 'hist_' + Date.now(),
        topic: sessionData.topic,
        source: sessionData.source || 'manual',
        topicType: sessionData.topicType || 'manual-search',
        category: sessionData.category || 'General',
        rating: sessionData.rating || 5,
        feedback: sessionData.feedback || '',
        durationSeconds: sessionData.durationSeconds || 0,
        completedAt: new Date().toISOString(),
      };
      setHistoryList((prev) => [localEntry, ...prev]);
      setHistoryStats((prev) => ({
        ...prev,
        totalSessions: prev.totalSessions + 1,
        manualCount: prev.manualCount + (localEntry.source === 'manual' ? 1 : 0),
        randomCount: prev.randomCount + (localEntry.source === 'random' ? 1 : 0),
      }));
      sound.playSuccessCelebration();
      return { success: true, entry: localEntry, isGuest: Boolean(currentUser?.isGuest) };
    }

    try {
      const data = await historyFetch('', {
        method: 'POST',
        body: JSON.stringify(sessionData),
      });

      if (!data.success) {
        throw new Error(data.message || 'Failed to save research session');
      }

      const savedEntry = data.entry;
      setHistoryList((prev) => [savedEntry, ...prev]);

      // Re-fetch stats or update locally
      fetchHistory();
      sound.playSuccessCelebration();
      return { success: true, entry: savedEntry };
    } catch (err) {
      console.warn('Backend history error, saving entry locally:', err.message);
      const localEntry = {
        _id: 'hist_' + Date.now(),
        topic: sessionData.topic,
        source: sessionData.source || 'manual',
        topicType: sessionData.topicType || 'manual-search',
        category: sessionData.category || 'General',
        rating: sessionData.rating || 5,
        feedback: sessionData.feedback || '',
        durationSeconds: sessionData.durationSeconds || 0,
        completedAt: new Date().toISOString(),
      };
      setHistoryList((prev) => [localEntry, ...prev]);
      sound.playSuccessCelebration();
      return { success: true, entry: localEntry };
    }
  };

  // Update rating or feedback for existing entry
  const updateHistoryEntry = async (id, { rating, feedback }) => {
    try {
      const data = await historyFetch(`/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ rating, feedback }),
      });

      if (data.success && data.entry) {
        setHistoryList((prev) =>
          prev.map((item) => (item._id === id ? { ...item, ...data.entry } : item))
        );
        fetchHistory();
        sound.playSnapChime();
        return { success: true, entry: data.entry };
      }
      throw new Error(data.message || 'Failed to update entry');
    } catch (err) {
      console.warn('Fallback updating local history entry:', err.message);
      setHistoryList((prev) =>
        prev.map((item) => (item._id === id ? { ...item, rating, feedback } : item))
      );
      return { success: true };
    }
  };

  // Delete research history entry
  const deleteHistoryEntry = async (id) => {
    try {
      const data = await historyFetch(`/${id}`, {
        method: 'DELETE',
      });

      if (data.success) {
        setHistoryList((prev) => prev.filter((item) => item._id !== id));
        fetchHistory();
        sound.playPillClick();
        return { success: true };
      }
      throw new Error(data.message || 'Failed to delete entry');
    } catch (err) {
      console.warn('Fallback deleting local history entry:', err.message);
      setHistoryList((prev) => prev.filter((item) => item._id !== id));
      return { success: true };
    }
  };

  // Profile Modal Controls
  const openProfile = (initialTab = 'history') => {
    setProfileInitialTab(initialTab);
    setIsProfileOpen(true);
    sound.playTabSwitch();
    // Refresh history
    fetchHistory();
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
    sound.playModalClose();
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    setAuthError('');
    setIsAskingNickname(false);
    setIsProfileOpen(false);
    setHistoryList([]);
    setHistoryStats({ totalSessions: 0, avgRating: 0, manualCount: 0, randomCount: 0 });
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    sound.playButtonClick();
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isGuest: Boolean(currentUser?.isGuest),
    token,
    dbStatus,
    checkDbHealth,
    isLoading,
    authError,
    setAuthError,
    isAskingNickname,
    setIsAskingNickname,
    login,
    register,
    loginAsGuest,
    saveNickname,
    logout,
    // History & Profile
    historyList,
    historyStats,
    isHistoryLoading,
    fetchHistory,
    addHistoryEntry,
    updateHistoryEntry,
    deleteHistoryEntry,
    isProfileOpen,
    setIsProfileOpen,
    profileInitialTab,
    openProfile,
    closeProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
