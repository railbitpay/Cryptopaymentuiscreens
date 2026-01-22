import { useState, useEffect, lazy, Suspense } from 'react';
const NavigationHub = lazy(() => import('./components/NavigationHub').then(m => ({ default: m.NavigationHub })));
const MarketingSite = lazy(() => import('./components/marketing/MarketingSite').then(m => ({ default: m.MarketingSite })));
const MerchantOnboarding = lazy(() => import('./components/onboarding/MerchantOnboarding').then(m => ({ default: m.MerchantOnboarding })));
const MerchantDashboard = lazy(() => import('./components/dashboard/MerchantDashboard').then(m => ({ default: m.MerchantDashboard })));
const CustomerPayment = lazy(() => import('./components/customer/CustomerPayment').then(m => ({ default: m.CustomerPayment })));
const AdminBackOffice = lazy(() => import('./components/admin/AdminBackOffice').then(m => ({ default: m.AdminBackOffice })));
const APIDocs = lazy(() => import('./components/docs/APIDocs').then(m => ({ default: m.APIDocs })));
const LogoutPage = lazy(() => import('./components/LogoutPage').then(m => ({ default: m.LogoutPage })));
import { useAuth } from './contexts/AuthContext';

export type AppView = 
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
  const [currentView, setCurrentView] = useState<AppView>('marketing');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Check URL for payment ID (for customer payment links)
  useEffect(() => {
    if (hasInitialized) return; // Only run once on mount
    
    const path = window.location.pathname;
    const paymentMatch = path.match(/\/payment\/([^/]+)/);
    if (paymentMatch) {
      setPaymentId(paymentMatch[1]);
      setCurrentView('customer-payment');
      setHasInitialized(true);
      return;
    }
    
    // Don't auto-redirect authenticated users - let them navigate manually
    // This allows them to see the marketing page even if logged in
    setHasInitialized(true);
  }, [hasInitialized]);

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
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
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
      </Suspense>
    </div>
  );
}
