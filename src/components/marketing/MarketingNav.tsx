import { Button } from '../ui/button';
import { Wallet } from 'lucide-react';
import type { AppView } from '../../App';

interface MarketingNavProps {
  onNavigate: (view: AppView) => void;
}

export function MarketingNav({ onNavigate }: MarketingNavProps) {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900">Canadian Crypto Pay</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm">
                How it Works
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm">
                Pricing
              </a>
              <a href="#compliance" className="text-gray-600 hover:text-gray-900 text-sm">
                Compliance
              </a>
              <button 
                onClick={() => onNavigate('api-docs')}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                API Docs
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              onClick={() => onNavigate('merchant-dashboard')}
            >
              Login
            </Button>
            <Button 
              onClick={() => onNavigate('onboarding')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
