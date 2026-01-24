import { useState, useEffect } from 'react';
import { ArrowDownToLine, Calendar, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { api } from '../../services/api';

interface Payout {
  id: string;
  payment_id: string;
  amount: number;
  asset: string;
  crypto_amount: number;
  status: string;
  created_at: string;
  description?: string;
}

export function PayoutsView() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setLoading(true);
        const data = await api.getPayouts();
        setPayouts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch payouts');
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  const nextPayoutDate = (() => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilMonday = (8 - day) % 7 || 7;
    date.setDate(date.getDate() + daysUntilMonday);
    return date.toISOString().split('T')[0];
  })();

  const upcomingPayout = {
    scheduledDate: nextPayoutDate,
    estimatedAmount: payouts.reduce((sum, p) => sum + p.amount, 0),
    paymentCount: payouts.length
  };

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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">CAD Payouts</h1>
          <p className="text-gray-600 mt-1">View and manage your settlement payouts</p>
        </div>

        {/* Upcoming Payout */}
        <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
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
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
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
            <TabsList className="flex flex-wrap gap-2">
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
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-red-600">
                            {error}
                          </td>
                        </tr>
                      ) : payouts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-gray-600">
                            No payouts yet
                          </td>
                        </tr>
                      ) : (
                        payouts.map((payout) => (
                          <tr key={payout.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 text-sm text-gray-900">
                              {new Date(payout.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-900">
                              ${payout.amount.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600 font-mono">
                              {payout.payment_id.substring(0, 12)}...
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="outline">{payout.asset.toUpperCase()}</Badge>
                            </td>
                            <td className="py-4 px-4">
                              {getStatusBadge(payout.status)}
                            </td>
                            <td className="py-4 px-4">
                              <Button variant="ghost" size="sm">View Details</Button>
                            </td>
                          </tr>
                        ))
                      )}
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
