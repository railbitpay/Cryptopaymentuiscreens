import { Home, ShoppingBag, Users, Settings, Shield, Code, Palette, CreditCard } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import type { AppView } from '../App';

interface NavigationHubProps {
  onNavigate: (view: AppView) => void;
}

export function NavigationHub({ onNavigate }: NavigationHubProps) {
  const sections = [
    {
      title: 'Public Website',
      description: 'Marketing site for merchants',
      icon: Home,
      color: 'blue',
      view: 'marketing' as AppView,
      features: ['Hero section', 'How It Works', 'Pricing', 'Compliance', 'FINTRAC MSB info']
    },
    {
      title: 'Merchant Onboarding',
      description: 'Multi-step registration flow',
      icon: Users,
      color: 'green',
      view: 'onboarding' as AppView,
      features: ['Account creation', 'Business info', 'KYC verification', 'Settlement preferences']
    },
    {
      title: 'Merchant Dashboard',
      description: 'Complete merchant portal',
      icon: ShoppingBag,
      color: 'purple',
      view: 'dashboard' as AppView,
      features: ['Overview', 'Payments', 'POS Mode', 'Assets', 'Payouts', 'Compliance', 'Settings']
    },
    {
      title: 'Customer Payment Flow',
      description: 'Payment screens for end users',
      icon: CreditCard,
      color: 'orange',
      view: 'customer-payment' as AppView,
      features: ['Asset selector', 'Lightning payment', 'Ethereum payment', 'Solana payment', 'Success/Expired states']
    },
    {
      title: 'Admin Back Office',
      description: 'Compliance officer portal',
      icon: Shield,
      color: 'red',
      view: 'admin' as AppView,
      features: ['Merchant directory', 'Merchant details', 'Transaction monitoring', 'Compliance events', 'System health']
    },
    {
      title: 'API Documentation',
      description: 'Developer portal',
      icon: Code,
      color: 'gray',
      view: 'api-docs' as AppView,
      features: ['Getting started', 'Authentication', 'Payments API', 'Webhooks', 'Error handling']
    },
    {
      title: 'Design System',
      description: 'Complete UI component library',
      icon: Palette,
      color: 'pink',
      view: 'design-system' as AppView,
      features: ['Color palette', 'Buttons', 'Alerts', 'Badges', 'Form components', 'Cards']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🇨🇦</span>
          </div>
          <h1 className="text-gray-900 mb-3">Canadian Crypto Pay</h1>
          <p className="text-gray-600 text-lg mb-2">Complete UI System & Platform</p>
          <p className="text-sm text-gray-500">
            Accept Bitcoin Lightning, Ethereum, and Solana payments • FINTRAC MSB Compliant
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card 
                key={section.view}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onNavigate(section.view)}
              >
                <div className={`w-12 h-12 bg-${section.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 text-${section.color}-600`} />
                </div>
                <h3 className="text-gray-900 mb-2">{section.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{section.description}</p>
                <div className="space-y-1">
                  {section.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-500">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View {section.title}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
            <h3 className="text-white mb-2">🎨 Complete Design System</h3>
            <p className="text-blue-100 text-sm">
              Clean, modern Canadian fintech aesthetic with full component library
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-green-600 to-green-800 text-white">
            <h3 className="text-white mb-2">🔒 FINTRAC Compliant</h3>
            <p className="text-green-100 text-sm">
              Built-in compliance monitoring, KYC flows, and regulatory reporting
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
            <h3 className="text-white mb-2">⚡ Multi-Asset Support</h3>
            <p className="text-purple-100 text-sm">
              Bitcoin Lightning, Ethereum, and Solana with CAD settlement
            </p>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-12 p-8">
          <h2 className="text-gray-900 mb-6">Platform Overview</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-gray-900 mb-3">Core Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Marketing website with merchant signup</li>
                <li>• Complete KYC onboarding workflow</li>
                <li>• Full-featured merchant dashboard</li>
                <li>• Point-of-sale (POS) mode for retail</li>
                <li>• Customer payment flows for all assets</li>
                <li>• Admin back-office for compliance</li>
                <li>• RESTful API with webhooks</li>
                <li>• Comprehensive documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 mb-3">Technical Stack</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• React with TypeScript</li>
                <li>• Tailwind CSS v4</li>
                <li>• shadcn/ui components</li>
                <li>• Lucide icons</li>
                <li>• Responsive mobile-first design</li>
                <li>• Accessible UI components</li>
                <li>• Clean component architecture</li>
                <li>• Production-ready code</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
