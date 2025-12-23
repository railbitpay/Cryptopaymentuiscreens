import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle2 } from 'lucide-react';

export function Pricing() {
  const fees = [
    {
      asset: 'Bitcoin Lightning',
      txFee: '0.5%',
      cadConversion: '1.5%',
      settlementTime: 'Instant',
      color: 'orange'
    },
    {
      asset: 'Ethereum',
      txFee: '1.0%',
      cadConversion: '1.5%',
      settlementTime: '~15 seconds',
      color: 'purple'
    },
    {
      asset: 'Solana',
      txFee: '0.8%',
      cadConversion: '1.5%',
      settlementTime: '~1 second',
      color: 'green'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-gray-900 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          No monthly fees. No setup costs. Only pay when you get paid.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {fees.map((fee, index) => (
          <Card key={index} className="p-6">
            <h3 className="text-gray-900 mb-4">{fee.asset}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Transaction Fee</p>
                <p className="text-3xl text-gray-900 mt-1">{fee.txFee}</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">CAD Conversion Fee</p>
                <p className="text-xl text-gray-900 mt-1">{fee.cadConversion}</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">Settlement Time</p>
                <p className="text-sm text-gray-900 mt-1">{fee.settlementTime}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-8 bg-gray-900 text-white border-gray-800">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-white mb-4">Enterprise Plans</h3>
            <p className="text-gray-300 mb-6">
              High-volume merchants get custom pricing, dedicated support, and advanced features.
            </p>
            <Button className="bg-white text-gray-900 hover:bg-gray-100">
              Contact Sales
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-200">Volume-based discounts</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-200">Dedicated account manager</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-200">Custom integration support</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-200">Priority compliance assistance</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">Additional Fees</p>
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <div>
            <p className="text-gray-900">CAD Payout (EFT)</p>
            <p className="text-gray-600 mt-1">$2 per transfer</p>
          </div>
          <div>
            <p className="text-gray-900">Failed Payment</p>
            <p className="text-gray-600 mt-1">No charge</p>
          </div>
          <div>
            <p className="text-gray-900">Chargeback</p>
            <p className="text-gray-600 mt-1">N/A (crypto)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
