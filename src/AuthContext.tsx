import { createContext, useContext, useState, type ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  role: 'Admin' | 'Agent';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Simulated secure authentication. In a real app, this verifies a JWT/Hash from the backend.
  const login = (email: string, pass: string) => {
    // Admin credentials
    if (email === 'admin@bismillah.com' && pass === 'Bismillah@Admin2026') {
      setUser({ id: 'u1', name: 'System Admin', role: 'Admin' });
      return true;
    }
    // Field Agent credentials
    if (email === 'agent@bismillah.com' && pass === 'Bismillah@Agent2026') {
      setUser({ id: 'u2', name: 'Field Agent', role: 'Agent' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
