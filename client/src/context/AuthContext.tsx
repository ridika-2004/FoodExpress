import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AppUser, UserRole } from '../data/mockData';
import * as authApi from '../api/authApi';
import { ApiError } from '../api/authApi';

const TOKEN_KEY = 'foodexpress_auth_token';

export interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  user: AppUser | null;
  isLoggedIn: boolean;
  role: UserRole | null;
  isCheckingSession: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, phone: string, password: string, secretCode: string) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (updates: Partial<AppUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Derive the role from the registration secret code (mirrors the backend). */
function roleFromSecretCode(code: string): UserRole | null {
  const c = (code ?? '').trim().toLowerCase();
  if (c === 'restaurant') return 'restaurant';
  if (c === 'delivery') return 'deliveryman';
  if (c === '') return 'user';
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsCheckingSession(false);
      return;
    }
    authApi
      .me(token)
      .then(apiUser => setUser(apiUser))
      .catch(() => {
        // Token invalid or backend offline — start logged out
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setIsCheckingSession(false));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const data = await authApi.login({ email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return { success: true };
    } catch (e) {
      // Real API error (bad credentials, validation, …)
      if (e instanceof ApiError) {
        return { success: false, error: e.message };
      }
      // Network error → backend unreachable. No mock fallback — auth is backend-only.
      return {
        success: false,
        error: "Can't reach the authentication service. Please try again in a moment.",
      };
    }
  }, []);

  const register = useCallback(async (
    name: string, email: string, phone: string, password: string, secretCode: string,
  ): Promise<AuthResult> => {
    const role = roleFromSecretCode(secretCode);
    if (!role) {
      return { success: false, error: 'Invalid secret code. Use "restaurant" or "delivery".' };
    }

    try {
      const data = await authApi.register({
        name, email, phone, password,
        secretCode: secretCode.trim() || undefined,
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return { success: true };
    } catch (e) {
      if (e instanceof ApiError) {
        return { success: false, error: e.message };
      }
      // Network error → backend unreachable. No mock fallback — auth is backend-only.
      return {
        success: false,
        error: "Can't reach the authentication service. Please try again in a moment.",
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<AppUser>) => {
    setUser(prev => (prev ? { ...prev, ...updates } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: user !== null,
      role: user?.role ?? null,
      isCheckingSession,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
