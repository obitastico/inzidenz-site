import React from 'react';

export type View = 'timer' | 'settings' | 'history';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  hasActiveBreak: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, hasActiveBreak }) => {
  const navItems = [
    {
      id: 'timer' as View,
      label: 'Timer',
      icon: '🚬',
      description: 'Aktuelle Pause'
    },
    {
      id: 'settings' as View,
      label: 'Einstellungen',
      icon: '⚙️',
      description: 'Konfiguration'
    },
    {
      id: 'history' as View,
      label: 'Historie',
      icon: '📊',
      description: 'Pausen-Verlauf'
    }
  ];

  return (
    <nav className="bg-gray-900">
      <div className="flex">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex-1 flex flex-col items-center py-1.5 px-1 transition-all duration-200 min-h-[52px] ${
              currentView === item.id
                ? 'bg-violet-600 text-white'
                : 'bg-gray-900 text-gray-300 hover:bg-gray-800 active:bg-gray-700'
            } ${hasActiveBreak && item.id === 'timer' ? 'animate-pulse' : ''}`}
          >
            <div className="text-lg mb-0.5">{item.icon}</div>
            <div className="text-xs font-medium leading-tight">{item.label}</div>
            <div className="text-xs opacity-75 leading-tight">{item.description}</div>
            
            {/* Active indicator */}
            {currentView === item.id && (
              <div className="w-1 h-1 bg-white rounded-full mt-0.5"></div>
            )}
            
            {/* Active break indicator */}
            {hasActiveBreak && item.id === 'timer' && currentView !== 'timer' && (
              <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-0.5 animate-ping"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
