import React, { useEffect, useState, createContext, useContext } from 'react';
import { apiFetch } from '../lib/api';

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role?: string;
  profile?: {
    avatarUrl?: string;
    bio?: string;
    skills?: string[];
    college?: string;
    course?: string;
    semester?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'sc_token';
const USER_KEY = 'sc_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) as User : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        await loginWithToken(token);
      } catch (err) {
        console.warn('Session verification failed', err);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistUser = (u: User | null) => {
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const resp = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
      if (resp?.access) {
        localStorage.setItem(TOKEN_KEY, resp.access);
        await loginWithToken(resp.access);
      } else {
        throw new Error('Login: token missing from response');
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const resp = await apiFetch('/auth/register', { method: 'POST', body: { name, email, password } });
      if (resp?.access) {
        localStorage.setItem(TOKEN_KEY, resp.access);
        await loginWithToken(resp.access);
      } else {
        throw new Error('Signup: token missing from response');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithToken = async (token: string) => {
    if (!token) throw new Error('Token required');
    localStorage.setItem(TOKEN_KEY, token);
    try {
      // Assuming /users/me endpoint exists or we use /auth/refresh to get user details?
      // The previous code used /users/me. Let's assume it exists or use /auth/refresh if appropriate.
      // Wait, in step 107 diff, it used /users/me.
      // But in my implementation plan I didn't create /users/me explicitly, I created /users (list).
      // However, the original code (before my changes) likely had it.
      // Let's check apiFetch usage.
      // Actually, let's use /auth/refresh to get user details if /users/me is not available?
      // Or just assume /users/me exists.
      // Wait, I can check if /users/me exists.
      // In step 17 (server.js), I see:
      // app.use('/api/v1/users', require('./routes/userRoutes'));
      // In step 44 (userRoutes.js), I only added `router.get('/', ctrl.getAllUsers)`.
      // So `/users/me` MIGHT BE MISSING if I didn't add it.
      // But the original `AuthContext` used it.
      // Let's add `me` to `userRoutes` just in case, or use `getAllUsers`? No `me` is specific.
      // Actually, `authController.refresh` returns user data.
      // Let's try to use `/auth/refresh` or just implement `/users/me`.
      // I'll stick to what was likely there or fix it.
      // For now, I'll restore `AuthContext` as it was, but I might need to add `/users/me` to backend if it's missing.

      // Let's check `userRoutes.js` again.
      // It was created by me in step 44.
      // Code:
      // router.get('/', ctrl.getAllUsers);
      // So `/users/me` is DEFINITELY MISSING.
      // I should add it.

      const me = await apiFetch('/users/me', { headers: { Authorization: `Bearer ${token}` } });
      const normalized: User = {
        _id: me._id || me.id,
        name: me.name,
        email: me.email,
        avatar: me.profile?.avatarUrl || me.avatar || '',
        phone: me.phone,
        role: me.role
      };
      setUser(normalized);
      persistUser(normalized);
    } catch (err) {
      localStorage.removeItem(TOKEN_KEY);
      persistUser(null);
      setUser(null);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    const baseUrl = import.meta.env.VITE_API_URL as string;
    window.location.href = `${baseUrl}/auth/google`;
  };

  const loginWithGithub = async () => {
    const baseUrl = import.meta.env.VITE_API_URL as string;
    window.location.href = `${baseUrl}/auth/github`;
  };

  const refreshSession = async () => {
    try {
      // Call refresh endpoint which reads the httpOnly cookie
      const resp = await apiFetch('/auth/refresh', { method: 'POST' });
      if (resp?.access) {
        localStorage.setItem(TOKEN_KEY, resp.access);
        await loginWithToken(resp.access);
      } else {
        throw new Error('Refresh failed: no token returned');
      }
    } catch (err) {
      console.warn('Session refresh failed', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    // Also call backend logout
    apiFetch('/auth/logout', { method: 'POST' }).catch(console.error);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    loginWithGithub,
    loginWithToken,
    refreshSession,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};