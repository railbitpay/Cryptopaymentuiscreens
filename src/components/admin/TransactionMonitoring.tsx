import { Activity, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function TransactionMonitoring() {
  const stats = {
    totalToday: 1234567.89,
    countToday: 456,
    largeTransactions: 12,
    suspiciousPatterns: 3
  };

  const recentTransactions = [
    {
      id: '1',
      merchantName: 'Tech Solutions Inc',
      amount: 15000,
      asset: 'BTC',
      cadValue: 15000,
      timestamp: '2025-11-21 14:32:15',
      flag: 'large-transaction',
      status: 'completed'
    },
    {
      id: '2',
      merchantName: 'My Coffee Shop',
      amount: 0.5,
      asset: 'ETH',
      cadValue: 1850,
      timestamp: '2025-11-21 14:28:42',
      flag: null,
      status: 'completed'
    },
    {
      id: '3',
      merchantName: 'Maple Consulting',
      amount: 25,
      asset: 'SOL',
      cadValue: 1125,
      timestamp: '2025-11-21 14:15:33',
      flag: 'velocity',
      status: 'completed'
    },
    {
      id: '4',
      merchantName: 'Downtown Boutique',
      amount: 0.2,
      asset: 'BTC',
      cadValue: 12400,
      timestamp: '2025-11-21 14:05:12',
      flag: 'large-transaction',
      status: 'completed'
    }
  ];

  const largeTransactions = [
    {
      id: '1',
      merchantName: 'Tech Solutions Inc',
      amount: 15000,
      asset: 'BTC',
      timestamp: '2025-11-21 14:32:15',
      reported: true
    },
    {
      id: '2',
      merchantName: 'Downtown Boutique',
      amount: 12400,
      asset: 'BTC',
      timestamp: '2025-11-21 14:05:12',
      reported: true
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">Transaction Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring and compliance tracking</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Volume Today</p>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl text-gray-900">
              ${stats.totalToday.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stats.countToday} transactions</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Large Transactions</p>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl text-orange-600">{stats.largeTransactions}</p>
            <p className="text-xs text-gray-500 mt-1">Over $10,000 CAD</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Suspicious Patterns</p>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl text-red-600">{stats.suspiciousPatterns}</p>
            <p className="text-xs text-gray-500 mt-1">Require review</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Activity Rate</p>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl text-green-600">Normal</p>
            <p className="text-xs text-gray-500 mt-1">Within expected range</p>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="large">Large Transactions</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>

          {/* All Transactions */}
          <TabsContent value="all" className="mt-6">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Time</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Merchant</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Asset</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">CAD Value</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Flags</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm text-gray-600">{tx.timestamp}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{tx.merchantName}</td>
                        <td className="py-4 px-4">
                          <Badge className={
                            tx.asset === 'BTC'
                              ? 'bg-orange-100 text-orange-800 border-orange-200'
                              : tx.asset === 'ETH'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : 'bg-green-100 text-green-800 border-green-200'
                          }>
                            {tx.asset}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          {tx.amount} {tx.asset}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          ${tx.cadValue.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-4">
                          {tx.flag ? (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              {tx.flag}
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-500">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {tx.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Large Transactions */}
          <TabsContent value="large" className="mt-6">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Time</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Merchant</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Asset</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">CAD Value</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">FINTRAC Report</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {largeTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm text-gray-600">{tx.timestamp}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{tx.merchantName}</td>
                        <td className="py-4 px-4">
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            {tx.asset}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          ${tx.amount.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-4">
                          {tx.reported ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Reported
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              Pending
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Button variant="ghost" size="sm">View Report</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Flagged */}
          <TabsContent value="flagged" className="mt-6">
            <Card className="p-8 text-center text-gray-600">
              Flagged transactions requiring review
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
