import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, Merchant } from '../services/api';

interface AuthContextType {
  user: Merchant | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    businessName: string,
    extra?: {
      businessNumber?: string;
      industry?: string;
      phone?: string;
      addressLine1?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      twoFactorEnabled?: boolean;
      settlementMode?: 'cad' | 'crypto';
      settlementAssets?: string[];
      bankName?: string;
      bankTransit?: string;
      bankInstitution?: string;
      bankAccount?: string;
      notifications?: {
        payment_received: boolean;
        payment_failed: boolean;
        weekly_summary: boolean;
        compliance_alerts: boolean;
        marketing_updates: boolean;
      };
    }
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Always verify token with backend
      api.getMe()
        .then(({ merchant }) => {
          setUser(merchant);
          // Update localStorage with fresh data
          localStorage.setItem('merchant_data', JSON.stringify(merchant));
        })
        .catch(() => {
          // Token invalid, clear everything
          localStorage.removeItem('auth_token');
          localStorage.removeItem('merchant_data');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // No token - clear any stale data
      localStorage.removeItem('merchant_data');
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token, merchant } = await api.login(email, password);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('merchant_data', JSON.stringify(merchant));
    setUser(merchant);
  };

  const register = async (
    email: string,
    password: string,
    businessName: string,
    extra?: {
      businessNumber?: string;
      industry?: string;
      phone?: string;
      addressLine1?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      twoFactorEnabled?: boolean;
      settlementMode?: 'cad' | 'crypto';
      settlementAssets?: string[];
      bankName?: string;
      bankTransit?: string;
      bankInstitution?: string;
      bankAccount?: string;
      notifications?: {
        payment_received: boolean;
        payment_failed: boolean;
        weekly_summary: boolean;
        compliance_alerts: boolean;
        marketing_updates: boolean;
      };
    }
  ) => {
    const { token, merchant } = await api.register(email, password, businessName, extra);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('merchant_data', JSON.stringify(merchant));
    setUser(merchant);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('merchant_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
