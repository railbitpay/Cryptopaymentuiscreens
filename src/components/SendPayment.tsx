import { useState } from 'react';
import { ArrowLeft, Send, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

interface SendPaymentProps {
  balance: number;
  onSend: (recipient: string, amount: number, currency: string) => void;
  onBack: () => void;
}

export function SendPayment({ balance, onSend, onBack }: SendPaymentProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipient && amount && parseFloat(amount) > 0) {
      onSend(recipient, parseFloat(amount), 'XRP');
    }
  };

  const quickAmounts = [10, 50, 100, 500];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-gray-900">Send Payment</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Balance Display */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="text-gray-900 mt-1">
            {balance.toLocaleString()} XRP
          </p>
        </Card>

        {/* Send Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="recipient"
                type="text"
                placeholder="rN7n7otQDd6FczFgLdlqtyMVrn5xB5qJpA"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (XRP)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl h-14"
            />
            {amount && parseFloat(amount) > balance && (
              <p className="text-red-600 text-sm">Insufficient balance</p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Quick amounts</p>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="outline"
                  onClick={() => setAmount(value.toString())}
                  className="h-auto py-2"
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Input
              id="note"
              type="text"
              placeholder="What's this for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Fee Display */}
          <Card className="p-4 bg-gray-50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="text-gray-900">{amount || '0'} XRP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network Fee</span>
                <span className="text-gray-900">0.000012 XRP</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  {amount ? (parseFloat(amount) + 0.000012).toFixed(6) : '0'} XRP
                </span>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700"
            disabled={!recipient || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
          >
            <Send className="w-5 h-5 mr-2" />
            Send Payment
          </Button>
        </form>
      </div>
    </div>
  );
}
