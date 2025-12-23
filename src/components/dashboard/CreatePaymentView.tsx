import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Bitcoin, Wallet, QrCode, Copy, Share2, CheckCircle2 } from 'lucide-react';

export function CreatePaymentView() {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('btc');
  const [description, setDescription] = useState('');
  const [paymentCreated, setPaymentCreated] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentCreated(true);
  };

  const paymentAddress = asset === 'btc' 
    ? 'lnbc1500n1pn2s39kpp5wytkfzr7shyd8d7d2v5y9vr3z...'
    : asset === 'eth'
    ? '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0'
    : 'SoLa9k3mPqRtXx7Wy6Bz4Nv8Hj5Fg2Kl1Ad3Bc7';

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (paymentCreated) {
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
            <div className="w-64 h-64 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 256 256" className="w-full h-full p-4">
                <rect width="256" height="256" fill="white"/>
                <g fill="black">
                  {Array.from({ length: 8 }).map((_, i) =>
                    Array.from({ length: 8 }).map((_, j) => (
                      <rect
                        key={`${i}-${j}`}
                        x={i * 32}
                        y={j * 32}
                        width="28"
                        height="28"
                        fill={(i + j) % 2 === 0 ? 'black' : 'white'}
                      />
                    ))
                  )}
                </g>
              </svg>
            </div>
            <div className="text-center mt-4">
              <p className="text-2xl text-gray-900 mb-1">{amount} CAD</p>
              <p className="text-sm text-gray-600">{description || 'No description'}</p>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4 mb-6">
            <div>
              <Label>Payment Address</Label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-900 break-all font-mono">{paymentAddress}</p>
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
              <Button variant="outline">
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
                <span className="text-gray-900">PAY-9876</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Asset</span>
                <span className="text-gray-900">{asset.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="text-gray-900">{amount} CAD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires</span>
                <span className="text-gray-900">15:00 remaining</span>
              </div>
            </div>
          </Card>

          <Button
            onClick={() => setPaymentCreated(false)}
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
            disabled={!amount}
          >
            <QrCode className="w-5 h-5 mr-2" />
            Generate Payment Request
          </Button>
        </form>
      </Card>
    </div>
  );
}
