import { useState } from 'react';
import { Button } from '../ui/button';
import { Wallet, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../contexts/AuthContext';
import type { AppView } from '../../App';

interface MarketingNavProps {
  onNavigate: (view: AppView) => void;
}

export function MarketingNav({ onNavigate }: MarketingNavProps) {
  const { login, isAuthenticated, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      setLoginOpen(false);
      setEmail('');
      setPassword('');
      onNavigate('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('marketing')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900">RailBit</span>
            </button>
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
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => onNavigate('dashboard')}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    logout();
                    setLoginOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost">
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Login to RailBit</DialogTitle>
                      <DialogDescription>
                        Enter your credentials to access your merchant dashboard.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4 py-4">
                      {error && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-900">{error}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@business.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                      </Button>
                    </form>
                    <p className="text-center text-sm text-gray-600">
                      Don't have an account?{' '}
                      <Button variant="link" className="p-0 h-auto" onClick={() => { setLoginOpen(false); onNavigate('onboarding'); }}>
                        Sign Up
                      </Button>
                    </p>
                  </DialogContent>
                </Dialog>
                <Button 
                  onClick={() => onNavigate('onboarding')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
