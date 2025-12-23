import { Wallet } from 'lucide-react';
import type { AppView } from '../../App';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-white">Canadian Crypto Pay</span>
            </div>
            <p className="text-gray-400 text-sm">
              Accept crypto payments. Get CAD settlements. Built for Canadian businesses.
            </p>
          </div>
          
          <div>
            <h4 className="text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
              <li><button onClick={() => onNavigate('api-docs')} className="text-gray-400 hover:text-white">API Docs</button></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Integrations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Status</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              <li><a href="#compliance" className="text-gray-400 hover:text-white">Compliance</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FINTRAC Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Canadian Crypto Pay Inc. FINTRAC Registered MSB.
            </p>
            <p className="text-gray-400 text-sm">
              Made in Canada 🍁
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
