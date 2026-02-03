import { useState, useEffect } from 'react';
import { ArrowRight, Building2, ShoppingBag, CreditCard, Shield, Code, Sparkles, Wallet, Mail, Lock, Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';
import type { AppView } from '../App';

interface EntryPageProps {
  onNavigate: (view: AppView) => void;
}

export function EntryPage({ onNavigate }: EntryPageProps) {
  const { login, isAuthenticated } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check backend status on mount and periodically
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';
        const response = await fetch(`${API_BASE}/health`, {
          method: 'GET',
          cache: 'no-store'
        });
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (err) {
        setBackendStatus('offline');
      }
    };

    checkBackend();
    // Check every 5 seconds
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

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

  // Don't auto-redirect - let users choose to go to dashboard or stay on entry page
  const quickLinks = [
    {
      title: 'Merchant Dashboard',
      description: 'Access your merchant portal',
      icon: ShoppingBag,
      view: 'dashboard' as AppView,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Marketing Site',
      description: 'Public website for merchants',
      icon: Building2,
      view: 'marketing' as AppView,
      color: 'from-green-600 to-green-700',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Customer Payment',
      description: 'Payment flow screens',
      icon: CreditCard,
      view: 'customer-payment' as AppView,
      color: 'from-orange-600 to-orange-700',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  const otherOptions = [
    { title: 'Merchant Onboarding', view: 'onboarding' as AppView, icon: Building2 },
    { title: 'Admin Back Office', view: 'admin' as AppView, icon: Shield },
    { title: 'API Documentation', view: 'api-docs' as AppView, icon: Code },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Backend Status Indicator - Fixed position top right */}
      <div className="fixed top-4 right-4 z-50">
        {backendStatus === 'checking' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg shadow-sm border border-gray-200">
            <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
            <span className="text-sm text-gray-600">Checking backend...</span>
          </div>
        )}
        {backendStatus === 'online' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 border border-green-200 rounded-lg shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Backend is running</span>
          </div>
        )}
        {backendStatus === 'offline' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-100 border border-red-200 rounded-lg shadow-sm">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700 font-medium">Backend offline</span>
          </div>
        )}
      </div>

      {/* Navigation Header */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => onNavigate('entry')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-900 font-semibold">RailBit</span>
              </button>
              <div className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => onNavigate('marketing')}
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => onNavigate('api-docs')}
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Documentation
                </button>
                <a 
                  href="mailto:support@railbit.com"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost"
                onClick={() => setLoginOpen(true)}
                className="hidden sm:flex"
              >
                Login
              </Button>
              <Button 
                onClick={() => onNavigate('onboarding')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            RailBit
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Crypto Payment Platform
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
              FINTRAC MSB Compliant
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              🇨🇦 Canada
            </Badge>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Quick Access
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Card
                  key={link.view}
                  className={`${link.bgColor} border-0 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden relative`}
                  onClick={() => onNavigate(link.view)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="relative p-6">
                    <div className={`w-12 h-12 ${link.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${link.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {link.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {link.description}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-white group-hover:border-gray-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(link.view);
                      }}
                    >
                      Open
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Other Options */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            More Options
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card
                  key={option.view}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer group border-gray-200"
                  onClick={() => onNavigate(option.view)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {option.title}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <Card className="inline-block p-6 bg-white/50 backdrop-blur-sm border-gray-200">
            <p className="text-sm text-gray-600">
              Accept Bitcoin Lightning, Ethereum, and Solana payments
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Built with React, TypeScript, and Tailwind CSS
            </p>
          </Card>
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login to RailBit</DialogTitle>
            <DialogDescription>
              Enter your credentials to access your merchant dashboard
            </DialogDescription>
          </DialogHeader>
          
          {/* Backend Status in Login Dialog */}
          {backendStatus === 'online' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900">
                Backend is running and ready
              </AlertDescription>
            </Alert>
          )}
          
          {backendStatus === 'offline' && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">
                Cannot connect to backend. Please make sure the backend is running at http://localhost:3001/api
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

