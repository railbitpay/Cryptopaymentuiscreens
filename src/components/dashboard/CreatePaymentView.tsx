import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Bitcoin, Wallet, QrCode, Copy, Share2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api, Payment } from '../../services/api';
import { Alert, AlertDescription } from '../ui/alert';

export function CreatePaymentView() {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState<'btc' | 'eth' | 'sol'>('btc');
  const [description, setDescription] = useState('');
  const [paymentCreated, setPaymentCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const newPayment = await api.createPayment(amountNum, asset, description || undefined);
      setPayment(newPayment);
      setPaymentCreated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (payment?.address) {
      navigator.clipboard.writeText(payment.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (payment?.payment_url) {
      navigator.clipboard.writeText(payment.payment_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = Math.max(0, expires.getTime() - now.getTime());
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (paymentCreated && payment) {
    const timeRemaining = formatTimeRemaining(payment.expires_at);
    
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-gray-900 mb-2">Payment Request Created</h2>
            <p className="text-gray-600">Share this QR code or address with your customer</p>
          </div>

          {/* QR Code */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-6">
            <div className="w-64 h-64 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center p-4">
              <QRCodeSVG 
                value={payment.payment_url || `http://localhost:5173/payment/${payment.id}`}
                size={256}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-2xl text-gray-900 mb-1">${payment.amount_cad.toFixed(2)} CAD</p>
              <p className="text-sm text-gray-600">{payment.description || 'No description'}</p>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4 mb-6">
            <div>
              <Label>Payment Address</Label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-900 break-all font-mono">{payment.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleCopy} variant="outline">
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Address
                  </>
                )}
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </Button>
            </div>
          </div>

          {/* Payment Details */}
          <Card className="p-4 bg-gray-50 border-gray-200 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID</span>
                <span className="text-gray-900 font-mono text-xs">{payment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Asset</span>
                <span className="text-gray-900">{payment.asset.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="text-gray-900">${payment.amount_cad.toFixed(2)} CAD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Crypto Amount</span>
                <span className="text-gray-900">{payment.crypto_amount.toFixed(8)} {payment.asset.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires</span>
                <span className="text-gray-900">{timeRemaining} remaining</span>
              </div>
            </div>
          </Card>

          <Button
            onClick={() => {
              setPaymentCreated(false);
              setPayment(null);
              setAmount('');
              setDescription('');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Create Another Payment
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Create Payment</h1>
        <p className="text-gray-600">Generate a new crypto payment request</p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-900">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-8">
        <form onSubmit={handleCreatePayment} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (CAD)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl h-14"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset">Cryptocurrency</Label>
            <Select value={asset} onValueChange={setAsset} required>
              <SelectTrigger id="asset">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="btc">
                  <div className="flex items-center gap-2">
                    <Bitcoin className="w-4 h-4 text-orange-600" />
                    <span>Bitcoin Lightning</span>
                  </div>
                </SelectItem>
                <SelectItem value="eth">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-purple-600" />
                    <span>Ethereum</span>
                  </div>
                </SelectItem>
                <SelectItem value="sol">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-600" />
                    <span>Solana</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              type="text"
              placeholder="e.g., Coffee purchase"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {amount && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Amount (CAD)</span>
                  <span className="text-gray-900">${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Processing Fee</span>
                  <span className="text-gray-900">
                    {asset === 'btc' ? '0.5%' : asset === 'eth' ? '1.0%' : '0.8%'}
                  </span>
                </div>
                <div className="border-t border-blue-300 pt-2 flex justify-between">
                  <span className="text-gray-900">You'll Receive (CAD)</span>
                  <span className="text-gray-900">
                    ${(parseFloat(amount) * (asset === 'btc' ? 0.995 : asset === 'eth' ? 0.99 : 0.992)).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700"
            disabled={!amount || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <QrCode className="w-5 h-5 mr-2" />
                Generate Payment Request
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
