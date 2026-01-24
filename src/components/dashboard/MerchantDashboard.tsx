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
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h1>
            <p className="text-gray-600">Please log in to access your merchant dashboard</p>
          </div>

          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loginLoading}>
              {loginLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => onNavigate('onboarding')}
              >
                Sign Up
              </Button>
            </p>
            <Button 
              variant="ghost" 
              className="mt-4"
              onClick={() => onNavigate('marketing')}
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80 max-w-[85vw] bg-gray-900 text-white border-gray-800">
                <DashboardSidebar
                  currentView={currentView}
                  onNavigate={setCurrentView}
                  onLogout={() => onNavigate('logout')}
                  onNavigateToEntry={() => onNavigate('marketing')}
                  onItemSelect={() => setMobileNavOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-sm text-gray-500">RailBit</p>
              <p className="text-lg font-semibold text-gray-900">{viewLabels[currentView]}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('logout')}>
            Logout
          </Button>
        </div>
      </div>

      <div className="hidden md:block">
        <DashboardSidebar 
          currentView={currentView}
          onNavigate={setCurrentView}
          onLogout={() => onNavigate('logout')}
          onNavigateToEntry={() => onNavigate('marketing')}
        />
      </div>
      
      <main className="flex-1 w-full overflow-visible md:overflow-y-auto">
        {currentView === 'overview' && <DashboardOverview onNavigate={setCurrentView} />}
        {currentView === 'payments' && <PaymentsView />}
        {currentView === 'create-payment' && <CreatePaymentView />}
        {currentView === 'pos-mode' && <POSModeView />}
        {currentView === 'assets' && <AssetsView />}
        {currentView === 'payouts' && <PayoutsView />}
        {currentView === 'compliance' && <ComplianceLogsView />}
        {currentView === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}
