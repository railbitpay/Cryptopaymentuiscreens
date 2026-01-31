import { useState, FormEvent } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Form } from './Form';
import { FormInput } from './Input';

interface LoginFormProps {
  loading?: boolean;
  error?: string | null;
  onSignupClick?: () => void;
  onHomeClick?: () =>  void;
  title?: string;
  description?: string;
  children?: React.ReactNode
}

export function LoginForm({
  loading = false,
  error = null,
  onSignupClick,
  onHomeClick,
  children,
  title = 'Login Required',
  description = 'Please log in to access your merchant dashboard',
}: LoginFormProps) {



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-900">{error}</AlertDescription>
          </Alert>
        )}

        {children}

          <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={onSignupClick}
                >
                  Sign Up
                </Button>
              </p>
            
              <Button variant="ghost" className="mt-4" onClick={onHomeClick}>
                Back to Home
              </Button>
          </div>
      </Card>
    </div>
  );
}