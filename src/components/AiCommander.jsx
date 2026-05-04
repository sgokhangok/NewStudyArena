import React from 'react';
import { Zap, ShieldCheck, PlayCircle } from 'lucide-react';
import { PomodoroCurtain } from './PomodoroCurtain'; 
import { useCommanderLogic } from './AiCommander/useCommanderLogic';
import { SetupScreen } from './AiCommander/SetupScreen';
import { FocusScreen } from './AiCommander/FocusScreen';
import { VictoryScreen } from './AiCommander/VictoryScreen';

export const AiCommander = () => {
  const { state, actions, pomodoro } = useCommanderLogic();

  return (
    // 🚀 DİREKTİF: ÇİVİLEME KODU MERKEZE YERLEŞTİRİLDİ
    <div className="flex items-center justify-center min-h-[100dvh] w-full bg-transparent overflow-hidden fixed inset-0 select-none">
      
      <PomodoroCurtain pomodoro={pomodoro.curtainAdapter} />

      {state.isStarted && !state.isCompleted && !state.isActive && state.mode === 'FOCUS' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
           <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 text-center drop-shadow-2xl">
             ODAKLANMA ZAMANI
           </h3>
           <p className="text-[#FDB912] font-mono text-xs tracking-[0.3em] uppercase mb-8">
             Derse başlamak için sayacı çalıştır
           </p>
           <button onClick={() => actions.startFocus()} className="bg-[#FDB912] text-black px-12 py-5 rounded-full font-black text-xl uppercase tracking-widest flex items-center gap-4 hover:scale-105 hover:bg-yellow-400 transition-all shadow-[0_0_50px_rgba(253,185,18,0.4)]">
             <PlayCircle size={28} /> SÜREYİ BAŞLAT
           </button>
        </div>
      )}

      {/* 🚀 MODÜLLERİN YERLEŞTİĞİ ALAN */}
      <div className="w-full max-w-[600px] p-4 md:p-8 flex flex-col items-center max-h-[100dvh] overflow-y-auto custom-scrollbar">
        
        <div className="w-full flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <Zap size={24} className="text-[#FDB912]" />
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">AI COMMANDER</h2>
          </div>
          <div className={`px-4 py-1.5 rounded-xl font-black text-[10px] flex items-center gap-2
            ${state.localDbUser?.sinif ? 'bg-[#FDB912] text-black shadow-[0_0_10px_rgba(253,185,18,0.2)]' : 'bg-white/5 text-gray-500'}`}>
            <ShieldCheck size={14} /> {state.localDbUser?.sinif ? `${state.localDbUser.sinif}. SINIF AKTİF` : "SİNYAL YOK"}
          </div>
        </div>

        <div className={`w-full bg-[#0A0A0A] border-2 rounded-[2.5rem] p-5 md:p-6 shadow-2xl transition-all relative z-10
          ${state.isReady && !state.isStarted ? 'border-[#FDB912]' : state.isCompleted ? 'border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.1)]' : 'border-white/5'}`}>
          
          {!state.isStarted ? (
            <SetupScreen state={state} actions={actions} />
          ) : state.isCompleted ? (
            <VictoryScreen state={state} actions={actions} />
          ) : (
            <FocusScreen state={state} actions={actions} pomodoro={pomodoro} />
          )}
          
        </div>
      </div>
      
    </div>
  );
};