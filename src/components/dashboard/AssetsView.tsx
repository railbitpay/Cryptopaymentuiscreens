import { useState } from 'react';
import { Bitcoin, Wallet, ArrowRight, TrendingUp, Settings, Eye, EyeOff } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';

interface AssetBalance {
  symbol: string;
  name: string;
  balance: number;
  cadValue: number;
  icon: typeof Bitcoin;
  color: string;
  enabled: boolean;
}

export function AssetsView() {
  const [showBalances, setShowBalances] = useState(true);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetBalance | null>(null);
  const [convertAmount, setConvertAmount] = useState('');

  const [assets, setAssets] = useState<AssetBalance[]>([
    {
      symbol: 'BTC',
      name: 'Bitcoin Lightning',
      balance: 0.05234,
      cadValue: 3245.67,
      icon: Bitcoin,
      color: 'orange',
      enabled: true
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 1.2456,
      cadValue: 4567.89,
      icon: Wallet,
      color: 'purple',
      enabled: true
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      balance: 45.678,
      cadValue: 2134.56,
      icon: Wallet,
      color: 'green',
      enabled: false
    }
  ]);

  const conversionHistory = [
    {
      id: '1',
      date: '2025-11-20',
      asset: 'BTC',
      amount: 0.01,
      cadAmount: 650.00,
      rate: 65000,
      status: 'completed'
    },
    {
      id: '2',
      date: '2025-11-18',
      asset: 'ETH',
      amount: 0.5,
      cadAmount: 1850.00,
      rate: 3700,
      status: 'completed'
    },
    {
      id: '3',
      date: '2025-11-15',
      asset: 'SOL',
      amount: 10,
      cadAmount: 450.00,
      rate: 45,
      status: 'pending'
    }
  ];

  const toggleAsset = (symbol: string) => {
    setAssets(assets.map(asset => 
      asset.symbol === symbol ? { ...asset, enabled: !asset.enabled } : asset
    ));
  };

  const handleConvert = () => {
    // Handle conversion logic
    setConvertDialogOpen(false);
    setConvertAmount('');
  };

  const totalCADValue = assets.reduce((sum, asset) => sum + asset.cadValue, 0);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">Assets & Wallets</h1>
            <p className="text-gray-600 mt-1">Manage your crypto balances and settlement preferences</p>
          </div>
          <Button variant="outline" onClick={() => setShowBalances(!showBalances)}>
            {showBalances ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showBalances ? 'Hide' : 'Show'} Balances
          </Button>
        </div>

        {/* Total Balance */}
        <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <p className="text-blue-100 mb-2">Total Portfolio Value</p>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl">
              {showBalances ? `$${totalCADValue.toLocaleString('en-CA', { minimumFractionDigits: 2 })}` : '••••••'}
            </span>
            <span className="text-blue-100">CAD</span>
          </div>
          <div className="flex items-center gap-2 mt-4 text-green-300">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">+8.5% this month</span>
          </div>
        </Card>

        {/* Asset Balances */}
        <div>
          <h2 className="text-gray-900 mb-4">Your Wallets</h2>
          <div className="grid gap-4">
            {assets.map((asset) => {
              const Icon = asset.icon;
              return (
                <Card key={asset.symbol} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 bg-${asset.color}-100 rounded-full flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${asset.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-gray-900">{asset.name}</h3>
                          <Badge variant={asset.enabled ? 'default' : 'secondary'}>
                            {asset.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-sm text-gray-600">Balance</p>
                            <p className="text-gray-900">
                              {showBalances ? `${asset.balance} ${asset.symbol}` : '•••••'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">CAD Value</p>
                            <p className="text-gray-900">
                              {showBalances ? `$${asset.cadValue.toLocaleString('en-CA', { minimumFractionDigits: 2 })}` : '•••••'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => {
                          setSelectedAsset(asset);
                          setConvertDialogOpen(true);
                        }}
                        disabled={!asset.enabled || asset.balance === 0}
                      >
                        Convert to CAD
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleAsset(asset.symbol)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Conversion History */}
        <div>
          <h2 className="text-gray-900 mb-4">Conversion History</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Asset</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Crypto Amount</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">CAD Amount</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Rate</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {conversionHistory.map((conversion) => (
                    <tr key={conversion.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-900">{conversion.date}</td>
                      <td className="py-4 px-4">
                        <Badge className={`bg-${conversion.asset === 'BTC' ? 'orange' : conversion.asset === 'ETH' ? 'purple' : 'green'}-100 text-${conversion.asset === 'BTC' ? 'orange' : conversion.asset === 'ETH' ? 'purple' : 'green'}-800`}>
                          {conversion.asset}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">{conversion.amount} {conversion.asset}</td>
                      <td className="py-4 px-4 text-sm text-gray-900">${conversion.cadAmount.toFixed(2)}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">${conversion.rate.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <Badge className={conversion.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {conversion.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Convert Dialog */}
        <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convert {selectedAsset?.symbol} to CAD</DialogTitle>
              <DialogDescription>
                Convert your crypto balance to Canadian dollars
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Amount to Convert ({selectedAsset?.symbol})</Label>
                <Input
                  type="number"
                  step="0.00000001"
                  placeholder="0.0"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Available: {selectedAsset?.balance} {selectedAsset?.symbol}
                </p>
              </div>
              {convertAmount && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">You will receive</span>
                    <span className="text-gray-900">
                      ${(parseFloat(convertAmount) * (selectedAsset ? selectedAsset.cadValue / selectedAsset.balance : 0)).toFixed(2)} CAD
                    </span>
                  </div>
                </Card>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConvertDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConvert} disabled={!convertAmount || parseFloat(convertAmount) <= 0}>
                Convert to CAD
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
