import { useState } from 'react';
import { NavigationHub } from './components/NavigationHub';
import { EntryPage } from './components/EntryPage';
import { MarketingSite } from './components/marketing/MarketingSite';
import { MerchantOnboarding } from './components/onboarding/MerchantOnboarding';
import { MerchantDashboard } from './components/dashboard/MerchantDashboard';
import { CustomerPayment } from './components/customer/CustomerPayment';
import { AdminBackOffice } from './components/admin/AdminBackOffice';
import { APIDocs } from './components/docs/APIDocs';
import { LogoutPage } from './components/LogoutPage';

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
  const [currentView, setCurrentView] = useState<AppView>('entry');
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handleCreatePayment = (id: string) => {
    setPaymentId(id);
    setCurrentView('customer-payment');
  };

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