import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Bitcoin, Wallet, Zap, CheckCircle2 } from 'lucide-react';
import type { AppView } from '../../App';

interface HeroProps {
  onNavigate: (view: AppView) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
              FINTRAC Registered MSB
            </Badge>
            <div className="space-y-4">
              <h1 className="text-gray-900 leading-tight">
                Accept Crypto Payments<br />Across Canada
              </h1>
              <p className="text-gray-600 text-xl">
                Enable your business to accept Bitcoin Lightning, Ethereum, and Solana payments. 
                Convert to CAD or keep crypto. Simple, compliant, Canadian.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => onNavigate('onboarding')}
                className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline"
                onClick={() => onNavigate('api-docs')}
                className="h-12 px-8"
              >
                View API Docs
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-600 text-sm">No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-600 text-sm">Instant settlements</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-600 text-sm">Full compliance</span>
              </div>
            </div>
          </div>

          {/* Visual Section */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Accepted Cryptocurrencies</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">ACTIVE</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Bitcoin className="w-8 h-8 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Bitcoin Lightning</p>
                        <p className="text-xs text-gray-500">Instant, low fees</p>
                      </div>
                      <Zap className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <Wallet className="w-8 h-8 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Ethereum</p>
                        <p className="text-xs text-gray-500">Mainnet & L2s</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Wallet className="w-8 h-8 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Solana</p>
                        <p className="text-xs text-gray-500">Fast & affordable</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Today's Volume</p>
                      <p className="text-2xl text-gray-900 mt-1">$12,450 CAD</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Transactions</p>
                      <p className="text-2xl text-gray-900 mt-1">47</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
