import { Home, CreditCard, Plus, Monitor, Wallet, DollarSign, Shield, Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import type { DashboardView } from './MerchantDashboard';

interface DashboardSidebarProps {
  currentView: DashboardView;
  onNavigate: (view: DashboardView) => void;
  onLogout: () => void;
  onNavigateToEntry?: () => void;
}

export function DashboardSidebar({ currentView, onNavigate, onLogout, onNavigateToEntry }: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout(); // Clear authentication state
    onLogout(); // Navigate to logout page
  };
  
  // Get initials from business name or email
  const getInitials = () => {
    if (user?.business_name) {
      return user.business_name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'MB';
  };
  
  const displayName = user?.business_name || 'My Business';
  const displayEmail = user?.email || 'merchant@business.com';
  const kycStatus = user?.kyc_status || 'pending';
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
        <button
          onClick={onNavigateToEntry}
          className="flex items-center gap-2 w-full hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-white">RailBit</span>
        </button>
      </div>

      {/* KYC Status Banner */}
      {kycStatus === 'pending' && (
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
      )}
      {kycStatus === 'approved' && (
        <div className="px-4 py-3 bg-green-900/50 border-b border-green-800">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
              KYC VERIFIED
            </Badge>
          </div>
        </div>
      )}
      {kycStatus === 'rejected' && (
        <div className="px-4 py-3 bg-red-900/50 border-b border-red-800">
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
              KYC REJECTED
            </Badge>
          </div>
        </div>
      )}

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
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">{getInitials()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
