import { CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import type { AppView } from '../App';

interface LogoutPageProps {
  onNavigate: (view: AppView) => void;
}

export function LogoutPage({ onNavigate }: LogoutPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Logged Out</h1>
        <p className="text-gray-600 mb-8">
          You have been successfully logged out of your account.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => onNavigate('entry')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Return to Home
          </Button>
          <Button 
            onClick={() => onNavigate('dashboard')}
            variant="outline"
            className="w-full"
          >
            Login Again
          </Button>
        </div>
      </Card>
    </div>
  );
}

