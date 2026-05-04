import React from 'react';
import { Loader2, Cpu, Crosshair } from 'lucide-react';
import { POMODORO_PRESETS } from '../../hooks/useMasterPomodoro';

export const SetupScreen = ({ state, actions }) => {
  const { isGenerating, isAiLoading, errorToast, formData, selectedPreset, isReady } = state;
  const { setFormData, setSelectedPreset, handleLaunch } = actions;

  return (
    <div className="animate-in fade-in duration-500">
      {isGenerating || isAiLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="relative">
            <Cpu size={48} className="text-[#FDB912] animate-pulse" />
            <Loader2 size={64} className="absolute -top-2 -left-2 text-[#FDB912]/20 animate-spin" />
          </div>
          <p className="text-[#FDB912] font-black text-[10px] tracking-[0.4em] uppercase">
            {errorToast?.text ? "Sinyal Yenileniyor..." : "Gemini Soruları Hazırlıyor..."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[9px] font-black text-[#FDB912] uppercase tracking-widest ml-1">Hedef Ders</label>
              <input type="text" placeholder="Ders..." value={formData.courseName} onChange={(e)=>setFormData({...formData, courseName:e.target.value})} className="bg-black border border-white/10 text-white rounded-xl px-4 py-3 text-xs font-bold focus:border-[#FDB912] outline-none" />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Kritik Konu</label>
              <input type="text" placeholder="Konu..." value={formData.topic} onChange={(e)=>setFormData({...formData, topic:e.target.value})} className="bg-black border border-white/10 text-white rounded-xl px-4 py-3 text-xs font-bold focus:border-[#FDB912] outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {['easy', 'medium', 'hard'].map(lvl => (
              <div key={lvl} className="bg-black/50 border border-white/5 p-3 rounded-3xl flex flex-col items-center">
                <span className={`text-[8px] font-black uppercase mb-1 ${lvl==='easy'?'text-green-500':lvl==='medium'?'text-yellow-400':'text-red-400'}`}>{lvl}</span>
                <input type="number" min="0" max="12" value={formData[lvl]||''} onChange={(e)=>setFormData({...formData, [lvl]:e.target.value})} className="bg-transparent text-white text-center text-3xl font-black w-full outline-none" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-1 mb-6">
            {Object.keys(POMODORO_PRESETS).map(key => (
              <button key={key} onClick={()=>setSelectedPreset(key)} className={`py-2 rounded-xl border text-[9px] font-black transition-all ${selectedPreset===key?'bg-[#FDB912] text-black border-[#FDB912]':'bg-black border-white/5 text-gray-600'}`}>
                {POMODORO_PRESETS[key].label}
              </button>
            ))}
          </div>

          <button onClick={handleLaunch} disabled={!isReady} className={`w-full py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-4 tracking-[0.4em] ${isReady?'bg-[#FDB912] text-black shadow-xl hover:bg-white transition-all active:scale-95':'bg-white/5 text-gray-700 opacity-40'}`}>
            <Crosshair size={22} /> {isReady ? "OPERASYONU BAŞLAT" : "PARAMETRELERİ GİRİN"}
          </button>
        </>
      )}
    </div>
  );
};