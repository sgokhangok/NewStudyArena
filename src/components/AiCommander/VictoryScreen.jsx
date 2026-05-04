import React from 'react';
import { Trophy, Zap, Target } from 'lucide-react';

export const VictoryScreen = ({ state, actions }) => {
  const { score, totalQuestions } = state;

  return (
    <div className="animate-in zoom-in duration-700 flex flex-col items-center justify-center py-8 text-center">
      <Trophy size={80} className="text-[#FDB912] mb-6 drop-shadow-[0_0_20px_rgba(253,185,18,0.5)] animate-bounce" />
      <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">GÖREV BAŞARILI</h2>
      
      {/* Skor Tablosu */}
      <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl mb-8 border border-white/10">
         <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">DOĞRU</span>
            <span className="text-2xl font-black text-green-500">{score.correct}</span>
         </div>
         <div className="w-px h-8 bg-white/10"></div>
         <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">YANLIŞ</span>
            <span className="text-2xl font-black text-red-500">{score.wrong}</span>
         </div>
         <div className="w-px h-8 bg-white/10"></div>
         <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">TOPLAM</span>
            <span className="text-2xl font-black text-[#FDB912]">{totalQuestions}</span>
         </div>
      </div>

      <button onClick={actions.handleStop} className="bg-[#FDB912] text-black px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.3em] hover:bg-white hover:scale-105 transition-all shadow-xl shadow-[#FDB912]/20 flex items-center gap-3">
        <Zap size={20} /> YENİ GÖREV AL
      </button>
    </div>
  );
};