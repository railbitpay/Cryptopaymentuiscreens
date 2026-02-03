import { useState, useEffect } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardOverview } from './DashboardOverview';
import { PaymentsView } from './PaymentsView';
import { CreatePaymentView } from './CreatePaymentView';
import { POSModeView } from './POSModeView';
import { AssetsView } from './AssetsView';
import { PayoutsView } from './PayoutsView';
import { ComplianceLogsView } from './ComplianceLogsView';
import { SettingsView } from './SettingsView';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Mail, Lock, Loader2, AlertCircle, Menu } from 'lucide-react';
import type { AppView } from '../../App';
import { useMobileNavBodyLock } from '../hooks/useMobileNavBodyLock';
import { LoginForm } from '../core/Form/LoginForm';
import { Form } from '../core/Form/Form';
import { FormInput } from '../core/Form/Input';
import { DashboardLayout } from '../Layouts/DashboardLayout';
import { BaseLayoutHeader } from '../Layouts/BaseLayoutHeader';


interface MerchantDashboardProps {
  onNavigate: (view: AppView) => void;
}

export type DashboardView = 
  | 'overview'
  | 'payments'
  | 'create-payment'
  | 'pos-mode'
  | 'assets'
  | 'payouts'
  | 'compliance'
  | 'settings';

export function MerchantDashboard({ onNavigate }: MerchantDashboardProps) {
  const { isAuthenticated, loading, login, user } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure we show login form if not authenticated
  useEffect(() => {
    // Clear any stale form state when authentication state changes
    if (!loading && !isAuthenticated) {
      setEmail('');
      setPassword('');
      setError(null);
    }
  }, [isAuthenticated, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoginLoading(true);

    try {
      await login(email, password);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  // Show login form if not authenticated
  if (!loading && !isAuthenticated) {
    return (
      <LoginForm
        error={error}
        title={'Login Required'}
        onSignupClick={() => onNavigate('onboarding')}
        onHomeClick={() => onNavigate('marketing')}>
          <Form onSubmit={handleLogin} loading={loginLoading}>
            <FormInput
              id='email'
              type='email'
              placeholder='you@business.com'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <FormInput
              id='password'
              type='password'
              placeholder='********'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form>
      </LoginForm>
    );
  }

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

  // Debug logging
  useEffect(() => {
    console.log('MerchantDashboard render:', { isAuthenticated, loading, user: user?.email });
  }, [isAuthenticated, loading, user]);

  // Lock body scroll when mobile nav is open
  useMobileNavBodyLock(mobileNavOpen)

  if (!isAuthenticated && !loading) {
    // This shouldn't happen, but provide fallback
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
            <p className="text-gray-600">Please log in to access your merchant dashboard</p>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Reload Page
          </Button>
        </Card>
      </div>
    );
  }

  const viewLabels: Record<DashboardView, string> = {
    overview: 'Overview',
    payments: 'Payments',
    'create-payment': 'Create Payment',
    'pos-mode': 'POS Mode',
    assets: 'Assets & Wallets',
    payouts: 'Payouts',
    compliance: 'Compliance',
    settings: 'Settings'
  };

  return (
    <DashboardLayout
      onMobileNavOpen={setMobileNavOpen}
      mobileNavOpen={mobileNavOpen}
      currentView={currentView}
      viewLabels={viewLabels}
      header={
        <BaseLayoutHeader
            appName='Railbit'
            startSlot={(
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700"
                aria-label="Open menu"
                onClick={() => setMobileNavOpen(true)}
                >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            content={viewLabels[currentView] || currentView}
            endSlot={(
              <Button variant="ghost" size="sm" onClick={() => onNavigate('logout')}>
                 Logout
              </Button>
            )}
        />
      }
      sidebar={
        <DashboardSidebar 
          currentView={currentView}
          onNavigate={setCurrentView}
          onLogout={() => onNavigate('logout')}
          onNavigateToEntry={() => setCurrentView('overview')}
        />
      }
      >
      {currentView === 'overview' && <DashboardOverview onNavigate={setCurrentView} />}
       {currentView === 'payments' && <PaymentsView />}
       {currentView === 'create-payment' && <CreatePaymentView />}
       {currentView === 'pos-mode' && <POSModeView />}
       {currentView === 'assets' && <AssetsView />}
       {currentView === 'payouts' && <PayoutsView />}
       {currentView === 'compliance' && <ComplianceLogsView />}
       {currentView === 'settings' && <SettingsView />}
    </DashboardLayout>
  );
}
