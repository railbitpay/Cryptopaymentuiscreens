import { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardOverview } from './DashboardOverview';
import { PaymentsView } from './PaymentsView';
import { CreatePaymentView } from './CreatePaymentView';
import { POSModeView } from './POSModeView';
import { AssetsView } from './AssetsView';
import { PayoutsView } from './PayoutsView';
import { ComplianceLogsView } from './ComplianceLogsView';
import { SettingsView } from './SettingsView';
import type { AppView } from '../../App';

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
  const [currentView, setCurrentView] = useState<DashboardView>('overview');

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar 
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={() => onNavigate('marketing')}
      />
      
      <main className="flex-1 overflow-y-auto">
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
