import { useState, useEffect } from 'react';
import { LightningPayment } from './LightningPayment';
import { EthereumPayment } from './EthereumPayment';
import { SolanaPayment } from './SolanaPayment';
import { PaymentSuccess } from './PaymentSuccess';
import { PaymentExpired } from './PaymentExpired';
import { AssetSelector } from './AssetSelector';

type CryptoAsset = 'BTC' | 'ETH' | 'SOL';
type PaymentStep = 'select' | 'paying' | 'success' | 'expired' | 'failed';

interface CustomerPaymentProps {
  paymentId: string | null;
}

export function CustomerPayment({ paymentId }: CustomerPaymentProps) {
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
    return <PaymentSuccess paymentData={paymentData} asset={selectedAsset!} />;
  }

  if (paymentStep === 'expired') {
    return <PaymentExpired onRetry={handleReset} />;
  }

  if (paymentStep === 'select') {
    return <AssetSelector paymentData={paymentData} onSelectAsset={handleAssetSelect} />;
  }

  if (paymentStep === 'paying') {
    if (selectedAsset === 'BTC') {
      return (
        <LightningPayment
          paymentData={paymentData}
          countdown={countdown}
          onPaymentDetected={handlePaymentDetected}
          onCancel={handleReset}
        />
      );
    }
    if (selectedAsset === 'ETH') {
      return (
        <EthereumPayment
          paymentData={paymentData}
          countdown={countdown}
          onPaymentDetected={handlePaymentDetected}
          onCancel={handleReset}
        />
      );
    }
    if (selectedAsset === 'SOL') {
      return (
        <SolanaPayment
          paymentData={paymentData}
          countdown={countdown}
          onPaymentDetected={handlePaymentDetected}
          onCancel={handleReset}
        />
      );
    }
  }

  return null;
}
