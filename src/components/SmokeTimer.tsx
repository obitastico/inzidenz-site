import React, { useState, useEffect, useCallback } from 'react';
import { format, addMinutes, differenceInMinutes } from 'date-fns';
import { de } from 'date-fns/locale';

interface SmokeBreak {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  completed: boolean;
}

interface SmokeTimerProps {
  cigarettesPerDay: number;
  breakDuration: number;
  onBreakComplete: (smokeBreak: SmokeBreak) => void;
}

const SmokeTimer: React.FC<SmokeTimerProps> = ({ cigarettesPerDay, breakDuration, onBreakComplete }) => {
  const [currentBreak, setCurrentBreak] = useState<SmokeBreak | null>(null);
  const [nextBreak, setNextBreak] = useState<SmokeBreak | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Calculate time between breaks (assuming 16 hour day)
  const getTimeBetweenBreaks = useCallback((cigarettesPerDay: number): number => {
    const activeHours = 16; // 8 hours sleep
    const totalMinutes = activeHours * 60;
    return Math.floor(totalMinutes / cigarettesPerDay);
  }, []);

  // Generate next break
  const generateNextBreak = useCallback(() => {
    const now = new Date();
    const timeBetween = getTimeBetweenBreaks(cigarettesPerDay);
    
    const startTime = addMinutes(now, timeBetween);
    const endTime = addMinutes(startTime, breakDuration);
    
    return {
      id: `break-${Date.now()}`,
      startTime,
      endTime,
      duration: breakDuration,
      completed: false
    };
  }, [cigarettesPerDay, breakDuration, getTimeBetweenBreaks]);

  // Start a break
  const startBreak = useCallback(() => {
    if (!nextBreak) return;
    
    setCurrentBreak(nextBreak);
    setIsActive(true);
    setTimeLeft(nextBreak.duration * 60); // Convert to seconds
    setNextBreak(null);
  }, [nextBreak]);

  // Complete current break
  const completeBreak = useCallback(() => {
    if (!currentBreak) return;
    
    const completedBreak = { ...currentBreak, completed: true };
    onBreakComplete(completedBreak);
    
    setCurrentBreak(null);
    setIsActive(false);
    setTimeLeft(0);
    
    // Generate next break
    const newNextBreak = generateNextBreak();
    setNextBreak(newNextBreak);
  }, [currentBreak, onBreakComplete, generateNextBreak]);

  // Skip current break
  const skipBreak = useCallback(() => {
    if (!currentBreak) return;
    
    const skippedBreak = { ...currentBreak, completed: false };
    onBreakComplete(skippedBreak);
    
    setCurrentBreak(null);
    setIsActive(false);
    setTimeLeft(0);
    
    // Generate next break
    const newNextBreak = generateNextBreak();
    setNextBreak(newNextBreak);
  }, [currentBreak, onBreakComplete, generateNextBreak]);

  // Timer effect
  useEffect(() => {
    let interval: number;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            completeBreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, completeBreak]);

  // Initialize first break
  useEffect(() => {
    if (!nextBreak && !currentBreak) {
      const firstBreak = generateNextBreak();
      setNextBreak(firstBreak);
    }
  }, [nextBreak, currentBreak, generateNextBreak]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (date: Date): string => {
    return format(date, 'HH:mm', { locale: de });
  };

  return (
    <div className="w-full p-3 bg-gray-900 rounded-lg shadow-lg border border-gray-800">
      {/* Current Break */}
      {currentBreak && (
        <div className="mb-4 p-3 bg-violet-900/30 border border-violet-700 rounded-lg">
          <h3 className="text-lg font-semibold text-violet-400 mb-2 text-center">
            🚬 Aktuelle Pause
          </h3>
          <div className="text-center mb-3">
            <div className="text-4xl font-bold text-violet-400 mb-1">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-violet-300">
              {formatDateTime(currentBreak.startTime)} - {formatDateTime(currentBreak.endTime)}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={completeBreak}
              className="flex-1 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white py-2 px-3 rounded-lg font-medium transition-colors text-sm min-h-[40px]"
            >
              Beenden
            </button>
            <button
              onClick={skipBreak}
              className="flex-1 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white py-2 px-3 rounded-lg font-medium transition-colors text-sm min-h-[40px]"
            >
              Überspringen
            </button>
          </div>
        </div>
      )}

      {/* Next Break */}
      {nextBreak && !currentBreak && (
        <div className="mb-4 p-3 bg-violet-900/30 border border-violet-700 rounded-lg">
          <h3 className="text-lg font-semibold text-violet-400 mb-2 text-center">
            ⏰ Nächste Pause
          </h3>
          <div className="text-center mb-3">
            <div className="text-3xl font-bold text-violet-400 mb-1">
              {formatDateTime(nextBreak.startTime)}
            </div>
            <div className="text-sm text-violet-300">
              {nextBreak.duration} Min
            </div>
          </div>
          <button
            onClick={startBreak}
            className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white py-2 px-3 rounded-lg font-medium transition-colors text-sm min-h-[40px]"
          >
            Pause starten
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="text-center text-sm text-gray-300 space-y-0.5">
        <p>{cigarettesPerDay} Zigaretten/Tag • {breakDuration} Min Pause • ~{getTimeBetweenBreaks(cigarettesPerDay)} Min Intervall</p>
      </div>
    </div>
  );
};

export default SmokeTimer;
