import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, Wallet, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { api, Payment, DashboardStats } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { DashboardView } from './MerchantDashboard';

interface DashboardOverviewProps {
  onNavigate: (view: DashboardView) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if authenticated
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [statsData, paymentsData] = await Promise.all([
          api.getDashboardStats(),
          api.getPayments()
        ]);
        setStats(statsData);
        setRecentPayments(paymentsData.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // If auth fails, clear user
        if (error instanceof Error) {
          if (error.message.includes('401') || error.message.includes('403')) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('merchant_data');
            window.location.reload(); // Force reload to show login
          } else if (error.message.includes('304')) {
            // 304 error - try again without cache
            console.warn('Received 304, retrying...');
            setTimeout(() => fetchData(), 100);
            return;
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const formatAssetAmount = (payment: Payment) => {
    return `${payment.crypto_amount.toFixed(8)} ${payment.asset.toUpperCase()}`;
  };

  const displayStats = stats ? [
    {
      label: 'Total Volume (CAD)',
      value: `$${stats.total_volume.toFixed(2)}`,
      change: stats.total_volume > 0 ? `${((stats.paid_volume / stats.total_volume) * 100).toFixed(1)}% paid` : '0% paid',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Transactions (30d)',
      value: stats.transaction_count.toString(),
      change: `${stats.paid_count} completed`,
      trend: 'up' as const,
      icon: Bitcoin,
      color: 'blue'
    },
    {
      label: 'Crypto Balance',
      value: stats.balances.length > 0 
        ? `${stats.balances[0].balance.toFixed(4)} ${stats.balances[0].asset.toUpperCase()}`
        : '0.0000',
      change: `$${stats.paid_volume.toFixed(2)} CAD`,
      trend: 'up' as const,
      icon: Wallet,
      color: 'orange'
    },
    {
      label: 'Pending Payments',
      value: stats.pending_count.toString(),
      change: `${stats.paid_count} completed`,
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'purple'
    }
  ] : [];

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your account.</p>
      </div>

      {/* KYC Warning - only show if user exists and KYC is pending */}
      {user && user.kyc_status === 'pending' && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-900">
            <strong>KYC verification pending.</strong> Some features are limited until your account is approved. 
            <Button variant="link" className="h-auto p-0 ml-1 text-yellow-900 underline" onClick={() => onNavigate('compliance')}>
              View status
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {displayStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'orange' ? 'bg-orange-100' :
                  'bg-purple-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'orange' ? 'text-orange-600' :
                    'text-purple-600'
                  }`} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl text-gray-900 mb-2">{stat.value}</p>
              <div className="flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Payments */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">Recent Payments</h2>
              <Button variant="ghost" onClick={() => onNavigate('payments')}>
                View all
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="space-y-3">
              {recentPayments.length === 0 ? (
                <p className="text-sm text-gray-600 text-center py-8">No payments yet</p>
              ) : (
                recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-900 font-mono">{payment.id.substring(0, 12)}...</span>
                        <Badge className={
                          payment.status === 'paid'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }>
                          {payment.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{payment.address.substring(0, 20)}... • {formatTimeAgo(payment.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{formatAssetAmount(payment)}</p>
                      <p className="text-xs text-gray-500">${payment.amount_cad.toFixed(2)} CAD</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => onNavigate('create-payment')}
              >
                Create Payment
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => onNavigate('pos-mode')}
              >
                Open POS Mode
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => onNavigate('assets')}
              >
                View Wallets
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
            <h3 className="text-white mb-2">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-4">
              Check our documentation or contact support
            </p>
            <Button variant="outline" className="w-full bg-white text-blue-600 hover:bg-gray-100 border-0">
              View Docs
            </Button>
          </Card>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
