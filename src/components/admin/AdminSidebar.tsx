import { Store, Activity, Shield, Server, LogOut, Wallet } from 'lucide-react';
import { Button } from '../ui/button';
import type { AdminView } from './AdminBackOffice';

interface AdminSidebarProps {
  currentView: AdminView;
  onNavigate: (view: AdminView) => void;
  onLogout: () => void;
  onNavigateToEntry?: () => void;
}

export function AdminSidebar({ currentView, onNavigate, onLogout, onNavigateToEntry }: AdminSidebarProps) {
  const menuItems = [
    { id: 'merchants' as AdminView, label: 'Merchants', icon: Store },
    { id: 'monitoring' as AdminView, label: 'Transaction Monitoring', icon: Activity },
    { id: 'compliance' as AdminView, label: 'Compliance Events', icon: Shield },
    { id: 'system' as AdminView, label: 'System Health', icon: Server }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <button
          onClick={onNavigateToEntry}
          className="flex items-center gap-2 w-full hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-white">RailBit</span>
        </button>
        <p className="text-xs text-gray-400 mt-2 ml-10">Admin Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || 
            (currentView === 'merchant-detail' && item.id === 'merchants');
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
