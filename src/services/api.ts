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
  two_factor_enabled?: boolean;
  business_number?: string | null;
  industry?: string | null;
  phone?: string | null;
  address_line1?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  notifications?: NotificationSettings;
}

export interface MerchantProfile extends Merchant {
  business_number?: string | null;
  industry?: string | null;
  phone?: string | null;
  address_line1?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  settlement_mode?: string | null;
  settlement_assets?: string[];
  bank_name?: string | null;
  bank_transit?: string | null;
  bank_institution?: string | null;
  bank_account?: string | null;
  two_factor_enabled?: boolean;
  notifications?: NotificationSettings;
  created_at?: string;
}

export interface NotificationSettings {
  payment_received: boolean;
  payment_failed: boolean;
  weekly_summary: boolean;
  compliance_alerts: boolean;
  marketing_updates: boolean;
}

export interface SettlementPreferences {
  settlement_mode: 'cad' | 'crypto';
  settlement_assets: string[];
  bank_name?: string | null;
  bank_transit?: string | null;
  bank_institution?: string | null;
  bank_account?: string | null;
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

export interface KycDocument {
  id: string;
  name: string;
  document_type: string;
  status: string;
  upload_date: string;
  file_path?: string;
  mime_type?: string;
  file_size?: number;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: string;
  created_at: string;
  last_delivery?: string | null;
}

export interface TeamMember {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export interface Payout {
  id: string;
  payment_id?: string | null;
  amount: number;
  asset: string;
  crypto_amount: number;
  status: string;
  description?: string;
  created_at: string;
}

export interface ComplianceLogs {
  kycStatus: {
    status: string;
    lastReview: string | null;
    nextReview: string | null;
    documents: Array<{ id: string; name: string; status: string; uploadDate: string }>;
  };
  transactionMonitoring: Array<{
    id: string;
    date: string;
    type: string;
    amount: number;
    asset: string;
    description: string;
    status: string;
    action: string;
  }>;
  amlAlerts: Array<{
    id: string;
    date: string;
    severity: string;
    type: string;
    description: string;
    status: string;
    assignedTo: string;
  }>;
  fintracReports: Array<{
    id: string;
    type: string;
    date: string;
    amount: number | null;
    status: string;
    reportId: string;
  }>;
}

export interface AdminMonitoringResponse {
  stats: {
    totalToday: number;
    countToday: number;
    largeTransactions: number;
    suspiciousPatterns: number;
  };
  recentTransactions: Array<{
    id: string;
    merchantName: string;
    amount: number;
    asset: string;
    cadValue: number;
    timestamp: string;
    flag: string | null;
    status: string;
  }>;
  largeTransactions: Array<{
    id: string;
    merchantName: string;
    amount: number;
    asset: string;
    timestamp: string;
    reported: boolean;
  }>;
}

export interface ComplianceEvent {
  id: string;
  type: string;
  date: string;
  merchant: string;
  amount: number | null;
  status: string;
  reportId: string;
}

export interface ComplianceStats {
  totalReports: number;
  thisMonth: number;
  pending: number;
  submitted: number;
}

export interface SystemHealth {
  overall: string;
  services: Array<{
    name: string;
    status: string;
    uptime: string;
    lastCheck: string;
    details: Record<string, string | number>;
  }>;
}

export interface WebhookDelivery {
  id: string;
  url: string;
  event: string;
  status: string;
  response_time: string;
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

  async register(
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
      notifications?: NotificationSettings;
    }
  ) {
    return this.request<{ token: string; merchant: MerchantProfile }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, businessName, ...extra }),
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

  async updateProfile(profile: {
    businessName?: string;
    businessNumber?: string;
    industry?: string;
    phone?: string;
    addressLine1?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  }) {
    return this.request<{ merchant: MerchantProfile }>('/merchants/profile', {
      method: 'PATCH',
      body: JSON.stringify(profile),
    });
  }

  async getSettlement() {
    return this.request<SettlementPreferences>('/merchants/settlement');
  }

  async updateSettlement(data: SettlementPreferences) {
    return this.request<{ success: boolean }>('/merchants/settlement', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getNotifications() {
    return this.request<NotificationSettings>('/notifications');
  }

  async updateNotifications(data: NotificationSettings) {
    return this.request<{ success: boolean }>('/notifications', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updatePassword(currentPassword: string, newPassword: string) {
    return this.request<{ success: boolean }>('/security/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async updateTwoFactor(enabled: boolean) {
    return this.request<{ success: boolean; enabled: boolean }>('/security/2fa', {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    });
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

  async convertAsset(asset: string, cryptoAmount: number) {
    return this.request<Payout>('/assets/convert', {
      method: 'POST',
      body: JSON.stringify({ asset, cryptoAmount }),
    });
  }

  // ==================== PAYOUTS ====================

  async getPayouts() {
    return this.request<Payout[]>('/payouts');
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

  // ==================== WEBHOOKS ====================

  async getWebhooks() {
    return this.request<Webhook[]>('/webhooks');
  }

  async createWebhook(url: string, events: string[]) {
    return this.request<Webhook>('/webhooks', {
      method: 'POST',
      body: JSON.stringify({ url, events }),
    });
  }

  async updateWebhook(id: string, data: Partial<Webhook>) {
    return this.request<Webhook>(`/webhooks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteWebhook(id: string) {
    return this.request<{ success: boolean }>(`/webhooks/${id}`, {
      method: 'DELETE',
    });
  }

  async testWebhook(id: string) {
    return this.request<{ success: boolean }>(`/webhooks/${id}/test`, {
      method: 'POST',
    });
  }

  // ==================== TEAM ====================

  async getTeamMembers() {
    return this.request<TeamMember[]>('/team');
  }

  async inviteTeamMember(name: string | undefined, email: string, role: string) {
    return this.request<TeamMember>('/team', {
      method: 'POST',
      body: JSON.stringify({ name, email, role }),
    });
  }

  async updateTeamMember(id: string, data: { role?: string; status?: string }) {
    return this.request<TeamMember>(`/team/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async removeTeamMember(id: string) {
    return this.request<{ success: boolean }>(`/team/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== KYC ====================

  async getKycDocuments() {
    return this.request<KycDocument[]>('/kyc/documents');
  }

  async uploadKycDocument(payload: { documentType: string; name: string; fileName: string; mimeType: string; data: string }) {
    return this.request<KycDocument>('/kyc/documents', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ==================== COMPLIANCE ====================

  async getComplianceLogs() {
    return this.request<ComplianceLogs>('/compliance/logs');
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
      business_number?: string;
      industry?: string;
      phone?: string;
      address_line1?: string;
      city?: string;
      province?: string;
      postal_code?: string;
      kyc_status: string;
      created_at: string;
      total_volume: number;
      transaction_count: number;
      beneficialOwners?: Array<{ name: string; role: string; ownership: string; verified: boolean }>;
      documents?: Array<{ name: string; type: string; status: string; uploadDate: string }>;
      notes?: Array<{ author: string; text: string; date: string }>;
    }>(`/admin/merchants/${id}`);
  }

  async updateMerchantKycStatus(merchantId: string, kyc_status: 'pending' | 'approved' | 'rejected' | 'in-review') {
    return this.request(`/admin/merchants/${merchantId}/kyc-status`, {
      method: 'PATCH',
      body: JSON.stringify({ kyc_status }),
    });
  }

  async addMerchantNote(merchantId: string, text: string) {
    return this.request<{ author: string; text: string; date: string }>(`/admin/merchants/${merchantId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // ==================== ADMIN MONITORING ====================

  async getAdminMonitoring() {
    return this.request<AdminMonitoringResponse>('/admin/transactions/monitoring');
  }

  async getAdminComplianceEvents() {
    return this.request<ComplianceEvent[]>('/admin/compliance/events');
  }

  async getAdminComplianceStats() {
    return this.request<ComplianceStats>('/admin/compliance/stats');
  }

  async getAdminSystemHealth() {
    return this.request<SystemHealth>('/admin/system-health');
  }

  async getAdminWebhookDeliveries() {
    return this.request<WebhookDelivery[]>('/admin/webhook-deliveries');
  }
}

export const api = new ApiService();
