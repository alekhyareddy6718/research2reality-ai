'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  organization?: string;
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('r2r_token');
      localStorage.removeItem('r2r_user');
    }
  };

  const refreshUser = async () => {
    const currentToken = typeof window !== 'undefined' ? localStorage.getItem('r2r_token') : null;
    if (!currentToken) {
      clearAuth();
      setLoading(false);
      return;
    }

    try {
      const res = await api.getProfile();
      if (res.success && res.data) {
        setUser(res.data as User);
        localStorage.setItem('r2r_user', JSON.stringify(res.data));
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuth();
      setLoading(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('r2r_unauthorized', handleUnauthorized);
    }

    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('r2r_token') : null;
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('r2r_user') : null;

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // parse failed
        }
      }
      refreshUser();
    } else {
      clearAuth();
      setLoading(false);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('r2r_unauthorized', handleUnauthorized);
      }
    };
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('r2r_token', newToken);
      localStorage.setItem('r2r_user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

