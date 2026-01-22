import { useState } from 'react';
import { CreateAccount } from './CreateAccount';
import { BusinessInformation } from './BusinessInformation';
import { KYCVerification } from './KYCVerification';
import { SettlementPreferences } from './SettlementPreferences';
import { OnboardingSuccess } from './OnboardingSuccess';
import { CheckCircle2, Circle } from 'lucide-react';
import { PageHeader } from '../PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import type { AppView } from '../../App';

interface MerchantOnboardingProps {
  onComplete: () => void;
  onNavigate?: (view: AppView) => void;
}

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export function MerchantOnboarding({ onComplete, onNavigate }: MerchantOnboardingProps) {
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState<{
    email?: string;
    password?: string;
    businessName?: string;
  }>({});

  const steps = [
    { id: 1, title: 'Create Account', description: 'Basic account setup' },
    { id: 2, title: 'Business Info', description: 'Company details' },
    { id: 3, title: 'Verification', description: 'KYC documents' },
    { id: 4, title: 'Settlement', description: 'Payment preferences' },
    { id: 5, title: 'Complete', description: 'Ready to go' }
  ];

  const handleNext = async (data?: { email?: string; password?: string; businessName?: string }) => {
    setError(null);
    
    // Update onboarding data first
    const updatedData = data ? { ...onboardingData, ...data } : onboardingData;
    
    // Register after step 2 (when we have email, password, and business name)
    if (currentStep === 2) {
      // Check if we have all required data for registration
      const email = updatedData.email || onboardingData.email;
      const password = updatedData.password || onboardingData.password;
      const businessName = updatedData.businessName || data?.businessName;
      
      if (email && password && businessName) {
        try {
          setLoading(true);
          await register(email, password, businessName);
          setOnboardingData({ email, password, businessName });
          setCurrentStep(3);
          return;
        } catch (err) {
          console.error('Registration failed:', err);
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'Registration failed. Please try again.';
          setError(errorMessage);
          setLoading(false);
          return; // Don't proceed if registration fails
        }
      } else {
        // Missing required data - this shouldn't happen if form validation works
        setError('Missing required information. Please go back and complete all steps.');
        return;
      }
    }
    
    // For step 1, save email and password
    if (currentStep === 1 && data) {
      setOnboardingData(prev => ({ ...prev, email: data.email, password: data.password }));
    }
    
    // For other steps, just update data and move forward
    if (data) {
      setOnboardingData(prev => ({ ...prev, ...data }));
    }
    
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
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-900 mb-1">Error</p>
            <p className="text-sm text-red-800">{error}</p>
            {error.includes('Cannot connect to server') && (
              <p className="text-xs text-red-700 mt-2">
                Make sure the backend server is running. Check the terminal where you ran <code className="bg-red-100 px-1 rounded">npm run dev</code> in the backend folder.
              </p>
            )}
          </div>
        )}
        {loading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">Registering your account...</p>
          </div>
        )}
        {currentStep === 1 && (
          <CreateAccount 
            onNext={(data) => handleNext(data)} 
          />
        )}
        {currentStep === 2 && (
          <BusinessInformation 
            onNext={(data) => handleNext(data)} 
            onBack={handleBack} 
          />
        )}
        {currentStep === 3 && <KYCVerification onNext={handleNext} onBack={handleBack} />}
        {currentStep === 4 && <SettlementPreferences onNext={handleNext} onBack={handleBack} />}
        {currentStep === 5 && <OnboardingSuccess onComplete={onComplete} />}
      </div>
    </div>
  );
}
