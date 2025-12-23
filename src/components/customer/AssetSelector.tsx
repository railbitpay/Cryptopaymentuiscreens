import { Bitcoin, Wallet, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface PaymentData {
  merchantName: string;
  amount: number;
  currency: string;
  description?: string;
}

interface AssetSelectorProps {
  paymentData: PaymentData;
  onSelectAsset: (asset: 'BTC' | 'ETH' | 'SOL') => void;
}

export function AssetSelector({ paymentData, onSelectAsset }: AssetSelectorProps) {
  const assets = [
    {
      id: 'BTC' as const,
      name: 'Bitcoin Lightning',
      icon: Zap,
      color: 'orange',
      description: 'Instant, low-fee payments',
      rate: 0.000015,
      network: 'Lightning Network'
    },
    {
      id: 'ETH' as const,
      name: 'Ethereum',
      icon: Wallet,
      color: 'purple',
      description: 'Confirmation in ~15 seconds',
      rate: 0.00035,
      network: 'Ethereum Mainnet'
    },
    {
      id: 'SOL' as const,
      name: 'Solana',
      icon: Wallet,
      color: 'green',
      description: 'Fast and inexpensive',
      rate: 0.045,
      network: 'Solana Mainnet'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🇨🇦</span>
          </div>
          <h1 className="text-gray-900 mb-2">Pay with Crypto</h1>
          <p className="text-gray-600">{paymentData.merchantName}</p>
        </div>

        {/* Payment Info */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="text-center">
            <p className="text-blue-100 mb-2">Amount Due</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl">${paymentData.amount.toFixed(2)}</span>
              <span className="text-blue-100">{paymentData.currency}</span>
            </div>
            {paymentData.description && (
              <p className="text-sm text-blue-100 mt-2">{paymentData.description}</p>
            )}
          </div>
        </Card>

        {/* Asset Selection */}
        <div className="space-y-3">
          <h2 className="text-gray-900 mb-4">Select Payment Method</h2>
          {assets.map((asset) => {
            const Icon = asset.icon;
            const cryptoAmount = (paymentData.amount * asset.rate).toFixed(8);
            
            return (
              <button
                key={asset.id}
                onClick={() => onSelectAsset(asset.id)}
                className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-14 h-14 bg-${asset.color}-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 text-${asset.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-gray-900">{asset.name}</h3>
                        {asset.id === 'BTC' && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{asset.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{asset.network}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-gray-900 mb-1">{cryptoAmount} {asset.id}</p>
                    <p className="text-xs text-gray-500">≈ ${paymentData.amount.toFixed(2)} {paymentData.currency}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Secured by Canadian Crypto Pay</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            FINTRAC registered MSB • Compliant with Canadian regulations
          </p>
        </div>
      </div>
    </div>
  );
}
