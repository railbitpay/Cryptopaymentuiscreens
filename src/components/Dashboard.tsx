import { ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { TransactionCard } from './TransactionCard';
import type { Transaction, Screen } from '../App';

interface DashboardProps {
  balance: {
    xrp: number;
    usd: number;
  };
  transactions: Transaction[];
  onNavigate: (screen: Screen) => void;
}

export function Dashboard({ balance, transactions, onNavigate }: DashboardProps) {
  return (
    <div className="p-4 space-y-6">
      {/* Balance Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0">
        <div className="space-y-4">
          <div>
            <p className="text-blue-100 text-sm">Total Balance</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl">{balance.xrp.toLocaleString()}</span>
              <span className="text-blue-100">XRP</span>
            </div>
            <p className="text-blue-100 text-sm mt-1">
              ≈ ${balance.usd.toLocaleString()} USD
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-green-300 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% this month</span>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => onNavigate('send')}
          className="h-auto py-6 flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <ArrowUpRight className="w-6 h-6" />
          <span>Send</span>
        </Button>
        <Button 
          onClick={() => onNavigate('receive')}
          variant="outline"
          className="h-auto py-6 flex flex-col items-center gap-2"
        >
          <ArrowDownLeft className="w-6 h-6" />
          <span>Receive</span>
        </Button>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Recent Activity</h2>
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('transactions')}
            className="text-blue-600 hover:text-blue-700"
          >
            See all
          </Button>
        </div>
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>

      {/* Crypto Info Card */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">XRP Price</p>
            <p className="text-gray-900 mt-1">$0.60</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">24h Change</p>
            <p className="text-green-600 mt-1">+3.2%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
