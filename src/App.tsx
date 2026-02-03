import { useState, useEffect, lazy, Suspense, Component, type ReactNode } from 'react';

const lazyWithRetry = <T,>(importer: () => Promise<{ default: T }>) =>
  lazy(async () => {
    try {
      return await importer();
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('Loading chunk') || message.includes('Failed to fetch dynamically imported module')) {
        window.location.reload();
      }
      throw error;
    }
  });

const NavigationHub = lazyWithRetry(() => import('./components/NavigationHub').then(m => ({ default: m.NavigationHub })));
const MarketingSite = lazyWithRetry(() => import('./components/marketing/MarketingSite').then(m => ({ default: m.MarketingSite })));
const MerchantOnboarding = lazyWithRetry(() => import('./components/onboarding/MerchantOnboarding').then(m => ({ default: m.MerchantOnboarding })));
const MerchantDashboard = lazyWithRetry(() => import('./components/dashboard/MerchantDashboard').then(m => ({ default: m.MerchantDashboard })));
const CustomerPayment = lazyWithRetry(() => import('./components/customer/CustomerPayment').then(m => ({ default: m.CustomerPayment })));
const AdminBackOffice = lazyWithRetry(() => import('./components/admin/AdminBackOffice').then(m => ({ default: m.AdminBackOffice })));
const APIDocs = lazyWithRetry(() => import('./components/docs/APIDocs').then(m => ({ default: m.APIDocs })));
const LogoutPage = lazyWithRetry(() => import('./components/LogoutPage').then(m => ({ default: m.LogoutPage })));

class ChunkErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-900 mb-2">Something went wrong loading this page.</p>
            <button
              className="text-blue-600 underline"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
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

  const resolveRoute = (path: string): { view: AppView; paymentId?: string | null } => {
    const paymentMatch = path.match(/^\/payment\/([^/]+)/);
    if (paymentMatch) {
      return { view: 'customer-payment', paymentId: paymentMatch[1] };
    }
    switch (path) {
      case '/':
      case '/marketing':
        return { view: 'marketing' };
      case '/hub':
        return { view: 'hub' };
      case '/onboarding':
        return { view: 'onboarding' };
      case '/dashboard':
        return { view: 'dashboard' };
      case '/admin':
        return { view: 'admin' };
      case '/api-docs':
        return { view: 'api-docs' };
      case '/logout':
        return { view: 'logout' };
      default:
        return { view: 'marketing' };
    }
  };

  const viewPathMap: Record<Exclude<AppView, 'customer-payment'>, string> = {
    hub: '/hub',
    marketing: '/',
    onboarding: '/onboarding',
    dashboard: '/dashboard',
    admin: '/admin',
    'api-docs': '/api-docs',
    logout: '/logout'
  };

  // Check URL for payment ID (for customer payment links)
  useEffect(() => {
    if (hasInitialized) return; // Only run once on mount
    
    const { view, paymentId: routePaymentId } = resolveRoute(window.location.pathname);
    if (routePaymentId) {
      setPaymentId(routePaymentId);
    }
    setCurrentView(view);
    
    // Don't auto-redirect authenticated users - let them navigate manually
    // This allows them to see the marketing page even if logged in
    setHasInitialized(true);
  }, [hasInitialized]);

  useEffect(() => {
    const handlePopState = () => {
      const { view, paymentId: routePaymentId } = resolveRoute(window.location.pathname);
      setPaymentId(routePaymentId ?? null);
      setCurrentView(view);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (view: AppView) => {
    if (view === 'customer-payment') {
      if (paymentId) {
        const path = `/payment/${paymentId}`;
        if (window.location.pathname !== path) {
          window.history.pushState(null, '', path);
        }
      }
      setCurrentView(view);
      return;
    }

    const path = viewPathMap[view];
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setCurrentView(view);
  };

  const handleCreatePayment = (id: string) => {
    setPaymentId(id);
    const path = `/payment/${id}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
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
      <ChunkErrorBoundary>
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
            <NavigationHub onNavigate={navigate} />
          )}
          {currentView === 'marketing' && (
            <MarketingSite onNavigate={navigate} />
          )}
          {currentView === 'onboarding' && (
            <MerchantOnboarding onComplete={() => navigate('dashboard')} onNavigate={navigate} />
          )}
          {currentView === 'dashboard' && (
            <MerchantDashboard onNavigate={navigate} />
          )}
          {currentView === 'customer-payment' && (
            <CustomerPayment paymentId={paymentId} onNavigate={navigate} />
          )}
          {currentView === 'admin' && (
            <AdminBackOffice onNavigate={navigate} />
          )}
          {currentView === 'api-docs' && (
            <APIDocs onNavigate={navigate} />
          )}
          {currentView === 'logout' && (
            <LogoutPage onNavigate={navigate} />
          )}
        </Suspense>
      </ChunkErrorBoundary>
    </div>
  );
}
