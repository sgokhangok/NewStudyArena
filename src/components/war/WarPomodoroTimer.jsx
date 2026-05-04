import React from 'react';
import { Clock, Play, Pause, AlertTriangle } from 'lucide-react';

export const WarPomodoroTimer = ({ pomodoro }) => {
  // 🚀 DÜZELTME: Tamamen senin orijinal motorunun değişkenleri çağrıldı
  const { timeLeft, isActive, startFocus, pauseTimer, mode, formatTime, completedSets } = pomodoro;

  // Senin motorunda tek bir tetikleyici olmadığı için başlat/durdur köprüsü
  const handleToggle = () => {
    if (isActive) {
      pauseTimer();
    } else {
      startFocus();
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute -inset-10 bg-[#FDB912]/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Clock className={`${isActive ? 'text-[#FDB912] animate-pulse' : 'text-gray-500'}`} size={20} />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">
            {mode === 'FOCUS' ? 'ODAK MODU' : 'MOLA ZAMANI'}
          </span>
        </div>
        <div className="text-[10px] font-mono text-[#FDB912] border border-[#FDB912]/30 px-2 py-1 rounded bg-[#FDB912]/10">
          SET: {completedSets + 1}
        </div>
      </div>

      <div className="flex items-end justify-between relative z-10">
        {/* 🚀 DÜZELTME: Senin formatTime fonksiyonun argüman beklemediği için içi boş bırakıldı */}
        <div className={`text-6xl font-black tabular-nums tracking-tighter leading-none ${isActive ? 'text-white' : 'text-gray-500'}`}>
          {formatTime()}
        </div>
        
        <button 
          onClick={handleToggle}
          className={`p-4 rounded-xl transition-all ${
            isActive 
              ? 'bg-white/10 text-white hover:bg-white/20' 
              : 'bg-[#FDB912] text-black shadow-[0_0_20px_rgba(253,185,18,0.3)] hover:scale-105'
          }`}
        >
          {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
      </div>

      {!isActive && timeLeft !== 0 && (
        <div className="mt-4 flex items-center gap-2 text-red-500/80 text-[10px] font-black tracking-widest uppercase bg-red-500/10 p-2 rounded border border-red-500/20">
          <AlertTriangle size={12} /> Zamanlayıcı Duraklatıldı
        </div>
      )}
    </div>
  );
};