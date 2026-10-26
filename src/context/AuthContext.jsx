// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sound } from '../utils/audio';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'learnwithfun_auth_user';
const STORAGE_KEY_TOKEN = 'learnwithfun_auth_token';

// API base path - uses Vite dev server proxy or direct localhost:5000
const API_BASE = '/api/auth';
const DIRECT_API_BASE = 'http://localhost:5000/api/auth';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER) || localStorage.getItem('speechpact_auth_user');
      return saved ? JSON.parse(saved) : null;
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

  // Helper fetch with fallback
  const apiFetch = useCallback(async (endpoint, options = {}) => {
    try {
      // First attempt relative proxy URL
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      });
      return await res.json();
    } catch {
      // If relative fails (e.g. proxy mismatch), attempt direct backend
      try {
        const directRes = await fetch(`${DIRECT_API_BASE}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
          },
        });
        return await directRes.json();
      } catch {
        throw new Error('Unable to communicate with Node.js / MongoDB backend. Is the server running?');
      }
    }
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
      const data = await apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, nickname }),
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
      setAuthError(err.message);
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
      const data = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
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
      setAuthError(err.message);
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

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    setAuthError('');
    setIsAskingNickname(false);
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
