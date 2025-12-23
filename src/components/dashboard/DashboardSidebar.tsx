import { Home, CreditCard, Plus, Monitor, Wallet, DollarSign, Shield, Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { DashboardView } from './MerchantDashboard';

interface DashboardSidebarProps {
  currentView: DashboardView;
  onNavigate: (view: DashboardView) => void;
  onLogout: () => void;
}

export function DashboardSidebar({ currentView, onNavigate, onLogout }: DashboardSidebarProps) {
  const navItems = [
    { id: 'overview' as DashboardView, label: 'Overview', icon: Home },
    { id: 'payments' as DashboardView, label: 'Payments', icon: CreditCard },
    { id: 'create-payment' as DashboardView, label: 'Create Payment', icon: Plus },
    { id: 'pos-mode' as DashboardView, label: 'POS Mode', icon: Monitor },
    { id: 'assets' as DashboardView, label: 'Assets & Wallets', icon: Wallet },
    { id: 'payouts' as DashboardView, label: 'Payouts', icon: DollarSign },
    { id: 'compliance' as DashboardView, label: 'Compliance', icon: Shield },
    { id: 'settings' as DashboardView, label: 'Settings', icon: Settings }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-white">Canadian Crypto Pay</span>
        </div>
      </div>

      {/* KYC Status Banner */}
      <div className="px-4 py-3 bg-yellow-900/50 border-b border-yellow-800">
        <div className="flex items-center gap-2">
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
            KYC PENDING
          </Badge>
        </div>
        <p className="text-xs text-yellow-200 mt-1">
          Verification in progress
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-sm">MB</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-white">My Business</p>
            <p className="text-xs text-gray-400">merchant@business.com</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
