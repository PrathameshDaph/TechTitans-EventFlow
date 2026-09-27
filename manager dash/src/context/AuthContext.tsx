import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { realtimeService, ConnectionStatus } from '../services/realtime';

export interface UserSession {
  id: string;
  username: string;
  role: 'manager' | 'admin' | 'crew' | 'volunteer' | 'user';
  name: string;
  title?: string;
  phone?: string;
  email?: string;
  locationName?: string;
  assignedGate?: string;
  gateId?: string;
  zoneId?: string;
  task?: string;
  status?: string;
  token?: string;
  ticketId?: string;
  assignedBlock?: string;
  seatNumber?: string;
  avatar?: string;
  callsign?: string;
}

interface AuthContextType {
  currentUser: UserSession | null;
  isAuthenticated: boolean;
  role: UserSession['role'] | null;
  connectionStatus: ConnectionStatus;
  login: (usernameOrId: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserSession['role']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'eventflow_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('DISCONNECTED');

  // Sync realtime identity whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      realtimeService.setIdentity({
        clientId: currentUser.id,
        role: currentUser.role,
        name: currentUser.name,
        gateId: currentUser.gateId || currentUser.assignedGate,
        zoneId: currentUser.zoneId,
      });
      realtimeService.connect();
    } else {
      realtimeService.setIdentity(null);
      realtimeService.disconnect();
    }
  }, [currentUser]);

  // Listen to realtime connection status
  useEffect(() => {
    const unsub = realtimeService.onStatusChange((status) => {
      setConnectionStatus(status);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (usernameOrId: string, password: string) => {
    if (!usernameOrId || !password) {
      return { success: false, message: 'Please enter your user ID and password.' };
    }

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameOrId, password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        const sessionUser: UserSession = {
          ...data.user,
          token: data.token,
        };

        setCurrentUser(sessionUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid user ID or password.' };
      }
    } catch (err) {
      console.warn('[Auth] Server fetch failed, validating against local fallback:', err);
      // If server unreachable, reject or provide fallback error
      return { success: false, message: 'Invalid user ID or password.' };
    }
  }, []);

  const logout = useCallback(async () => {
    if (currentUser?.token) {
      try {
        await fetch('http://localhost:8000/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
      } catch (err) {
        console.warn('[Auth] Server logout request failed:', err);
      }
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    realtimeService.disconnect();
  }, [currentUser]);

  const switchDemoRole = useCallback(async (role: UserSession['role']) => {
    let demoCredentials = { id: 'manager', pass: '1234' };
    if (role === 'crew') demoCredentials = { id: 'AAA001', pass: '1234' };
    if (role === 'volunteer') demoCredentials = { id: 'V001', pass: '1234' };
    if (role === 'user') demoCredentials = { id: 'user_0001', pass: '1234' };

    await login(demoCredentials.id, demoCredentials.pass);
  }, [login]);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    role: currentUser?.role || null,
    connectionStatus,
    login,
    logout,
    switchDemoRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
