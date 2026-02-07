import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/task';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('taskflow_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('taskflow_user');
      }
    }
    setIsLoading(false);
  }, []);

  const persistUser = (authResponse: AuthResponse) => {
    setUser(authResponse);
    localStorage.setItem('taskflow_user', JSON.stringify(authResponse));
    localStorage.setItem('taskflow_token', authResponse.token);
  };

  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data);
    persistUser(response);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authApi.register(data);
    persistUser(response);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_user');
    localStorage.removeItem('taskflow_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
