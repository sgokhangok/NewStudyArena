import React from 'react';
import { Clock, Crosshair, Target, Zap } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

export const PomodoroHeader = ({ pomodoro, examStatus, activePomoMode, setActivePomoMode, pomoConfigs }) => {
  const { timeLeft, mode, cycle } = pomodoro;
  const activeConfig = pomoConfigs[activePomoMode];

  // 🚀 RADAR TAHMİN VE SÜRE HESAPLAMALARI
  const setsUntilLongBreak = cycle % 4 === 0 ? 0 : 4 - (cycle % 4);
  
  let nextPhaseStr = '🧠 ODAK';
  let nextPhaseDuration = activeConfig.focusTime;
  
  if (mode === 'focus') {
    if (cycle % 4 === 0) {
      nextPhaseStr = '🎉 UZUN MOLA';
      nextPhaseDuration = activeConfig.longBreak;
    } else {
      nextPhaseStr = '☕ KISA MOLA';
      nextPhaseDuration = activeConfig.shortBreak;
    }
  }

  const getStyle = () => {
    if (mode === 'focus') return { bg: 'bg-red-500/10 border-red-500/40', text: 'text-red-500', label: '🧠 ODAK ZAMANI' };
    if (mode === 'shortBreak') return { bg: 'bg-blue-500/10 border-blue-500/40', text: 'text-blue-400', label: '☕ KISA MOLA' };
    return { bg: 'bg-green-500/10 border-green-500/40', text: 'text-green-400', label: '🎉 UZUN MOLA' };
  };
  const style = getStyle();

  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between bg-[#111] border border-white/10 rounded-2xl p-3 gap-4">
      
      {/* 🟢 SOL: SAAT VE ANLIK DURUM */}
      <div className={`flex items-center gap-4 px-4 py-2 rounded-xl border transition-colors ${style.bg}`}>
        <div className="flex flex-col items-center justify-center min-w-[80px]">
          <span className="text-3xl font-black text-white font-mono tracking-tighter leading-none">
            {formatTime(timeLeft)}
          </span>
          <span className={`text-[10px] font-black tracking-widest mt-1 uppercase ${style.text}`}>
            {style.label}
          </span>
        </div>
      </div>

      {/* 🟡 ORTA: RADAR PANELİ (Süreler Estetik Bir Şekilde Eklendi) */}
      <div className="flex flex-1 items-center justify-center gap-6 px-4">
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">Mevcut Set</span>
          <span className="text-sm font-black text-white tracking-widest">{cycle} / 4</span>
          <span className="text-[9px] text-[#FDB912] font-black mt-1 tracking-widest uppercase">({activeConfig.focusTime} Dk Odak)</span>
        </div>
        <div className="w-px h-10 bg-white/10"></div>
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">Sıradaki Aşama</span>
          <span className="text-sm font-black text-yellow-400 tracking-widest">{nextPhaseStr}</span>
          <span className="text-[9px] text-gray-400 font-black mt-1 tracking-widest uppercase">({nextPhaseDuration} Dakika)</span>
        </div>
        <div className="w-px h-10 bg-white/10"></div>
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">Büyük Molaya</span>
          <span className="text-sm font-black text-green-400 tracking-widest">{setsUntilLongBreak} Set Kaldı</span>
          <span className="text-[9px] text-green-500/70 font-black mt-1 tracking-widest uppercase">(Ödül: {activeConfig.longBreak} Dk)</span>
        </div>
      </div>

      {/* 🔴 SAĞ: VİTES KUTUSU (Premium görünümü bozulmadan korundu) */}
      {examStatus === 'IDLE' ? (
        <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-xl border border-white/5">
          {Object.values(pomoConfigs).map(conf => (
            <button
              key={conf.id}
              onClick={() => setActivePomoMode(conf.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all ${
                activePomoMode === conf.id 
                  ? 'bg-[#FDB912] text-black shadow-[0_0_10px_rgba(253,185,18,0.3)]' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {conf.id === 'turbo' && <Zap size={14} />}
              {conf.id === 'klasik' && <Target size={14} />}
              {conf.id === 'derin' && <Crosshair size={14} />}
              {conf.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 px-6 py-2 bg-red-500/20 text-red-400 rounded-xl animate-pulse font-black tracking-widest text-xs border border-red-500/30">
          <Clock size={16} /> GİZLİ KRONOMETRE AKTİF
        </div>
      )}
    </div>
  );
};