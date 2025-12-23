import { CheckCircle2, Download } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface PaymentData {
  merchantName: string;
  amount: number;
  currency: string;
  description?: string;
}

interface PaymentSuccessProps {
  paymentData: PaymentData;
  asset: 'BTC' | 'ETH' | 'SOL';
}

export function PaymentSuccess({ paymentData, asset }: PaymentSuccessProps) {
  const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const assetNames = {
    BTC: 'Bitcoin Lightning',
    ETH: 'Ethereum',
    SOL: 'Solana'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-12">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Your payment has been confirmed on the blockchain
          </p>

          {/* Payment Details */}
          <Card className="p-6 mb-8 text-left bg-white">
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Merchant</span>
                <span className="text-sm text-gray-900">{paymentData.merchantName}</span>
              </div>
              {paymentData.description && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Description</span>
                  <span className="text-sm text-gray-900">{paymentData.description}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm text-gray-900">
                  ${paymentData.amount.toFixed(2)} {paymentData.currency}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Paid with</span>
                <Badge className={
                  asset === 'BTC' 
                    ? 'bg-orange-100 text-orange-800 border-orange-200'
                    : asset === 'ETH'
                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                    : 'bg-green-100 text-green-800 border-green-200'
                }>
                  {assetNames[asset]}
                </Badge>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Transaction ID</span>
                <span className="text-xs text-gray-900 font-mono">{transactionId}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full h-12 bg-green-600 hover:bg-green-700">
              Return to {paymentData.merchantName}
            </Button>
            <Button variant="outline" className="w-full h-12">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Powered by RailBit
            </p>
            <p className="text-xs text-gray-500 mt-1">
              FINTRAC registered MSB • Secure & Compliant
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
