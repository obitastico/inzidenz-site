import React, { useState, useEffect } from 'react';

interface SettingsProps {
  cigarettesPerDay: number;
  breakDuration: number;
  onCigarettesChange: (count: number) => void;
  onBreakDurationChange: (duration: number) => void;
  onSave: () => void;
}

const Settings: React.FC<SettingsProps> = ({ cigarettesPerDay, breakDuration, onCigarettesChange, onBreakDurationChange, onSave }) => {
  const [localCigarettes, setLocalCigarettes] = useState(cigarettesPerDay);
  const [localBreakDuration, setLocalBreakDuration] = useState(breakDuration);
  const [usePacks, setUsePacks] = useState(false);

  // Convert between cigarettes and packs (assuming 20 cigarettes per pack)
  const CIGARETTES_PER_PACK = 20;
  
  const cigarettesToPacks = (cigarettes: number): number => {
    return Math.round((cigarettes / CIGARETTES_PER_PACK) * 10) / 10; // Round to 1 decimal
  };
  
  const packsToCigarettes = (packs: number): number => {
    return Math.round(packs * CIGARETTES_PER_PACK);
  };

  // Update local state when props change
  useEffect(() => {
    setLocalCigarettes(cigarettesPerDay);
  }, [cigarettesPerDay]);

  useEffect(() => {
    setLocalBreakDuration(breakDuration);
  }, [breakDuration]);

  const handleSave = () => {
    onCigarettesChange(localCigarettes);
    onBreakDurationChange(localBreakDuration);
    onSave();
  };

  const handleCigarettesChange = (value: number) => {
    setLocalCigarettes(value);
  };

  const handlePacksChange = (packs: number) => {
    const cigarettes = packsToCigarettes(packs);
    setLocalCigarettes(cigarettes);
  };

  const handleBreakDurationChange = (duration: number) => {
    setLocalBreakDuration(duration);
  };

  const getSmokerType = (count: number): string => {
    if (count <= 5) return 'Gelegenheitsraucher';
    if (count <= 10) return 'Leichtraucher';
    if (count <= 20) return 'Starkraucher';
    return 'Kettenraucher';
  };

  const getTimeBetweenBreaks = (count: number): number => {
    const activeHours = 16;
    const totalMinutes = activeHours * 60;
    return Math.floor(totalMinutes / count);
  };

  const currentPacks = cigarettesToPacks(localCigarettes);

  return (
    <div className="w-full p-3 bg-gray-900 rounded-lg shadow-lg border border-gray-800">
      <h2 className="text-2xl font-bold text-violet-400 mb-4 text-center">
        ⚙️ Einstellungen
      </h2>

      <div className="space-y-4">
        {/* Unit Toggle */}
        <div className="flex justify-center">
          <div className="bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setUsePacks(false)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[40px] ${
                !usePacks
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white active:bg-gray-700'
              }`}
            >
              🚬 Zigaretten
            </button>
            <button
              onClick={() => setUsePacks(true)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[40px] ${
                usePacks
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white active:bg-gray-700'
              }`}
            >
              📦 Schachteln
            </button>
          </div>
        </div>

        {/* Cigarettes per day slider */}
        {!usePacks && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Zigaretten pro Tag: {localCigarettes}
            </label>
            <input
              type="range"
              min="1"
              max="40"
              value={localCigarettes}
              onChange={(e) => handleCigarettesChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
            </div>
            <div className="text-sm text-gray-400 mt-1 text-center">
              ≈ {currentPacks} Schachtel{currentPacks !== 1 ? 'n' : ''} pro Tag
            </div>
          </div>
        )}

        {/* Packs per day slider */}
        {usePacks && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Schachteln pro Tag: {currentPacks}
            </label>
            <input
              type="range"
              min="0.1"
              max="4"
              step="0.1"
              value={currentPacks}
              onChange={(e) => handlePacksChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0.1</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>
            <div className="text-sm text-gray-400 mt-1 text-center">
              ≈ {localCigarettes} Zigarette{localCigarettes !== 1 ? 'n' : ''} pro Tag
            </div>
          </div>
        )}

        {/* Break duration slider */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Pausenlänge: {localBreakDuration} Minuten
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={localBreakDuration}
            onChange={(e) => handleBreakDurationChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
          </div>
        </div>

        {/* Smoker type display */}
        <div className="p-3 bg-gray-800 rounded-lg">
          <h3 className="font-semibold text-gray-300 mb-1 text-sm">
            🏷️ Rauchertyp
          </h3>
          <p className="text-lg font-bold text-violet-400">
            {getSmokerType(localCigarettes)}
          </p>
        </div>

        {/* Break statistics */}
        <div className="p-3 bg-violet-900/30 rounded-lg border border-violet-700">
          <h3 className="font-semibold text-violet-400 mb-2 text-sm">
            📊 Pausen-Statistiken
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Pausenlänge:</span>
              <span className="font-semibold text-violet-300">{localBreakDuration} Min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Intervall:</span>
              <span className="font-semibold text-violet-300">~{getTimeBetweenBreaks(localCigarettes)} Min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Pausen pro Tag:</span>
              <span className="font-semibold text-violet-300">{localCigarettes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Gesamtzeit:</span>
              <span className="font-semibold text-violet-300">{localCigarettes * localBreakDuration} Min</span>
            </div>
          </div>
        </div>

        {/* Preset buttons */}
        <div>
          <h3 className="font-semibold text-gray-300 mb-2 text-sm">
            🎯 Voreinstellungen
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleCigarettesChange(5)}
              className="p-2 text-sm bg-green-900/50 hover:bg-green-800/50 active:bg-green-700/50 text-green-300 rounded-lg transition-colors min-h-[40px] border border-green-700"
            >
              Gelegenheitsraucher (5)
            </button>
            <button
              onClick={() => handleCigarettesChange(10)}
              className="p-2 text-sm bg-yellow-900/50 hover:bg-yellow-800/50 active:bg-yellow-700/50 text-yellow-300 rounded-lg transition-colors min-h-[40px] border border-yellow-700"
            >
              Leichtraucher (10)
            </button>
            <button
              onClick={() => handleCigarettesChange(20)}
              className="p-2 text-sm bg-orange-900/50 hover:bg-orange-800/50 active:bg-orange-700/50 text-orange-300 rounded-lg transition-colors min-h-[40px] border border-orange-700"
            >
              Starkraucher (20)
            </button>
            <button
              onClick={() => handleCigarettesChange(30)}
              className="p-2 text-sm bg-red-900/50 hover:bg-red-800/50 active:bg-red-700/50 text-red-300 rounded-lg transition-colors min-h-[40px] border border-red-700"
            >
              Kettenraucher (30)
            </button>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white py-3 px-4 rounded-lg font-medium transition-colors text-sm min-h-[40px]"
        >
          💾 Einstellungen speichern
        </button>
      </div>
    </div>
  );
};

export default Settings;
