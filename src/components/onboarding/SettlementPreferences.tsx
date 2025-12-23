import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Bitcoin, Wallet, DollarSign, Building2 } from 'lucide-react';

interface SettlementPreferencesProps {
  onNext: () => void;
  onBack: () => void;
}

export function SettlementPreferences({ onNext, onBack }: SettlementPreferencesProps) {
  const [settlementMode, setSettlementMode] = useState<'crypto' | 'cad'>('cad');
  const [enableBTC, setEnableBTC] = useState(true);
  const [enableETH, setEnableETH] = useState(true);
  const [enableSOL, setEnableSOL] = useState(true);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [transitNumber, setTransitNumber] = useState('');
  const [institutionNumber, setInstitutionNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="mb-8">
          <h2 className="text-gray-900 mb-2">Settlement Preferences</h2>
          <p className="text-gray-600">Choose how you want to receive payments</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Settlement Mode */}
          <div className="space-y-4">
            <Label>Default Settlement Currency</Label>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSettlementMode('cad')}
                className={`p-6 rounded-lg border-2 text-left transition-all ${
                  settlementMode === 'cad'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <DollarSign className={`w-8 h-8 mb-3 ${
                  settlementMode === 'cad' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <h3 className="text-gray-900 mb-1">CAD Settlement</h3>
                <p className="text-sm text-gray-600">
                  Auto-convert crypto to CAD and receive via EFT
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSettlementMode('crypto')}
                className={`p-6 rounded-lg border-2 text-left transition-all ${
                  settlementMode === 'crypto'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Bitcoin className={`w-8 h-8 mb-3 ${
                  settlementMode === 'crypto' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <h3 className="text-gray-900 mb-1">Crypto Settlement</h3>
                <p className="text-sm text-gray-600">
                  Keep payments in crypto (BTC, ETH, SOL)
                </p>
              </button>
            </div>
          </div>

          {/* Enabled Assets */}
          <div className="space-y-4">
            <Label>Accepted Cryptocurrencies</Label>
            <div className="space-y-3">
              <label className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableBTC}
                  onChange={(e) => setEnableBTC(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Bitcoin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Bitcoin Lightning</p>
                    <p className="text-xs text-gray-500">0.5% fee • Instant settlements</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableETH}
                  onChange={(e) => setEnableETH(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Ethereum</p>
                    <p className="text-xs text-gray-500">1.0% fee • ~15 seconds</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableSOL}
                  onChange={(e) => setEnableSOL(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Solana</p>
                    <p className="text-xs text-gray-500">0.8% fee • ~1 second</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Bank Account for CAD */}
          {settlementMode === 'cad' && (
            <div className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-gray-600" />
                <Label>Bank Account for CAD Payouts</Label>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    type="text"
                    placeholder="TD Canada Trust"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transitNumber">Transit Number</Label>
                    <Input
                      id="transitNumber"
                      type="text"
                      placeholder="12345"
                      value={transitNumber}
                      onChange={(e) => setTransitNumber(e.target.value)}
                      maxLength={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institutionNumber">Institution</Label>
                    <Input
                      id="institutionNumber"
                      type="text"
                      placeholder="004"
                      value={institutionNumber}
                      onChange={(e) => setInstitutionNumber(e.target.value)}
                      maxLength={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      type="text"
                      placeholder="1234567"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Complete Setup
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
