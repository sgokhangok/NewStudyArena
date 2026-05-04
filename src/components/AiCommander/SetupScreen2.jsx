/**
 * AiCommander2 - SetupScreen2.jsx
 * V11 Projesi - Side-by-Side Migration
 * Özellik: Manuel Up/Down Kontrolleri & 12 Soru Kilidi
 */

import React from 'react';
import { Loader2, Cpu, Crosshair, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { POMODORO_PRESETS } from '../../hooks/useMasterPomodoro';
import { useCommanderLogic2 } from './useCommanderLogic2';

export const SetupScreen2 = () => {
  // V2 Beyin Katmanına Bağlanıyoruz
  const { state, actions } = useCommanderLogic2();
  
  const { 
    isGenerating, isAiLoading, errorToast, formData, 
    selectedPreset, isReady, aiLevelLabel 
  } = state;

  const { 
    setFormData, setSelectedPreset, handleLaunch,
    incrementQuestions, decrementQuestions,
    incrementLevel, decrementLevel 
  } = actions;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      {isGenerating || isAiLoading ? (
        /* Yükleme Ekranı - V1 Estetiği Korundu */
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="relative">
            <Cpu size={48} className="text-[#FDB912] animate-pulse" />
            <Loader2 size={64} className="absolute -top-2 -left-2 text-[#FDB912]/20 animate-spin" />
          </div>
          <p className="text-[#FDB912] font-black text-[10px] tracking-[0.4em] uppercase text-center">
            {errorToast?.text ? "Sinyal Yenileniyor..." : "AiCommander2 Maratona Hazırlanıyor..."}
          </p>
        </div>
      ) : (
        <>
          {/* V2 Branding Tag */}
          <div className="flex justify-center mb-4">
            <span className="bg-[#FDB912] text-black text-[8px] font-black px-3 py-1 rounded-full tracking-widest">
              AICOMMANDER V2.0 / MARATHON MODE
            </span>
          </div>

          {/* Ders ve Konu Inputları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[9px] font-black text-[#FDB912] uppercase tracking-widest ml-1 text-shadow-glow">Hedef Ders</label>
              <input 
                type="text" 
                placeholder="Ders..." 
                value={formData.courseName} 
                onChange={(e)=>setFormData({...formData, courseName:e.target.value})} 
                className="bg-black border border-white/10 text-white rounded-xl px-4 py-3 text-xs font-bold focus:border-[#FDB912] transition-all outline-none" 
              />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Kritik Konu</label>
              <input 
                type="text" 
                placeholder="Konu..." 
                value={formData.topic} 
                onChange={(e)=>setFormData({...formData, topic:e.target.value})} 
                className="bg-black border border-white/10 text-white rounded-xl px-4 py-3 text-xs font-bold focus:border-[#FDB912] transition-all outline-none" 
              />
            </div>
          </div>

          {/* V2 ÖZEL: UP/DOWN KONTROL MERKEZİ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            
            {/* Soru Sayısı Ayarı (Maks 12) */}
            <div className="bg-black/40 border border-white/5 p-4 rounded-3xl flex flex-col items-center group hover:border-[#FDB912]/30 transition-all">
              <span className="text-[9px] font-black uppercase mb-3 text-gray-500 tracking-tighter">Soru Kapasitesi</span>
              <div className="flex items-center justify-between w-full px-4">
                <button onClick={decrementQuestions} className="p-2 bg-white/5 hover:bg-red-500/20 rounded-full text-white transition-colors">
                  <Minus size={18} />
                </button>
                <span className="text-4xl font-black text-white">{formData.questionCount}</span>
                <button onClick={incrementQuestions} className="p-2 bg-white/5 hover:bg-green-500/20 rounded-full text-white transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              <span className="text-[7px] font-bold text-white/20 mt-2 uppercase tracking-widest">Limit: 12 Soru</span>
            </div>

            {/* AI Seviye Ayarı (Manuel Seviye) */}
            <div className="bg-black/40 border border-white/5 p-4 rounded-3xl flex flex-col items-center group hover:border-[#FDB912]/30 transition-all">
              <span className="text-[9px] font-black uppercase mb-3 text-gray-500 tracking-tighter">AI Zorluk Seviyesi</span>
              <div className="flex items-center justify-between w-full px-4">
                <button onClick={decrementLevel} className="p-2 bg-white/5 hover:bg-[#FDB912]/20 rounded-full text-white transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <span className={`text-xl font-black uppercase tracking-tighter ${
                  aiLevelLabel === 'Zor' ? 'text-red-500' : aiLevelLabel === 'Orta' ? 'text-yellow-400' : 'text-green-500'
                }`}>
                  {aiLevelLabel}
                </span>
                <button onClick={incrementLevel} className="p-2 bg-white/5 hover:bg-[#FDB912]/20 rounded-full text-white transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
              <span className="text-[7px] font-bold text-white/20 mt-2 uppercase tracking-widest">Öğrenci Kontrollü</span>
            </div>

          </div>

          {/* Pomodoro Presetleri */}
          <div className="grid grid-cols-5 gap-1.5 mb-6">
            {Object.keys(POMODORO_PRESETS).map(key => (
              <button 
                key={key} 
                onClick={()=>setSelectedPreset(key)} 
                className={`py-2 rounded-xl border text-[8px] font-black transition-all ${
                  selectedPreset===key ? 'bg-[#FDB912] text-black border-[#FDB912] shadow-[0_0_15px_rgba(253,185,18,0.3)]' : 'bg-black border-white/5 text-gray-600 hover:text-white'
                }`}
              >
                {POMODORO_PRESETS[key].label}
              </button>
            ))}
          </div>

          {/* Operasyon Başlat Butonu */}
          <button 
            onClick={handleLaunch} 
            disabled={!isReady} 
            className={`w-full py-5 rounded-2xl font-black uppercase flex items-center justify-center gap-4 tracking-[0.4em] text-sm transition-all active:scale-95 shadow-2xl ${
              isReady 
              ? 'bg-[#FDB912] text-black hover:bg-white hover:shadow-[#FDB912]/20' 
              : 'bg-white/5 text-gray-700 opacity-30 grayscale cursor-not-allowed'
            }`}
          >
            <Crosshair size={22} className={isReady ? "animate-spin-slow" : ""} /> 
            {isReady ? "MARATONU BAŞLAT" : "PARAMETRELERİ GİRİN"}
          </button>
        </>
      )}
    </div>
  );
};