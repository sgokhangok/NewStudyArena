import React from 'react';
import { Search, PlayCircle, MonitorPlay, Loader2, Timer, Pause, RotateCcw } from 'lucide-react';
import { eliteChannels } from '../../hooks/useYouTubeSearch';
import { POMODORO_PRESETS } from '../../hooks/useMasterPomodoro'; 

export const SearchPanel = ({
  dbUser, selectedDers, setSelectedDers, konu, setKonu,
  activeChannel, setActiveChannel, isLoading, onSearch,
  pomodoro // useMasterPomodoro'dan gelen ham veri
}) => {
  
  // 🚀 DİSİPLİN KİLİDİ RADARI: Oturum başlamışsa, süre eksilmişse veya moladaysa mod değiştirmeyi yasakla
  const isSessionStarted = 
    pomodoro.isActive || 
    pomodoro.mode !== 'FOCUS' || 
    pomodoro.completedSets > 0 || 
    pomodoro.timeLeft !== (pomodoro.currentPreset.focus * 60);

  return (
    <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col gap-6 border border-white/5 rounded-[2rem] bg-[#0A0A0A]/80 backdrop-blur-md p-8 shadow-2xl sticky top-10">
      
      {/* 🚀 MASTER POMODORO SAYAÇ ALANIN */}
      <div className="bg-black/50 border border-[#FDB912]/30 rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
           <Timer size={40} className="text-[#FDB912]" />
        </div>
        
        <label className="text-[10px] font-bold tracking-[0.2em] text-[#FDB912] uppercase mb-3 block">
          Master Pomodoro (Set: {pomodoro.completedSets})
        </label>
        
        <div className="flex items-end gap-4 mb-6">
          <span className="text-5xl font-mono font-black text-white tracking-tighter">
            {pomodoro.formatTime()}
          </span>
          <span className={`text-[10px] font-mono px-2 py-1 rounded border ${pomodoro.mode !== 'FOCUS' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-[#FDB912]/10 border-[#FDB912]/50 text-[#FDB912]'}`}>
            {pomodoro.mode === 'FOCUS' ? 'ODAK' : pomodoro.mode === 'SHORT_BREAK' ? 'KISA MOLA' : 'UZUN MOLA'}
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          {!pomodoro.isActive ? (
            <button onClick={pomodoro.startFocus} className="flex-1 bg-[#FDB912] text-black py-2 rounded-lg font-black text-[10px] uppercase flex items-center justify-center gap-2">
              <Timer size={14} /> BAŞLAT
            </button>
          ) : (
            <button onClick={pomodoro.pauseTimer} className="flex-1 bg-white/10 text-white py-2 rounded-lg font-black text-[10px] uppercase flex items-center justify-center gap-2">
              <Pause size={14} /> DURAKLAT
            </button>
          )}
          {/* Sıfırlama Butonu: Tıklandığında mevcut preseti tamamen sıfırlar ve kilitleri açar */}
          <button 
            onClick={() => pomodoro.initSession(Object.keys(POMODORO_PRESETS).find(k => POMODORO_PRESETS[k].id === pomodoro.currentPreset.id))} 
            className="px-4 bg-white/5 text-gray-400 py-2 rounded-lg hover:text-white hover:bg-red-500/20 transition-colors"
            title="Süreyi Sıfırla"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* SENİN POMODORO PRESETLERİN (MICRO, QUICK, STANDARD vs.) */}
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(POMODORO_PRESETS).map(key => {
            const preset = POMODORO_PRESETS[key];
            const isActivePreset = pomodoro.currentPreset.id === preset.id;
            
            return (
              <button 
                key={key}
                onClick={() => pomodoro.initSession(key)}
                disabled={isSessionStarted} // 🚀 KİLİT BURADA DEVREYE GİRİYOR
                className={`text-[9px] font-bold py-1.5 rounded border transition-all 
                  ${isActivePreset ? 'border-[#FDB912] text-[#FDB912] bg-[#FDB912]/5' : 'border-white/5 text-gray-500'}
                  ${isSessionStarted && !isActivePreset ? 'opacity-20 cursor-not-allowed' : ''}
                  ${!isSessionStarted && !isActivePreset ? 'hover:bg-white/5 cursor-pointer' : ''}
                `}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-black italic tracking-widest text-white uppercase flex items-center gap-3">
          <Search size={22} /> Arama Motoru
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <input 
          type="text" placeholder="Örn: Matematik, Fizik..." 
          className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:border-[#FDB912] outline-none transition-colors text-white"
          value={selectedDers} onChange={(e) => setSelectedDers(e.target.value)}
        />
        <input 
          type="text" placeholder="Örn: Çarpanlar ve Katlar..." 
          className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:border-[#FDB912] outline-none transition-colors text-white"
          value={konu} onChange={(e) => setKonu(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {eliteChannels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setActiveChannel(activeChannel === channel.id ? null : channel.id)}
            className={`p-4 rounded-xl border bg-black transition-all flex flex-col items-center justify-center gap-2 text-center
              ${activeChannel === channel.id ? channel.color + ' bg-white/5 scale-105 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'border-white/5 hover:bg-[#111] text-gray-400'}
            `}
          >
            <PlayCircle size={20} className={activeChannel === channel.id ? 'text-white' : 'text-gray-600'} />
            <span className="text-xs font-bold tracking-wider">{channel.name}</span>
          </button>
        ))}
      </div>

      <button 
        onClick={onSearch} disabled={isLoading}
        className="mt-4 w-full bg-[#FDB912] text-black font-black italic tracking-widest uppercase py-4 rounded-xl hover:bg-yellow-400 flex justify-center items-center gap-2 shadow-[0_0_30px_rgba(253,185,18,0.2)]"
      >
        {isLoading ? <><Loader2 size={18} className="animate-spin" /> FREKANS TARANIYOR</> : 'VİDEO BUL 🚀'}
      </button>
    </div>
  );
};