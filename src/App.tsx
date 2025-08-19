import { useState, useEffect } from 'react';
import SmokeTimer from './components/SmokeTimer';
import Settings from './components/Settings';
import BreakHistory from './components/BreakHistory';
import Navigation from './components/Navigation';
import type { View } from './components/Navigation';
import './App.css';

interface SmokeBreak {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  completed: boolean;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('timer');
  const [cigarettesPerDay, setCigarettesPerDay] = useState<number>(10);
  const [breakDuration, setBreakDuration] = useState<number>(5);
  const [breakHistory, setBreakHistory] = useState<SmokeBreak[]>([]);
  const [hasActiveBreak, setHasActiveBreak] = useState<boolean>(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedCigarettes = localStorage.getItem('cigarettesPerDay');
    const savedBreakDuration = localStorage.getItem('breakDuration');
    const savedHistory = localStorage.getItem('breakHistory');
    
    if (savedCigarettes) {
      setCigarettesPerDay(parseInt(savedCigarettes));
    }
    
    if (savedBreakDuration) {
      setBreakDuration(parseInt(savedBreakDuration));
    }
    
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory).map((smokeBreak: any) => ({
          ...smokeBreak,
          startTime: new Date(smokeBreak.startTime),
          endTime: new Date(smokeBreak.endTime)
        }));
        setBreakHistory(parsedHistory);
      } catch (error) {
        console.error('Failed to parse break history:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('cigarettesPerDay', cigarettesPerDay.toString());
    localStorage.setItem('breakDuration', breakDuration.toString());
  };

  // Handle break completion
  const handleBreakComplete = (smokeBreak: SmokeBreak) => {
    setBreakHistory(prev => {
      const newHistory = [...prev, smokeBreak];
      localStorage.setItem('breakHistory', JSON.stringify(newHistory));
      return newHistory;
    });
    setHasActiveBreak(false);
  };

  // Clear break history
  const clearHistory = () => {
    setBreakHistory([]);
    localStorage.removeItem('breakHistory');
  };

  // Handle cigarettes per day change
  const handleCigarettesChange = (count: number) => {
    setCigarettesPerDay(count);
  };

  // Handle break duration change
  const handleBreakDurationChange = (duration: number) => {
    setBreakDuration(duration);
  };



  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 shadow-lg flex-shrink-0 border-b border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-violet-400 text-center">
            🚬 Raucher-Simulator
          </h1>
          <p className="text-xs text-gray-400 text-center mt-1">
            Für Nichtraucher - Erlebe das Raucherleben ohne Nikotin!
          </p>
        </div>
      </header>

      {/* Main Content - Scrollable area */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <div className="max-w-md mx-auto">
          {/* View Content */}
          <div className="mb-4">
            {currentView === 'timer' && (
              <SmokeTimer
                cigarettesPerDay={cigarettesPerDay}
                breakDuration={breakDuration}
                onBreakComplete={handleBreakComplete}
              />
            )}
            
            {currentView === 'settings' && (
              <Settings
                cigarettesPerDay={cigarettesPerDay}
                breakDuration={breakDuration}
                onCigarettesChange={handleCigarettesChange}
                onBreakDurationChange={handleBreakDurationChange}
                onSave={saveSettings}
              />
            )}
            
            {currentView === 'history' && (
              <BreakHistory
                breaks={breakHistory}
                onClearHistory={clearHistory}
              />
            )}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-900 shadow-xl border border-gray-700 rounded-2xl overflow-hidden">
            <Navigation
              currentView={currentView}
              onViewChange={setCurrentView}
              hasActiveBreak={hasActiveBreak}
            />
          </div>
        </div>
      </div>

      {/* Footer - Hidden on mobile, shown on desktop */}
      <footer className="hidden md:block max-w-md mx-auto px-6 py-4 text-center">
        <p className="text-xs text-gray-500">
          🚬 Raucher-Simulator v1.0 | Für Nichtraucher gemacht
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Keine echten Zigaretten, nur Pausen! 😄
        </p>
      </footer>
    </div>
  );
}

export default App;
