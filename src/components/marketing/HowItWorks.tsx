import { QrCode, Search, DollarSign } from 'lucide-react';
import { Card } from '../ui/card';

export function HowItWorks() {
  const steps = [
    {
      icon: QrCode,
      title: 'Accept Payment',
      description: 'Generate a payment request with QR code. Customer scans and pays with their crypto wallet.',
      color: 'blue'
    },
    {
      icon: Search,
      title: 'Detect Transaction',
      description: 'Our system monitors the blockchain and confirms the payment in real-time.',
      color: 'purple'
    },
    {
      icon: DollarSign,
      title: 'Get CAD or Crypto',
      description: 'Receive settlement in CAD via EFT or keep crypto in your wallet. Your choice.',
      color: 'green'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-gray-900 mb-4">How It Works</h2>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Three simple steps to start accepting crypto payments in your Canadian business
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            purple: 'bg-purple-100 text-purple-600',
            green: 'bg-green-100 text-green-600'
          };
          
          return (
            <Card key={index} className="p-8 relative">
              <div className="absolute -top-4 left-8 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                {index + 1}
              </div>
              <div className={`w-16 h-16 ${colorClasses[step.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center mb-6 mt-4`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-white mb-4">Built for Canadian Merchants</h3>
            <p className="text-blue-100 text-lg mb-6">
              Full compliance with FINTRAC regulations, RPAA readiness, and Canadian banking integration.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-blue-50">FINTRAC registered Money Services Business (MSB)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-blue-50">EFT settlements to Canadian bank accounts</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-blue-50">Full transaction logging and AML monitoring</span>
              </li>
            </ul>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
            <div className="space-y-4">
              <div>
                <p className="text-blue-100 text-sm">Average Settlement Time</p>
                <p className="text-white text-3xl mt-1">2-3 seconds</p>
              </div>
              <div className="border-t border-white/20 pt-4">
                <p className="text-blue-100 text-sm">Transaction Success Rate</p>
                <p className="text-white text-3xl mt-1">99.8%</p>
              </div>
              <div className="border-t border-white/20 pt-4">
                <p className="text-blue-100 text-sm">Supported Businesses</p>
                <p className="text-white text-3xl mt-1">1,200+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
