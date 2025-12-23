import { ArrowLeft, Copy, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';

interface ReceivePaymentProps {
  onBack: () => void;
}

export function ReceivePayment({ onBack }: ReceivePaymentProps) {
  const [copied, setCopied] = useState(false);
  const walletAddress = 'rN7n7otQDd6FczFgLdlqtyMVrn5xB5qJpA';

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-gray-900">Receive Payment</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* QR Code */}
        <Card className="p-8 flex flex-col items-center">
          <div className="w-64 h-64 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-4">
            {/* QR Code Placeholder - In production, use a QR code library */}
            <svg viewBox="0 0 256 256" className="w-full h-full p-4">
              <rect width="256" height="256" fill="white"/>
              <g fill="black">
                {/* Simple QR-like pattern */}
                {Array.from({ length: 8 }).map((_, i) =>
                  Array.from({ length: 8 }).map((_, j) => (
                    <rect
                      key={`${i}-${j}`}
                      x={i * 32}
                      y={j * 32}
                      width="28"
                      height="28"
                      fill={(i + j) % 2 === 0 ? 'black' : 'white'}
                    />
                  ))
                )}
              </g>
            </svg>
          </div>
          <p className="text-center text-sm text-gray-600">
            Scan this QR code to send XRP to this wallet
          </p>
        </Card>

        {/* Wallet Address */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Your XRP Address</label>
          <Card className="p-4">
            <div className="space-y-3">
              <div className="break-all text-gray-900 text-center">
                {walletAddress}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Address
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="text-gray-900 mb-2">How to receive XRP</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              <span>Share your QR code or wallet address with the sender</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              <span>Wait for the sender to complete the transaction</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                3
              </span>
              <span>XRP will appear in your wallet within seconds</span>
            </li>
          </ol>
        </Card>

        {/* Network Info */}
        <Card className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Network</span>
            <span className="text-gray-900">XRP Ledger</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Confirmation Time</span>
            <span className="text-gray-900">3-5 seconds</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
