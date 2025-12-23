import { useState } from 'react';
import { CreateAccount } from './CreateAccount';
import { BusinessInformation } from './BusinessInformation';
import { KYCVerification } from './KYCVerification';
import { SettlementPreferences } from './SettlementPreferences';
import { OnboardingSuccess } from './OnboardingSuccess';
import { CheckCircle2, Circle } from 'lucide-react';
import { PageHeader } from '../PageHeader';
import type { AppView } from '../../App';

interface MerchantOnboardingProps {
  onComplete: () => void;
  onNavigate?: (view: AppView) => void;
}

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export function MerchantOnboarding({ onComplete, onNavigate }: MerchantOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);

  const steps = [
    { id: 1, title: 'Create Account', description: 'Basic account setup' },
    { id: 2, title: 'Business Info', description: 'Company details' },
    { id: 3, title: 'Verification', description: 'KYC documents' },
    { id: 4, title: 'Settlement', description: 'Payment preferences' },
    { id: 5, title: 'Complete', description: 'Ready to go' }
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as OnboardingStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as OnboardingStep);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {onNavigate && <PageHeader onNavigate={onNavigate} title="Merchant Onboarding" />}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep > step.id 
                      ? 'bg-green-600 border-green-600' 
                      : currentStep === step.id 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-white border-gray-300'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <span className={`${
                        currentStep === step.id ? 'text-white' : 'text-gray-500'
                      }`}>
                        {step.id}
                      </span>
                    )}
                  </div>
                  <div className="text-center mt-2 hidden md:block">
                    <p className={`text-sm ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentStep === 1 && <CreateAccount onNext={handleNext} />}
        {currentStep === 2 && <BusinessInformation onNext={handleNext} onBack={handleBack} />}
        {currentStep === 3 && <KYCVerification onNext={handleNext} onBack={handleBack} />}
        {currentStep === 4 && <SettlementPreferences onNext={handleNext} onBack={handleBack} />}
        {currentStep === 5 && <OnboardingSuccess onComplete={onComplete} />}
      </div>
    </div>
  );
}
