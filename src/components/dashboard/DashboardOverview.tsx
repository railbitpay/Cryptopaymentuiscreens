import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, Wallet, ArrowRight, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import type { DashboardView } from './MerchantDashboard';

interface DashboardOverviewProps {
  onNavigate: (view: DashboardView) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const stats = [
    {
      label: 'Total Volume (CAD)',
      value: '$45,230.50',
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Transactions (30d)',
      value: '234',
      change: '+8.2%',
      trend: 'up' as const,
      icon: Bitcoin,
      color: 'blue'
    },
    {
      label: 'Crypto Balance',
      value: '2.45 BTC',
      change: '$120,450 CAD',
      trend: 'up' as const,
      icon: Wallet,
      color: 'orange'
    },
    {
      label: 'Pending Payouts',
      value: '$8,500',
      change: 'Next: Dec 25',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const recentPayments = [
    {
      id: 'PAY-1234',
      amount: '0.025 BTC',
      cadValue: '$1,450',
      status: 'paid' as const,
      date: '2 hours ago',
      customer: 'bc1q...7x8y'
    },
    {
      id: 'PAY-1233',
      amount: '2.5 ETH',
      cadValue: '$5,200',
      status: 'paid' as const,
      date: '5 hours ago',
      customer: '0x...4f2e'
    },
    {
      id: 'PAY-1232',
      amount: '100 SOL',
      cadValue: '$12,500',
      status: 'pending' as const,
      date: '1 day ago',
      customer: 'Soła...9k3m'
    },
    {
      id: 'PAY-1231',
      amount: '0.05 BTC',
      cadValue: '$2,900',
      status: 'paid' as const,
      date: '1 day ago',
      customer: 'bc1q...2a3b'
    }
  ];

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your account.</p>
      </div>

      {/* KYC Warning */}
      <Alert className="mb-6 border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-900">
          <strong>KYC verification pending.</strong> Some features are limited until your account is approved. 
          <Button variant="link" className="h-auto p-0 ml-1 text-yellow-900 underline" onClick={() => onNavigate('compliance')}>
            View status
          </Button>
        </AlertDescription>
      </Alert>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
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
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-900">{payment.id}</span>
                      <Badge className={
                        payment.status === 'paid'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }>
                        {payment.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{payment.customer} • {payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{payment.amount}</p>
                    <p className="text-xs text-gray-500">{payment.cadValue} CAD</p>
                  </div>
                </div>
              ))}
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
    </div>
  );
}
