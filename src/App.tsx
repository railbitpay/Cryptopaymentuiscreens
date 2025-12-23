import { useState } from 'react';
import { NavigationHub } from './components/NavigationHub';
import { MarketingSite } from './components/marketing/MarketingSite';
import { MerchantOnboarding } from './components/onboarding/MerchantOnboarding';
import { MerchantDashboard } from './components/dashboard/MerchantDashboard';
import { CustomerPayment } from './components/customer/CustomerPayment';
import { AdminBackOffice } from './components/admin/AdminBackOffice';
import { APIDocs } from './components/docs/APIDocs';
import { DesignSystem } from './components/design-system/DesignSystem';

export type AppView = 
  | 'hub'
  | 'marketing' 
  | 'onboarding' 
  | 'dashboard' 
  | 'customer-payment'
  | 'admin'
  | 'api-docs'
  | 'design-system';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('hub');
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handleCreatePayment = (id: string) => {
    setPaymentId(id);
    setCurrentView('customer-payment');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'hub' && (
        <NavigationHub onNavigate={setCurrentView} />
      )}
      {currentView === 'marketing' && (
        <MarketingSite onNavigate={setCurrentView} />
      )}
      {currentView === 'onboarding' && (
        <MerchantOnboarding onComplete={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'dashboard' && (
        <MerchantDashboard onNavigate={setCurrentView} />
      )}
      {currentView === 'customer-payment' && (
        <CustomerPayment paymentId={paymentId} />
      )}
      {currentView === 'admin' && (
        <AdminBackOffice onNavigate={setCurrentView} />
      )}
      {currentView === 'api-docs' && (
        <APIDocs onNavigate={setCurrentView} />
      )}
      {currentView === 'design-system' && (
        <DesignSystem />
      )}
    </div>
  );
}