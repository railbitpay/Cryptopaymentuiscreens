import { useState } from 'react';
import { ArrowLeft, Bitcoin, Wallet, Zap, CheckCircle2, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

type CryptoAsset = 'BTC' | 'ETH' | 'SOL';
type PaymentStatus = 'idle' | 'pending' | 'success' | 'failed';

export function POSModeView() {
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [countdown, setCountdown] = useState(900); // 15 minutes

  const assets = [
    { id: 'BTC' as CryptoAsset, name: 'Bitcoin Lightning', icon: Zap, color: 'orange', rate: 0.000015 },
    { id: 'ETH' as CryptoAsset, name: 'Ethereum', icon: Wallet, color: 'purple', rate: 0.00035 },
    { id: 'SOL' as CryptoAsset, name: 'Solana', icon: Wallet, color: 'green', rate: 0.045 }
  ];

  const handleNumberClick = (num: string) => {
    if (num === 'C') {
      setAmount('');
    } else if (num === '.') {
      if (!amount.includes('.')) {
        setAmount(amount + num);
      }
    } else {
      setAmount(amount + num);
    }
  };

  const handleAssetSelect = (asset: CryptoAsset) => {
    if (amount && parseFloat(amount) > 0) {
      setSelectedAsset(asset);
      setPaymentStatus('pending');
      // Simulate payment detection
      setTimeout(() => {
        setPaymentStatus('success');
      }, 5000);
    }
  };

  const handleReset = () => {
    setAmount('');
    setSelectedAsset(null);
    setPaymentStatus('idle');
    setCountdown(900);
  };

  const getCryptoAmount = (asset: CryptoAsset) => {
    const selected = assets.find(a => a.id === asset);
    if (!selected || !amount) return '0';
    return (parseFloat(amount) * selected.rate).toFixed(8);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-8">
        <Card className="max-w-lg w-full p-12 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-gray-900 mb-2">Payment Received!</h1>
          <p className="text-gray-600 mb-8">Transaction confirmed on the blockchain</p>
          <div className="space-y-3 mb-8">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Amount (CAD)</span>
              <span className="text-gray-900">${amount}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Paid with</span>
              <span className="text-gray-900">{selectedAsset}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Crypto Amount</span>
              <span className="text-gray-900">{getCryptoAmount(selectedAsset!)} {selectedAsset}</span>
            </div>
          </div>
          <Button onClick={handleReset} className="w-full h-14 bg-green-600 hover:bg-green-700">
            New Transaction
          </Button>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'pending' && selectedAsset) {
    const asset = assets.find(a => a.id === selectedAsset)!;
    const Icon = asset.icon;

    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center p-8">
        <Card className="max-w-2xl w-full p-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-gray-900 mb-1">Waiting for Payment</h2>
              <p className="text-gray-600">Customer should scan QR code</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleReset}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* QR Code */}
            <div className="flex flex-col items-center">
              <div className="w-full aspect-square bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-4">
                {/* QR Code Placeholder */}
                <svg viewBox="0 0 256 256" className="w-full h-full p-8">
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
              <Badge className={`bg-${asset.color}-100 text-${asset.color}-800 border-${asset.color}-200`}>
                <Icon className="w-4 h-4 mr-2" />
                {asset.name}
              </Badge>
            </div>

            {/* Payment Details */}
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Amount Due (CAD)</p>
                <p className="text-3xl text-gray-900">${amount}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Crypto Amount</span>
                  <span className="text-sm text-gray-900">{getCryptoAmount(selectedAsset)} {selectedAsset}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Network</span>
                  <span className="text-sm text-gray-900">
                    {selectedAsset === 'BTC' ? 'Lightning Network' : selectedAsset === 'ETH' ? 'Ethereum Mainnet' : 'Solana Mainnet'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Expires in</span>
                  <span className="text-sm text-gray-900">
                    {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>

              <p className="text-center text-sm text-gray-600">
                Waiting for transaction confirmation...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8">
        {/* Left: Amount Entry */}
        <Card className="p-8">
          <h2 className="text-gray-900 mb-6">Enter Amount (CAD)</h2>
          
          <div className="mb-8">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-4">
              <div className="text-right">
                <span className="text-sm text-gray-600">CAD $</span>
                <div className="text-5xl text-gray-900 mt-2 min-h-[60px]">
                  {amount || '0'}
                </div>
              </div>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'C'].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  className="h-16 text-2xl"
                  onClick={() => handleNumberClick(num)}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Right: Asset Selection */}
        <Card className="p-8">
          <h2 className="text-gray-900 mb-6">Select Payment Method</h2>
          
          <div className="space-y-4">
            {assets.map((asset) => {
              const Icon = asset.icon;
              const cryptoAmount = amount ? (parseFloat(amount) * asset.rate).toFixed(8) : '0';
              
              return (
                <button
                  key={asset.id}
                  onClick={() => handleAssetSelect(asset.id)}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className={`w-full p-6 border-2 rounded-lg text-left transition-all ${
                    amount && parseFloat(amount) > 0
                      ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                      : 'border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-${asset.color}-100 rounded-full flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${asset.color}-600`} />
                      </div>
                      <div>
                        <p className="text-gray-900">{asset.name}</p>
                        <p className="text-sm text-gray-600">{cryptoAmount} {asset.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Rate</p>
                      <p className="text-sm text-gray-900">{asset.rate} {asset.id}/CAD</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 Customer will scan QR code to complete payment
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
