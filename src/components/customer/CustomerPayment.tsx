import { useState, useEffect } from 'react';
import { LightningPayment } from './LightningPayment';
import { EthereumPayment } from './EthereumPayment';
import { SolanaPayment } from './SolanaPayment';
import { PaymentSuccess } from './PaymentSuccess';
import { PaymentExpired } from './PaymentExpired';
import { AssetSelector } from './AssetSelector';
import { PageHeader } from '../PageHeader';
import { api, Payment } from '../../services/api';
import type { AppView } from '../../App';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Card } from '../ui/card';

type CryptoAsset = 'BTC' | 'ETH' | 'SOL';
type PaymentStep = 'select' | 'paying' | 'success' | 'expired' | 'failed' | 'loading' | 'error';

interface CustomerPaymentProps {
  paymentId: string | null;
  onNavigate?: (view: AppView) => void;
}

export function CustomerPayment({ paymentId, onNavigate }: CustomerPaymentProps) {
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('loading');
  const [countdown, setCountdown] = useState(900);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch payment data
  useEffect(() => {
    if (!paymentId) {
      setError('No payment ID provided');
      setPaymentStep('error');
      return;
    }

    const fetchPayment = async () => {
      try {
        const paymentData = await api.getPayment(paymentId);
        setPayment(paymentData);
        
        // Check if payment is already paid or expired
        if (paymentData.status === 'paid') {
          setPaymentStep('success');
          // Determine asset from payment data
          const assetMap: Record<string, CryptoAsset> = { btc: 'BTC', eth: 'ETH', sol: 'SOL' };
          setSelectedAsset(assetMap[paymentData.asset] || 'BTC');
        } else {
          const expiresAt = new Date(paymentData.expires_at);
          const now = new Date();
          if (expiresAt < now) {
            setPaymentStep('expired');
          } else {
            setPaymentStep('select');
            // Set countdown
            const diff = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
            setCountdown(diff);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payment');
        setPaymentStep('error');
      }
    };

    fetchPayment();
  }, [paymentId]);

  // Poll payment status when in paying state
  useEffect(() => {
    if (paymentStep === 'paying' && paymentId) {
      const pollInterval = setInterval(async () => {
        try {
          const paymentData = await api.getPayment(paymentId);
          setPayment(paymentData);
          
          if (paymentData.status === 'paid') {
            setPaymentStep('success');
            clearInterval(pollInterval);
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 3000); // Poll every 3 seconds

      return () => clearInterval(pollInterval);
    }
  }, [paymentStep, paymentId]);

  // Countdown timer
  useEffect(() => {
    if (paymentStep === 'paying' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setPaymentStep('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentStep, countdown]);

  const handleAssetSelect = (asset: CryptoAsset) => {
    setSelectedAsset(asset);
    setPaymentStep('paying');
  };

  const handlePaymentDetected = async () => {
    if (paymentId) {
      try {
        await api.verifyPayment(paymentId);
        setPaymentStep('success');
      } catch (err) {
        console.error('Payment verification error:', err);
      }
    }
  };

  const handleReset = () => {
    setSelectedAsset(null);
    setPaymentStep('select');
    if (payment) {
      const expiresAt = new Date(payment.expires_at);
      const now = new Date();
      const diff = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
      setCountdown(diff);
    }
  };

  if (paymentStep === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading payment...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'error') {
    return (
      <>
        {onNavigate && <PageHeader onNavigate={onNavigate} />}
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="p-8 max-w-md w-full">
            <Alert className="border-red-200 bg-red-50 mb-4">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">
                {error || 'Failed to load payment'}
              </AlertDescription>
            </Alert>
          </Card>
        </div>
      </>
    );
  }

  if (!payment) {
    return null;
  }

  const paymentData = {
    merchantName: 'Merchant', // Could fetch merchant name from API
    amount: payment.amount_cad,
    currency: 'CAD',
    description: payment.description || undefined
  };

  if (paymentStep === 'success') {
    return (
      <>
        {onNavigate && <PageHeader onNavigate={onNavigate} />}
        <PaymentSuccess paymentData={paymentData} asset={selectedAsset!} />
      </>
    );
  }

  if (paymentStep === 'expired') {
    return (
      <>
        {onNavigate && <PageHeader onNavigate={onNavigate} />}
        <PaymentExpired onRetry={handleReset} />
      </>
    );
  }

  if (paymentStep === 'select') {
    return (
      <>
        {onNavigate && <PageHeader onNavigate={onNavigate} />}
        <AssetSelector paymentData={paymentData} onSelectAsset={handleAssetSelect} />
      </>
    );
  }

  if (paymentStep === 'paying') {
    // Map payment asset to component asset
    const assetMap: Record<string, CryptoAsset> = { btc: 'BTC', eth: 'ETH', sol: 'SOL' };
    const currentAsset = selectedAsset || assetMap[payment.asset] || 'BTC';

    if (currentAsset === 'BTC') {
      return (
        <>
          {onNavigate && <PageHeader onNavigate={onNavigate} />}
          <LightningPayment
            paymentData={paymentData}
            payment={payment}
            countdown={countdown}
            onPaymentDetected={handlePaymentDetected}
            onCancel={handleReset}
          />
        </>
      );
    }
    if (currentAsset === 'ETH') {
      return (
        <>
          {onNavigate && <PageHeader onNavigate={onNavigate} />}
          <EthereumPayment
            paymentData={paymentData}
            payment={payment}
            countdown={countdown}
            onPaymentDetected={handlePaymentDetected}
            onCancel={handleReset}
          />
        </>
      );
    }
    if (currentAsset === 'SOL') {
      return (
        <>
          {onNavigate && <PageHeader onNavigate={onNavigate} />}
          <SolanaPayment
            paymentData={paymentData}
            payment={payment}
            countdown={countdown}
            onPaymentDetected={handlePaymentDetected}
            onCancel={handleReset}
          />
        </>
      );
    }
  }

  return null;
}
