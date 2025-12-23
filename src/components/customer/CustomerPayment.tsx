import { useState, useEffect } from 'react';
import { LightningPayment } from './LightningPayment';
import { EthereumPayment } from './EthereumPayment';
import { SolanaPayment } from './SolanaPayment';
import { PaymentSuccess } from './PaymentSuccess';
import { PaymentExpired } from './PaymentExpired';
import { AssetSelector } from './AssetSelector';
import { PageHeader } from '../PageHeader';
import type { AppView } from '../../App';

type CryptoAsset = 'BTC' | 'ETH' | 'SOL';
type PaymentStep = 'select' | 'paying' | 'success' | 'expired' | 'failed';

interface CustomerPaymentProps {
  paymentId: string | null;
  onNavigate?: (view: AppView) => void;
}

export function CustomerPayment({ paymentId, onNavigate }: CustomerPaymentProps) {
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('select');
  const [countdown, setCountdown] = useState(900); // 15 minutes

  // Mock payment data
  const paymentData = {
    merchantName: 'My Coffee Shop',
    amount: 45.50,
    currency: 'CAD',
    description: 'Order #12345'
  };

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

  const handlePaymentDetected = () => {
    setPaymentStep('success');
  };

  const handleReset = () => {
    setSelectedAsset(null);
    setPaymentStep('select');
    setCountdown(900);
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
    if (selectedAsset === 'BTC') {
      return (
        <>
          {onNavigate && <PageHeader onNavigate={onNavigate} />}
          <LightningPayment
            paymentData={paymentData}
            countdown={countdown}
            onPaymentDetected={handlePaymentDetected}
            onCancel={handleReset}
          />
        </>
      );
    }
    if (selectedAsset === 'ETH') {
      return (
        <>
          {onNavigate && <PageHeader onNavigate={onNavigate} />}
          <EthereumPayment
            paymentData={paymentData}
            countdown={countdown}
            onPaymentDetected={handlePaymentDetected}
            onCancel={handleReset}
          />
        </>
      );
    }
    if (selectedAsset === 'SOL') {
      return (
        <>
          {onNavigate && <PageHeader onNavigate={onNavigate} />}
          <SolanaPayment
            paymentData={paymentData}
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
