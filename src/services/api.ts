const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

export interface Payment {
  id: string;
  merchant_id: string;
  amount_cad: number;
  asset: string;
  crypto_amount: number;
  address: string;
  status: 'pending' | 'paid' | 'expired';
  description?: string;
  expires_at: string;
  created_at: string;
  payment_url?: string;
}

export interface Merchant {
  id: string;
  email: string;
  business_name: string;
  kyc_status: string;
}

export interface DashboardStats {
  total_volume: number;
  transaction_count: number;
  paid_volume: number;
  paid_count: number;
  pending_count: number;
  balances: Array<{
    asset: string;
    balance: number;
  }>;
}

export interface Transaction {
  id: string;
  payment_id: string;
  merchant_id: string;
  type: string;
  amount: number;
  asset: string;
  status: string;
  created_at: string;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  // ==================== AUTH ====================

  async register(email: string, password: string, businessName: string) {
    return this.request<{ token: string; merchant: Merchant }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, businessName }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; merchant: Merchant }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.request<{ merchant: Merchant }>('/auth/me');
  }

  // ==================== PAYMENTS ====================

  async createPayment(
    amount_cad: number,
    asset: 'btc' | 'eth' | 'sol',
    description?: string
  ): Promise<Payment> {
    return this.request<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify({ amount_cad, asset, description }),
    });
  }

  async getPayments(): Promise<Payment[]> {
    return this.request<Payment[]>('/payments');
  }

  async getPayment(id: string): Promise<Payment> {
    return this.request<Payment>(`/payments/${id}`);
  }

  async verifyPayment(id: string): Promise<{ success: boolean; payment: Payment }> {
    return this.request<{ success: boolean; payment: Payment }>(`/payments/${id}/verify`, {
      method: 'POST',
    });
  }

  // ==================== DASHBOARD ====================

  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/dashboard/stats');
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/transactions');
  }
}

export const api = new ApiService();

