import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CheckCircle2, Rocket } from 'lucide-react';

interface OnboardingSuccessProps {
  onComplete: () => void;
}

export function OnboardingSuccess({ onComplete }: OnboardingSuccessProps) {
  return (
    <Card className="p-12 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>

      <h2 className="text-gray-900 mb-4">Welcome to Canadian Crypto Pay!</h2>
      <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
        Your account is set up and ready to go. Start accepting crypto payments from customers across Canada.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
        <h3 className="text-gray-900 mb-4">Next Steps</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              1
            </span>
            <div>
              <p className="text-sm text-gray-900">Create your first payment</p>
              <p className="text-xs text-gray-600">Generate a QR code and test the flow</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              2
            </span>
            <div>
              <p className="text-sm text-gray-900">Set up API integration</p>
              <p className="text-xs text-gray-600">Connect your website or app</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              3
            </span>
            <div>
              <p className="text-sm text-gray-900">Wait for KYC approval</p>
              <p className="text-xs text-gray-600">Full features unlock after verification (1-2 days)</p>
            </div>
          </li>
        </ul>
      </div>

      <Button
        onClick={onComplete}
        className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
      >
        <Rocket className="w-5 h-5 mr-2" />
        Go to Dashboard
      </Button>
    </Card>
  );
}
