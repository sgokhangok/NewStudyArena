import React from 'react';
import { Clock, Rocket, ChevronRight } from 'lucide-react';
// Sadece senin orijinal motorundan veri çekiyoruz
import { POMODORO_PRESETS } from '../hooks/useMasterPomodoro';

export const PomodoroSelector = ({ selectedTest, selectedPomodoroKey, setSelectedPomodoroKey, handleStartBattle }) => {
  // Motorundaki PRESETS objesini butonlara çeviriyoruz
  const pomodoroOptions = Object.entries(POMODORO_PRESETS).map(([key, value]) => ({
    presetKey: key,
    timeLabel: value.label
  }));

  return (
    <div className="mt-auto pt-6 border-t border-white/10 relative">
      <label className="flex items-center gap-2 text-[#FDB912] text-xs font-black tracking-widest uppercase mb-4">
        <Clock className="w-4 h-4" /> ZAMAN DİSİPLİNİ (POMODORO)
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 relative z-10">
        {pomodoroOptions.map((opt) => (
          <button
            key={opt.presetKey}
            onClick={() => setSelectedPomodoroKey(opt.presetKey)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              selectedPomodoroKey === opt.presetKey
                ? 'bg-[#FDB912] border-[#FDB912] text-black shadow-[0_0_15px_rgba(253,185,18,0.3)]'
                : 'bg-[#050505] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
            }`}
          >
            <span className="text-[10px] font-black tracking-widest uppercase mb-1">{opt.presetKey} SET</span>
            <span className="text-sm font-bold font-mono">{opt.timeLabel}</span>
          </button>
        ))}
      </div>

      <button 
        onClick={handleStartBattle}
        disabled={!selectedTest || !selectedPomodoroKey}
        className={`w-full p-5 rounded-xl flex items-center justify-center gap-3 text-lg font-black italic tracking-widest uppercase transition-all relative z-10 ${
          selectedTest && selectedPomodoroKey
            ? 'bg-[#FDB912] text-black shadow-[0_0_30px_rgba(253,185,18,0.2)] hover:scale-[1.02]'
            : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
        }`}
      >
        <Rocket className="w-6 h-6" />
        SAVAŞI BAŞLAT
        {selectedTest && selectedPomodoroKey && <ChevronRight className="w-6 h-6" />}
      </button>
    </div>
  );
};