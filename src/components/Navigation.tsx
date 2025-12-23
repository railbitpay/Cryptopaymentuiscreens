import { Home, ArrowUpRight, ArrowDownLeft, List } from 'lucide-react';
import type { Screen } from '../App';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as Screen, label: 'Home', icon: Home },
    { id: 'send' as Screen, label: 'Send', icon: ArrowUpRight },
    { id: 'receive' as Screen, label: 'Receive', icon: ArrowDownLeft },
    { id: 'transactions' as Screen, label: 'History', icon: List }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
      <div className="grid grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
