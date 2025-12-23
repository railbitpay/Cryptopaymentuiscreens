import { Wallet } from 'lucide-react';
import type { AppView } from '../App';

interface PageHeaderProps {
  onNavigate: (view: AppView) => void;
  title?: string;
}

export function PageHeader({ onNavigate, title }: PageHeaderProps) {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={() => onNavigate('entry')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 font-semibold">RailBit</span>
          </button>
          {title && (
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          )}
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
      </div>
    </nav>
  );
}

