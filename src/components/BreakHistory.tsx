import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface SmokeBreak {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  completed: boolean;
}

interface BreakHistoryProps {
  breaks: SmokeBreak[];
  onClearHistory: () => void;
}

const BreakHistory: React.FC<BreakHistoryProps> = ({ breaks, onClearHistory }) => {
  const completedBreaks = breaks.filter(smokeBreak => smokeBreak.completed);
  const skippedBreaks = breaks.filter(smokeBreak => !smokeBreak.completed);

  const formatDateTime = (date: Date): string => {
    return format(date, 'HH:mm', { locale: de });
  };

  const formatDate = (date: Date): string => {
    return format(date, 'dd.MM.yyyy', { locale: de });
  };

  const getTotalBreakTime = (): number => {
    return completedBreaks.reduce((total, smokeBreak) => total + smokeBreak.duration, 0);
  };

  const getCompletionRate = (): number => {
    if (breaks.length === 0) return 0;
    return Math.round((completedBreaks.length / breaks.length) * 100);
  };

  return (
    <div className="w-full p-3 bg-gray-900 rounded-lg shadow-lg border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-violet-400">
          📊 Pausen-Historie
        </h2>
        {breaks.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            🗑️ Löschen
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-2 bg-green-900/30 rounded-lg text-center border border-green-700">
          <div className="text-2xl font-bold text-green-400">{completedBreaks.length}</div>
          <div className="text-sm text-green-300">Abgeschlossen</div>
        </div>
        <div className="p-2 bg-violet-900/30 rounded-lg text-center border border-violet-700">
          <div className="text-2xl font-bold text-violet-400">{skippedBreaks.length}</div>
          <div className="text-sm text-violet-300">Übersprungen</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-2 bg-violet-900/30 rounded-lg text-center border border-violet-700">
          <div className="text-lg font-bold text-violet-400">{getTotalBreakTime()} min</div>
          <div className="text-sm text-violet-300">Gesamtzeit</div>
        </div>
        <div className="p-2 bg-purple-900/30 rounded-lg text-center border border-purple-700">
          <div className="text-lg font-bold text-purple-400">{getCompletionRate()}%</div>
          <div className="text-sm text-purple-300">Erfolgsrate</div>
        </div>
      </div>

      {/* Break list */}
      {breaks.length === 0 ? (
        <div className="text-center py-6 text-gray-400">
          <div className="text-4xl mb-2">🚬</div>
          <p className="text-base">Noch keine Pausen aufgezeichnet</p>
          <p className="text-sm">Starte deine erste Raucherpause!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {breaks.slice().reverse().map((smokeBreak) => (
            <div
              key={smokeBreak.id}
              className={`p-2 rounded-lg border ${
                smokeBreak.completed
                  ? 'bg-green-900/30 border-green-700'
                  : 'bg-violet-900/30 border-violet-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      smokeBreak.completed ? 'text-green-400' : 'text-violet-400'
                    }`}>
                      {smokeBreak.completed ? '✅' : '❌'} {formatDateTime(smokeBreak.startTime)}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({smokeBreak.duration} min)
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {formatDate(smokeBreak.startTime)}
                  </div>
                </div>
                <div className={`text-sm px-2 py-1 rounded-full ${
                  smokeBreak.completed
                    ? 'bg-green-800 text-green-300'
                    : 'bg-violet-800 text-violet-300'
                }`}>
                  {smokeBreak.completed ? 'Abgeschlossen' : 'Übersprungen'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {breaks.length > 0 && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <h3 className="font-semibold text-gray-300 mb-2 text-base">📈 Zusammenfassung</h3>
          <div className="text-sm text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Gesamtpausen:</span>
              <span className="font-medium text-gray-300">{breaks.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Erfolgreich abgeschlossen:</span>
              <span className="font-medium text-green-400">{completedBreaks.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Übersprungen:</span>
              <span className="font-medium text-violet-400">{skippedBreaks.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Durchschnittliche Pausenlänge:</span>
              <span className="font-medium text-violet-400">
                {breaks.length > 0 
                  ? Math.round(breaks.reduce((sum, smokeBreak) => sum + smokeBreak.duration, 0) / breaks.length)
                  : 0} min
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakHistory;
