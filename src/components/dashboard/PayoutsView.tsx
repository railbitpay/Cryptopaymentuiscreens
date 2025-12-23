import { ArrowDownToLine, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Payout {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  transferId: string;
  method: 'EFT';
  conversionRate?: number;
  cryptoAmount?: number;
  cryptoAsset?: string;
}

export function PayoutsView() {
  const upcomingPayout = {
    scheduledDate: '2025-11-25',
    estimatedAmount: 5234.56,
    paymentCount: 23
  };

  const payouts: Payout[] = [
    {
      id: '1',
      date: '2025-11-20',
      amount: 4567.89,
      status: 'completed',
      transferId: 'EFT-20251120-001',
      method: 'EFT',
      conversionRate: 62000,
      cryptoAmount: 0.0737,
      cryptoAsset: 'BTC'
    },
    {
      id: '2',
      date: '2025-11-18',
      amount: 3245.12,
      status: 'completed',
      transferId: 'EFT-20251118-001',
      method: 'EFT',
      conversionRate: 3650,
      cryptoAmount: 0.889,
      cryptoAsset: 'ETH'
    },
    {
      id: '3',
      date: '2025-11-15',
      amount: 2134.50,
      status: 'completed',
      transferId: 'EFT-20251115-001',
      method: 'EFT'
    },
    {
      id: '4',
      date: '2025-11-13',
      amount: 5678.90,
      status: 'completed',
      transferId: 'EFT-20251113-001',
      method: 'EFT'
    },
    {
      id: '5',
      date: '2025-11-11',
      amount: 1234.00,
      status: 'failed',
      transferId: 'EFT-20251111-001',
      method: 'EFT'
    }
  ];

  const getStatusIcon = (status: Payout['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: Payout['status']) => {
    const variants = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };
    return (
      <Badge className={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">CAD Payouts</h1>
          <p className="text-gray-600 mt-1">View and manage your settlement payouts</p>
        </div>

        {/* Upcoming Payout */}
        <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100 mb-2">Next Scheduled Payout</p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl">${upcomingPayout.estimatedAmount.toLocaleString('en-CA', { minimumFractionDigits: 2 })}</span>
                <span className="text-blue-100">CAD</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-200" />
                  <span className="text-blue-100">{upcomingPayout.scheduledDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowDownToLine className="w-4 h-4 text-blue-200" />
                  <span className="text-blue-100">{upcomingPayout.paymentCount} payments</span>
                </div>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <ArrowDownToLine className="w-8 h-8 text-white" />
            </div>
          </div>
        </Card>

        {/* Bank Account Info */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-900 mb-1">Settlement Bank Account</h3>
              <p className="text-gray-600 text-sm mb-4">EFT deposits to your Canadian bank account</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-32">Bank</span>
                  <span className="text-sm text-gray-900">Royal Bank of Canada</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-32">Account</span>
                  <span className="text-sm text-gray-900">••••1234</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-32">Transit/Institution</span>
                  <span className="text-sm text-gray-900">00010-003</span>
                </div>
              </div>
            </div>
            <Button variant="outline">Update Account</Button>
          </div>
        </Card>

        {/* Payout History */}
        <div>
          <h2 className="text-gray-900 mb-4">Payout History</h2>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Payouts</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Amount (CAD)</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Transfer ID</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Method</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.map((payout) => (
                        <tr key={payout.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm text-gray-900">{payout.date}</td>
                          <td className="py-4 px-4 text-sm text-gray-900">
                            ${payout.amount.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{payout.transferId}</td>
                          <td className="py-4 px-4">
                            <Badge variant="outline">{payout.method}</Badge>
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(payout.status)}
                          </td>
                          <td className="py-4 px-4">
                            <Button variant="ghost" size="sm">View Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="completed">
              <Card className="p-8 text-center text-gray-600">
                Showing completed payouts only
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card className="p-8 text-center text-gray-600">
                No pending payouts
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Payout Settings */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Payout Schedule</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-900">Automatic Payouts</p>
                <p className="text-xs text-gray-600">Automatically transfer funds to your bank</p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-900">Payout Frequency</p>
                <p className="text-xs text-gray-600">How often you receive settlements</p>
              </div>
              <span className="text-sm text-gray-900">Weekly (Every Monday)</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-gray-900">Minimum Payout</p>
                <p className="text-xs text-gray-600">Threshold before payout is triggered</p>
              </div>
              <span className="text-sm text-gray-900">$100.00 CAD</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
