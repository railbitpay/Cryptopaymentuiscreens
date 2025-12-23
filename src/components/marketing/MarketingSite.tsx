import { useState } from 'react';
import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { Pricing } from './Pricing';
import { Compliance } from './Compliance';
import { MarketingNav } from './MarketingNav';
import { Footer } from './Footer';
import type { AppView } from '../../App';

interface MarketingSiteProps {
  onNavigate: (view: AppView) => void;
}

export function MarketingSite({ onNavigate }: MarketingSiteProps) {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav onNavigate={onNavigate} />
      
      <div id="home">
        <Hero onNavigate={onNavigate} />
      </div>
      
      <div id="how-it-works" className="py-20">
        <HowItWorks />
      </div>
      
      <div id="pricing" className="py-20 bg-gray-50">
        <Pricing />
      </div>
      
      <div id="compliance" className="py-20">
        <Compliance />
      </div>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
