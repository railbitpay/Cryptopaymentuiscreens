import { useState, useEffect } from 'react';
import { NavigationHub } from './components/NavigationHub';
import { EntryPage } from './components/EntryPage';
import { MarketingSite } from './components/marketing/MarketingSite';
import { MerchantOnboarding } from './components/onboarding/MerchantOnboarding';
import { MerchantDashboard } from './components/dashboard/MerchantDashboard';
import { CustomerPayment } from './components/customer/CustomerPayment';
import { AdminBackOffice } from './components/admin/AdminBackOffice';
import { APIDocs } from './components/docs/APIDocs';
import { LogoutPage } from './components/LogoutPage';
import { useAuth } from './contexts/AuthContext';

export type AppView = 
  | 'entry'
  | 'hub'
  | 'marketing' 
  | 'onboarding' 
  | 'dashboard' 
  | 'customer-payment'
  | 'admin'
  | 'api-docs'
  | 'logout';

export type Screen = 'dashboard' | 'send' | 'receive' | 'transactions';

export interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  currency: string;
  date: Date;
  status: 'pending' | 'completed';
  sender?: string;
  recipient?: string;
}

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('entry');
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Check URL for payment ID (for customer payment links)
  useEffect(() => {
    const path = window.location.pathname;
    const paymentMatch = path.match(/\/payment\/([^/]+)/);
    if (paymentMatch) {
      setPaymentId(paymentMatch[1]);
      setCurrentView('customer-payment');
    }
  }, []);

  // Redirect authenticated users from entry page to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated && currentView === 'entry') {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, loading, currentView]);

  const handleCreatePayment = (id: string) => {
    setPaymentId(id);
    setCurrentView('customer-payment');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {currentView === 'entry' && (
        <EntryPage onNavigate={setCurrentView} />
      )}
      {currentView === 'hub' && (
        <NavigationHub onNavigate={setCurrentView} />
      )}
      {currentView === 'marketing' && (
        <MarketingSite onNavigate={setCurrentView} />
      )}
      {currentView === 'onboarding' && (
        <MerchantOnboarding onComplete={() => setCurrentView('dashboard')} onNavigate={setCurrentView} />
      )}
      {currentView === 'dashboard' && (
        <MerchantDashboard onNavigate={setCurrentView} />
      )}
      {currentView === 'customer-payment' && (
        <CustomerPayment paymentId={paymentId} onNavigate={setCurrentView} />
      )}
      {currentView === 'admin' && (
        <AdminBackOffice onNavigate={setCurrentView} />
      )}
      {currentView === 'api-docs' && (
        <APIDocs onNavigate={setCurrentView} />
      )}
      {currentView === 'logout' && (
        <LogoutPage onNavigate={setCurrentView} />
      )}
    </div>
  );
}