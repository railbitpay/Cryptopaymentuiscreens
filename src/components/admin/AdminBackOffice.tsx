import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { MerchantDirectory } from './MerchantDirectory';
import { MerchantDetail } from './MerchantDetail';
import { TransactionMonitoring } from './TransactionMonitoring';
import { ComplianceEvents } from './ComplianceEvents';
import { SystemHealth } from './SystemHealth';
import type { AppView } from '../../App';

interface AdminBackOfficeProps {
  onNavigate: (view: AppView) => void;
}

export type AdminView = 
  | 'merchants'
  | 'merchant-detail'
  | 'monitoring'
  | 'compliance'
  | 'system';

export function AdminBackOffice({ onNavigate }: AdminBackOfficeProps) {
  const [currentView, setCurrentView] = useState<AdminView>('merchants');
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);

  const handleMerchantSelect = (merchantId: string) => {
    setSelectedMerchant(merchantId);
    setCurrentView('merchant-detail');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={() => onNavigate('logout')}
        onNavigateToEntry={() => onNavigate('entry')}
      />
      
      <main className="flex-1 overflow-y-auto">
        {currentView === 'merchants' && <MerchantDirectory onSelectMerchant={handleMerchantSelect} />}
        {currentView === 'merchant-detail' && selectedMerchant && (
          <MerchantDetail 
            merchantId={selectedMerchant}
            onBack={() => setCurrentView('merchants')}
          />
        )}
        {currentView === 'monitoring' && <TransactionMonitoring />}
        {currentView === 'compliance' && <ComplianceEvents />}
        {currentView === 'system' && <SystemHealth />}
      </main>
    </div>
  );
}
