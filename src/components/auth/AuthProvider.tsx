import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setApiAuthToken } from '@/services/bridgeApi';

interface AuthContextType {
  authToken: string | null;
  setAuthToken: (token: string) => void;
  clearAuthToken: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthTokenState] = useState<string | null>(() => {
    return localStorage.getItem('auth_token') || null;
  });

  // Sync token with API on mount and when token changes
  useEffect(() => {
    setApiAuthToken(authToken);
  }, [authToken]);

  const setAuthToken = (token: string) => {
    localStorage.setItem('auth_token', token);
    setAuthTokenState(token);
  };

  const clearAuthToken = () => {
    localStorage.removeItem('auth_token');
    setAuthTokenState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken,
        clearAuthToken,
        isAuthenticated: !!authToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
