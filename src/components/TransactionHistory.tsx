import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { TransactionCard } from './TransactionCard';
import type { Transaction } from '../App';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onBack: () => void;
}

export function TransactionHistory({ transactions, onBack }: TransactionHistoryProps) {
  const completedTransactions = transactions.filter(t => t.status === 'completed');
  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-gray-900">Transactions</h2>
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {pendingTransactions.length > 0 && (
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Pending</h3>
                <div className="space-y-2">
                  {pendingTransactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} detailed />
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Completed</h3>
              <div className="space-y-2">
                {completedTransactions.map((transaction) => (
                  <TransactionCard key={transaction.id} transaction={transaction} detailed />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sent" className="space-y-2">
            {transactions
              .filter(t => t.type === 'sent')
              .map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} detailed />
              ))}
          </TabsContent>

          <TabsContent value="received" className="space-y-2">
            {transactions
              .filter(t => t.type === 'received')
              .map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} detailed />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
