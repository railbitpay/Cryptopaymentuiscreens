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
        // Provide more helpful error messages
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error(`Cannot connect to server. Please make sure the backend is running at ${API_BASE}`);
        }
        throw error;
      }
      throw new Error('Network error - please check your connection and ensure the backend server is running');
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

  // ==================== ASSETS ====================

  async getAssetBalances() {
    return this.request<{ assets: Array<{ asset: string; balance: number; cad_value: number; rate: number }> }>('/assets/balances');
  }

  // ==================== PAYOUTS ====================

  async getPayouts() {
    return this.request<Array<{
      id: string;
      payment_id: string;
      amount: number;
      asset: string;
      created_at: string;
      description?: string;
    }>>('/payouts');
  }

  // ==================== API KEYS ====================

  async getApiKeys() {
    return this.request<Array<{
      id: string;
      merchant_id: string;
      key_type: string;
      key_value: string;
      created_at: string;
    }>>('/api-keys');
  }

  async createApiKey(key_type: 'test' | 'live' = 'test') {
    return this.request<{
      id: string;
      merchant_id: string;
      key_type: string;
      key_value: string;
      created_at: string;
    }>('/api-keys', {
      method: 'POST',
      body: JSON.stringify({ key_type }),
    });
  }

  async deleteApiKey(id: string) {
    return this.request<{ success: boolean }>(`/api-keys/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== ADMIN ====================

  async getMerchants() {
    return this.request<Array<{
      id: string;
      email: string;
      business_name: string;
      kyc_status: string;
      created_at: string;
      total_volume: number;
      transaction_count: number;
    }>>('/admin/merchants');
  }

  async getMerchant(id: string) {
    return this.request<{
      id: string;
      email: string;
      business_name: string;
      kyc_status: string;
      created_at: string;
      total_volume: number;
      transaction_count: number;
    }>(`/admin/merchants/${id}`);
  }

  async updateMerchantKycStatus(merchantId: string, kyc_status: 'pending' | 'approved' | 'rejected' | 'in-review') {
    return this.request(`/admin/merchants/${merchantId}/kyc-status`, {
      method: 'PATCH',
      body: JSON.stringify({ kyc_status }),
    });
  }

  // ==================== COMPLIANCE ====================

  async getComplianceLogs() {
    return this.request<Array<any>>('/compliance/logs');
  }
}

export const api = new ApiService();





