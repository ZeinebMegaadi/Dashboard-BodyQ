import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ACCESS_TOKEN: '@bodyq/access_token',
  USER: '@bodyq/user',
  PROFILE_COMPLETE: '@bodyq/profile_complete',
} as const;

export type User = {
  id: string;
  email: string;
  displayName: string | null;
  profileComplete?: boolean;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  profileComplete: boolean;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  setProfileComplete: () => Promise<void>;
};

const defaultState: AuthState = {
  isAuthenticated: false,
  user: null,
  profileComplete: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState);

  const loadStoredAuth = useCallback(async () => {
    try {
      const [token, userJson, profileComplete] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE_COMPLETE),
      ]);
      const user = userJson ? (JSON.parse(userJson) as User) : null;
      setState({
        isAuthenticated: !!token,
        user,
        profileComplete: profileComplete === 'true',
        isLoading: false,
      });
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const login = useCallback(async (email: string, password: string) => {
    // TODO: replace with real API call to POST /auth/login; backend returns user.profileComplete
    const mockUser: User = {
      id: '1',
      email,
      displayName: email.split('@')[0],
      profileComplete: false,
    };
    const mockToken = 'mock-jwt-' + Date.now();
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, mockToken],
      [STORAGE_KEYS.USER, JSON.stringify(mockUser)],
    ]);
    const storedComplete = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE_COMPLETE);
    const profileComplete = storedComplete === 'true';
    setState({
      isAuthenticated: true,
      user: { ...mockUser, profileComplete },
      profileComplete,
      isLoading: false,
    });
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      // TODO: replace with real API call to POST /auth/register
      const mockUser: User = {
        id: '1',
        email,
        displayName: displayName || email.split('@')[0],
        profileComplete: false,
      };
      const mockToken = 'mock-jwt-' + Date.now();
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, mockToken],
        [STORAGE_KEYS.USER, JSON.stringify(mockUser)],
        [STORAGE_KEYS.PROFILE_COMPLETE, 'false'],
      ]);
      setState({
        isAuthenticated: true,
        user: mockUser,
        profileComplete: false,
        isLoading: false,
      });
    },
    []
  );

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.USER,
      STORAGE_KEYS.PROFILE_COMPLETE,
    ]);
    setState({
      isAuthenticated: false,
      user: null,
      profileComplete: false,
      isLoading: false,
    });
  }, []);

  const setProfileComplete = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETE, 'true');
    setState((s) =>
      s.user
        ? { ...s, profileComplete: true, user: { ...s.user, profileComplete: true } }
        : s
    );
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    setProfileComplete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
