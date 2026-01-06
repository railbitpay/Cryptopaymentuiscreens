import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Search, Filter, Download, ExternalLink, Loader2 } from 'lucide-react';
import { api, Payment } from '../../services/api';

export function PaymentsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await api.getPayments();
        setPayments(data);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    return matchesSearch && payment.asset === selectedTab;
  });

  const mockPayments = [
    {
      id: 'PAY-5678',
      asset: 'BTC Lightning',
      amount: '0.025',
      cadValue: '$1,450.00',
      status: 'paid',
      customer: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      date: '2025-11-21 14:30',
      txHash: '3a4b5c...'
    },
    {
      id: 'PAY-5677',
      asset: 'ETH',
      amount: '2.5',
      cadValue: '$5,200.00',
      status: 'paid',
      customer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      date: '2025-11-21 09:15',
      txHash: '9f8e7d...'
    },
    {
      id: 'PAY-5676',
      asset: 'SOL',
      amount: '100',
      cadValue: '$12,500.00',
      status: 'pending',
      customer: 'SoLa9k3mPqRtXx7Wy6Bz4Nv8Hj5Fg2Kl1',
      date: '2025-11-20 18:45',
      txHash: 'pending'
    },
    {
      id: 'PAY-5675',
      asset: 'BTC Lightning',
      amount: '0.05',
      cadValue: '$2,900.00',
      status: 'paid',
      customer: 'bc1q34aq5drpuwy3wgl9lhup9892qnqp82lar34r',
      date: '2025-11-20 16:20',
      txHash: '2c3d4e...'
    },
    {
      id: 'PAY-5674',
      asset: 'ETH',
      amount: '1.2',
      cadValue: '$2,496.00',
      status: 'failed',
      customer: '0x8ba1f109551bd432803012645c136a87a8db1bc8',
      date: '2025-11-20 11:30',
      txHash: 'failed'
    },
    {
      id: 'PAY-5673',
      asset: 'SOL',
      amount: '50',
      cadValue: '$6,250.00',
      status: 'paid',
      customer: 'SoLb2k4nPqRtXx7Wy6Bz4Nv8Hj5Fg2Kl2',
      date: '2025-11-19 22:10',
      txHash: '1a2b3c...'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">PAID</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">PENDING</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">FAILED</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status.toUpperCase()}</Badge>;
    }
  };

  const getAssetColor = (asset: string) => {
    if (asset === 'btc' || asset.includes('BTC')) return 'text-orange-600 bg-orange-50';
    if (asset === 'eth' || asset.includes('ETH')) return 'text-purple-600 bg-purple-50';
    if (asset === 'sol' || asset.includes('SOL')) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAssetName = (asset: string) => {
    const names: Record<string, string> = {
      btc: 'BTC Lightning',
      eth: 'ETH',
      sol: 'SOL'
    };
    return names[asset] || asset.toUpperCase();
  };

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Payments</h1>
        <p className="text-gray-600">View and manage all crypto payment transactions</p>
      </div>

      <Card className="p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by payment ID, customer address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="btc">BTC Lightning</TabsTrigger>
            <TabsTrigger value="eth">Ethereum</TabsTrigger>
            <TabsTrigger value="sol">Solana</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No payments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Payment ID</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Asset</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">CAD Value</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900 font-mono">{payment.id.substring(0, 12)}...</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-sm px-2 py-1 rounded ${getAssetColor(payment.asset)}`}>
                          {formatAssetName(payment.asset)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">
                          {payment.crypto_amount.toFixed(8)} {payment.asset.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">${payment.amount_cad.toFixed(2)} CAD</span>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">{formatDate(payment.created_at)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(`/payment/${payment.id}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Tabs>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredPayments.length} of {payments.length} payments
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
