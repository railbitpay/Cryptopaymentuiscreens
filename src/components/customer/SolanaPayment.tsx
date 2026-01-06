import { useState } from 'react';
import { Wallet, Copy, X, Clock, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Payment } from '../../services/api';

interface PaymentData {
  merchantName: string;
  amount: number;
  currency: string;
  description?: string;
}

interface SolanaPaymentProps {
  paymentData: PaymentData;
  payment: Payment;
  countdown: number;
  onPaymentDetected: () => void;
  onCancel: () => void;
}

export function SolanaPayment({ paymentData, payment, countdown, onPaymentDetected, onCancel }: SolanaPaymentProps) {
  const address = payment.address;
  const solAmount = payment.crypto_amount.toFixed(4);
  const [copied, setCopied] = useState(false);

  // Payment detection is handled by polling in CustomerPayment component

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <Card className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-gray-900">Solana Payment</h2>
                <p className="text-sm text-gray-600">{paymentData.merchantName}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* QR Code */}
            <div>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-4 flex items-center justify-center">
                <QRCodeSVG 
                  value={address}
                  size={256}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Scan with your Solana wallet</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-6">
              {/* Amount */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Send Exactly</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl text-gray-900">{solAmount} SOL</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  ≈ ${paymentData.amount.toFixed(2)} {paymentData.currency}
                </p>
              </div>

              {/* Address */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Deposit Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={address}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono bg-gray-50"
                  />
                  <Button onClick={handleCopy} variant="outline">
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900">
                  ⚠️ Send exactly <strong>{solAmount} SOL</strong> to this address. 
                  Sending a different amount may result in payment failure.
                </p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Network</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Solana Mainnet
                  </Badge>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Confirmations Required</span>
                  <span className="text-sm text-gray-900">1 block</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Est. Confirmation Time</span>
                  <span className="text-sm text-gray-900">~400ms</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Expires in</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(countdown)}
                  </Badge>
                </div>
              </div>

              {/* Waiting State */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="text-sm text-gray-900">Listening for transaction...</p>
                    <p className="text-xs text-gray-600 mt-1">Ultra-fast confirmation expected</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <p className="text-sm text-gray-900">How to pay:</p>
                <ol className="space-y-1 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span className="text-green-600">1.</span>
                    <span>Open your Solana wallet (Phantom, Solflare, etc.)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">2.</span>
                    <span>Send <strong>exactly {solAmount} SOL</strong> to the address above</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">3.</span>
                    <span>Payment confirmed in under a second</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
