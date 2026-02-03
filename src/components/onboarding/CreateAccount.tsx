import React from 'react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Mail, Lock, Smartphone, CheckCircle2, XCircle } from 'lucide-react';

interface CreateAccountProps {
  onNext: (data: { email: string; password: string; enable2FA: boolean }) => void;
}

export function CreateAccount({ onNext }: CreateAccountProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enable2FA, setEnable2FA] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Password requirements check
  const passwordRequirements = {
    length: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 12) {
      return 'Password must be at least 12 characters';
    }
    
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      return 'Password must contain at least one symbol';
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    onNext({ email, password, enable2FA });
  };

  return (
    <Card className="p-8">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Create Your Account</h2>
        <p className="text-gray-600">Set up your merchant account credentials</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-900">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="your@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null); // Clear error when user types
              }}
              className="pl-10"
              required
            />
          </div>
          {password && (
            <div className="mt-2 space-y-1.5 text-xs">
              <div className={`flex items-center gap-2 ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                {passwordRequirements.length ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>At least 12 characters</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                {passwordRequirements.lowercase ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>One lowercase letter</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                {passwordRequirements.uppercase ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>One uppercase letter</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}`}>
                {passwordRequirements.number ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>One number</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordRequirements.symbol ? 'text-green-600' : 'text-gray-500'}`}>
                {passwordRequirements.symbol ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>One symbol</span>
              </div>
            </div>
          )}
          {!password && (
            <p className="text-xs text-gray-500">
              Must be at least 12 characters with uppercase, lowercase, numbers, and symbols
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(null); // Clear error when user types
              }}
              className="pl-10"
              required
            />
          </div>
          {confirmPassword && password && (
            <div className="flex items-center gap-2 text-xs">
              {password === confirmPassword ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Passwords match</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">Passwords do not match</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm text-gray-900 mb-1">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 mb-3">
                Protect your account with an additional layer of security
              </p>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={enable2FA}
                  onChange={(e) => setEnable2FA(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Enable 2FA (Recommended)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700"
            disabled={!allRequirementsMet || password !== confirmPassword}
          >
            Create Account & Continue
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
    </Card>
  );
}
