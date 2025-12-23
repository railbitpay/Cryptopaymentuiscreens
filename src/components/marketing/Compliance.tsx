import { Card } from '../ui/card';
import { Shield, Lock, FileText, Eye } from 'lucide-react';

export function Compliance() {
  const features = [
    {
      icon: Shield,
      title: 'FINTRAC Registered MSB',
      description: 'Fully registered Money Services Business under FINTRAC regulations. All transactions are reported according to Canadian AML/ATF requirements.'
    },
    {
      icon: Lock,
      title: 'RPAA Readiness',
      description: 'Prepared for Retail Payment Activities Act compliance. Safeguarding requirements, operational risk management, and incident reporting in place.'
    },
    {
      icon: FileText,
      title: 'Transaction Logging',
      description: 'Complete audit trail of all transactions. Automated reporting for Large Virtual Currency Transactions (LVCTR) and Suspicious Transaction Reports (STR).'
    },
    {
      icon: Eye,
      title: 'AML Monitoring',
      description: 'Real-time transaction monitoring for suspicious patterns. Automated screening against sanctions lists and PEP databases.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-gray-900 mb-4">Compliance & Security</h2>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Built to meet Canadian regulatory standards from day one
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          );
        })}
      </div>

      <Card className="p-8 bg-blue-50 border-blue-200">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-gray-900 mb-4">Data Protection & Privacy</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>End-to-end encryption for all sensitive data</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>PIPEDA compliant data handling practices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Secure key management with HSM integration</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Regular third-party security audits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>SOC 2 Type II certified infrastructure</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-900 mb-4">KYC/KYB Requirements</h3>
            <p className="text-gray-700 mb-4">
              To comply with FINTRAC regulations, we require:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Business registration documents</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>CRA business number verification</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Beneficial owner identification</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Proof of business address</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
