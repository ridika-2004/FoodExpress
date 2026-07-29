import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AppUser, UserRole } from '../data/mockData';
import { users } from '../data/mockData';
import { env } from '../constants/env';

interface AuthContextValue {
  user: AppUser | null;
  isLoggedIn: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<AppUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start logged in as the admin user for demo purposes
  const [user, setUser] = useState<AppUser | null>(users[1]);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Simulated login — find user by email
    const found = users.find(u => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (
    name: string, email: string, phone: string, _password: string, role: UserRole
  ): Promise<boolean> => {
    // Simulated registration — create a new user object
    const newUser: AppUser = {
      id: `u${Date.now()}`,
      name,
      email,
      phone,
      avatar: `${env.AVATAR_API_URL}/?name=${encodeURIComponent(name)}&background=ef4444&color=fff&size=200`,
      role,
      isAvailable: role === 'deliveryman' ? true : undefined,
    };
    setUser(newUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<AppUser>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: user !== null,
      role: user?.role ?? null,
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
