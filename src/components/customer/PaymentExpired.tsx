import { Clock, RotateCcw } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface PaymentExpiredProps {
  onRetry: () => void;
}

export function PaymentExpired({ onRetry }: PaymentExpiredProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-12">
        <div className="text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-16 h-16 text-orange-600" />
          </div>

          {/* Title */}
          <h1 className="text-gray-900 mb-2">Payment Expired</h1>
          <p className="text-gray-600 mb-8">
            This payment request has expired. The 15-minute window has passed.
          </p>

          {/* Info */}
          <Card className="p-6 mb-8 bg-orange-50 border-orange-200">
            <p className="text-sm text-gray-900 mb-2">Why did this happen?</p>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• Crypto prices fluctuate rapidly</li>
              <li>• Payment requests expire after 15 minutes</li>
              <li>• This protects both you and the merchant</li>
            </ul>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={onRetry} className="w-full h-12">
              <RotateCcw className="w-4 h-4 mr-2" />
              Generate New Payment Request
            </Button>
            <Button variant="outline" className="w-full h-12">
              Contact Merchant
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? Contact support@railbit.com
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
