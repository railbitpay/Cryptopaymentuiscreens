import { useState, useEffect } from 'react';
import { Bitcoin, Wallet, ArrowRight, TrendingUp, Settings, Eye, EyeOff, Loader2 } from 'lucide-react';
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
import { api } from '../../services/api';

interface AssetBalance {
  symbol: string;
  name: string;
  balance: number;
  cadValue: number;
  icon: typeof Bitcoin;
  color: string;
  enabled: boolean;
}

const assetConfig: Record<string, { name: string; icon: typeof Bitcoin; color: string }> = {
  btc: { name: 'Bitcoin Lightning', icon: Bitcoin, color: 'orange' },
  eth: { name: 'Ethereum', icon: Wallet, color: 'purple' },
  sol: { name: 'Solana', icon: Wallet, color: 'green' }
};

const colorClasses: Record<string, { bg: string; text: string }> = {
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600' }
};

export function AssetsView() {
  const [showBalances, setShowBalances] = useState(true);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetBalance | null>(null);
  const [convertAmount, setConvertAmount] = useState('');
  const [assets, setAssets] = useState<AssetBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversionHistory, setConversionHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true);
        const [{ assets: apiAssets }, payouts] = await Promise.all([
          api.getAssetBalances(),
          api.getPayouts()
        ]);
        
        const formattedAssets: AssetBalance[] = apiAssets.map(asset => {
          const config = assetConfig[asset.asset.toLowerCase()] || { name: asset.asset.toUpperCase(), icon: Wallet, color: 'gray' };
          return {
            symbol: asset.asset.toUpperCase(),
            name: config.name,
            balance: asset.balance,
            cadValue: asset.cad_value,
            icon: config.icon,
            color: config.color,
            enabled: asset.balance > 0
          };
        });

        // Ensure all three assets are shown (even with 0 balance)
        ['btc', 'eth', 'sol'].forEach(assetKey => {
          if (!formattedAssets.find(a => a.symbol.toLowerCase() === assetKey)) {
            const config = assetConfig[assetKey];
            formattedAssets.push({
              symbol: assetKey.toUpperCase(),
              name: config.name,
              balance: 0,
              cadValue: 0,
              icon: config.icon,
              color: config.color,
              enabled: false
            });
          }
        });

        setAssets(formattedAssets);
        setConversionHistory(
          payouts
            .filter(p => p.description === 'Asset conversion')
            .map(p => ({
              id: p.id,
              date: new Date(p.created_at).toLocaleDateString(),
              asset: p.asset.toUpperCase(),
              amount: p.crypto_amount,
              cadAmount: p.amount,
              rate: p.crypto_amount > 0 ? p.amount / p.crypto_amount : 0,
              status: p.status
            }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch balances');
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, []);

  const toggleAsset = (symbol: string) => {
    setAssets(assets.map(asset => 
      asset.symbol === symbol ? { ...asset, enabled: !asset.enabled } : asset
    ));
  };

  const handleConvert = () => {
    if (!selectedAsset) return;
    const amountNum = parseFloat(convertAmount);
    if (!amountNum || amountNum <= 0) return;
    api.convertAsset(selectedAsset.symbol.toLowerCase(), amountNum)
      .then(async (payout) => {
        setConversionHistory(prev => ([
          {
            id: payout.id,
            date: new Date(payout.created_at).toLocaleDateString(),
            asset: payout.asset.toUpperCase(),
            amount: payout.crypto_amount,
            cadAmount: payout.amount,
            rate: payout.crypto_amount > 0 ? payout.amount / payout.crypto_amount : 0,
            status: payout.status
          },
          ...prev
        ]));
        const { assets: apiAssets } = await api.getAssetBalances();
        const formattedAssets: AssetBalance[] = apiAssets.map(asset => {
          const config = assetConfig[asset.asset.toLowerCase()] || { name: asset.asset.toUpperCase(), icon: Wallet, color: 'gray' };
          return {
            symbol: asset.asset.toUpperCase(),
            name: config.name,
            balance: asset.balance,
            cadValue: asset.cad_value,
            icon: config.icon,
            color: config.color,
            enabled: asset.balance > 0
          };
        });
        ['btc', 'eth', 'sol'].forEach(assetKey => {
          if (!formattedAssets.find(a => a.symbol.toLowerCase() === assetKey)) {
            const config = assetConfig[assetKey];
            formattedAssets.push({
              symbol: assetKey.toUpperCase(),
              name: config.name,
              balance: 0,
              cadValue: 0,
              icon: config.icon,
              color: config.color,
              enabled: false
            });
          }
        });
        setAssets(formattedAssets);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Conversion failed');
      })
      .finally(() => {
        setConvertDialogOpen(false);
        setConvertAmount('');
      });
  };

  const totalCADValue = assets.reduce((sum, asset) => sum + asset.cadValue, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-gray-900">Assets & Wallets</h1>
            <p className="text-gray-600 mt-1">Manage your crypto balances and settlement preferences</p>
          </div>
          <Button variant="outline" onClick={() => setShowBalances(!showBalances)}>
            {showBalances ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showBalances ? 'Hide' : 'Show'} Balances
          </Button>
        </div>

        {error && (
          <Card className="p-4 border-red-200 bg-red-50 text-red-900">
            {error}
          </Card>
        )}

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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                      <div className={`w-12 h-12 ${colorClasses[asset.color]?.bg || 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                        <Icon className={`${colorClasses[asset.color]?.text || 'text-gray-600'} w-6 h-6`} />
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
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
                      <Badge className={
                        conversion.asset === 'BTC'
                          ? 'bg-orange-100 text-orange-800'
                          : conversion.asset === 'ETH'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }>
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
                      ${(parseFloat(convertAmount) * (selectedAsset && selectedAsset.balance > 0 ? selectedAsset.cadValue / selectedAsset.balance : 0)).toFixed(2)} CAD
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
