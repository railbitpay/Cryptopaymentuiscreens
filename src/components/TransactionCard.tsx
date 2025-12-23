import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import type { Transaction } from '../App';

interface TransactionCardProps {
  transaction: Transaction;
  detailed?: boolean;
}

export function TransactionCard({ transaction, detailed = false }: TransactionCardProps) {
  const isSent = transaction.type === 'sent';
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes === 0 ? 'Just now' : `${minutes}m ago`;
      }
      return `${hours}h ago`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSent ? 'bg-orange-100' : 'bg-green-100'
          }`}>
            {isSent ? (
              <ArrowUpRight className={`w-5 h-5 text-orange-600`} />
            ) : (
              <ArrowDownLeft className={`w-5 h-5 text-green-600`} />
            )}
          </div>
          <div>
            <p className="text-gray-900">
              {isSent ? 'Sent' : 'Received'}
            </p>
            <p className="text-sm text-gray-500">
              {isSent 
                ? truncateAddress(transaction.recipient || '') 
                : truncateAddress(transaction.sender || '')
              }
            </p>
            {detailed && (
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(transaction.date)}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className={`${isSent ? 'text-orange-600' : 'text-green-600'}`}>
            {isSent ? '-' : '+'}{transaction.amount} {transaction.currency}
          </p>
          {!detailed && (
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(transaction.date)}
            </p>
          )}
          {detailed && transaction.status === 'pending' && (
            <Badge variant="secondary" className="mt-1 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Pending
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
