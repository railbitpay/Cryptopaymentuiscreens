import { useEffect, useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { MerchantDirectory } from './MerchantDirectory';
import { MerchantDetail } from './MerchantDetail';
import { TransactionMonitoring } from './TransactionMonitoring';
import { ComplianceEvents } from './ComplianceEvents';
import { SystemHealth } from './SystemHealth';
import type { AppView } from '../../App';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleMerchantSelect = (merchantId: string) => {
    setSelectedMerchant(merchantId);
    setCurrentView('merchant-detail');
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow || '';
    }
    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, [mobileNavOpen]);

  const viewLabels: Record<AdminView, string> = {
    merchants: 'Merchants',
    'merchant-detail': 'Merchant Detail',
    monitoring: 'Transaction Monitoring',
    compliance: 'Compliance Events',
    system: 'System Health'
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700"
              aria-label="Open menu"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-sm text-gray-500">RailBit Admin</p>
              <p className="text-lg font-semibold text-gray-900">{viewLabels[currentView]}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('logout')}>
            Logout
          </Button>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 z-50 bg-black/50"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute left-0 top-0 z-[60] h-full w-80 max-w-[85vw] bg-gray-900 text-white shadow-xl">
                <AdminSidebar
                  currentView={currentView}
                  onNavigate={setCurrentView}
                  onLogout={() => onNavigate('logout')}
                  onNavigateToEntry={() => setCurrentView('merchants')}
                  onItemSelect={() => setMobileNavOpen(false)}
                />
          </div>
        </div>
      )}

      <div className="hidden md:block">
        <AdminSidebar 
          currentView={currentView}
          onNavigate={setCurrentView}
          onLogout={() => onNavigate('logout')}
          onNavigateToEntry={() => setCurrentView('merchants')}
        />
      </div>
      
      <main
        className={`flex-1 w-full overflow-visible md:overflow-y-auto ${mobileNavOpen ? 'pointer-events-none' : ''}`}
        aria-hidden={mobileNavOpen}
      >
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
