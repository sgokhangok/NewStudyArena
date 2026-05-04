import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Square, LayoutGrid } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

export const MarathonFocusScreen = ({ questions, pomodoro, userAnswers, setUserAnswers, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const { timeLeft, mode, cycle } = pomodoro;

  const currentQ = questions[currentIdx];
  const totalQ = questions?.length || 0;

  const handleAnswerSelect = (optIndex) => setUserAnswers(prev => ({ ...prev, [currentIdx]: optIndex }));
  const handleNext = () => { if (currentIdx < totalQ - 1) setCurrentIdx(prev => prev + 1); };
  const handlePrev = () => { if (currentIdx > 0) setCurrentIdx(prev => prev - 1); };

  if (totalQ === 0) return null;

  return (
    // 🚀 DİKKAT: -mt-4 md:-mt-10 ile tüm ekranı yukarı çektik. Scroll problemi bitti, ferahlık geri geldi!
    <div className="flex flex-col items-center w-full animate-in zoom-in duration-500 -mt-4 md:-mt-10">

      {/* ⏱️ ÜST BİLGİ KRONOMETRE */}
      <div className="flex flex-col items-center mb-6 w-full px-2 text-center">
         <div className={`text-5xl md:text-6xl font-black font-mono tracking-tighter mb-2 ${mode === 'focus' ? 'text-[#FDB912]' : 'text-blue-500'}`}>
            {formatTime(timeLeft)}
         </div>
         <div className="flex flex-wrap justify-center gap-2 mb-3">
           <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-black px-4 py-1.5 rounded-md uppercase tracking-widest">
             {currentQ?.ders || "GENEL YETENEK"}
           </span>
         </div>
         <div className="text-[#FDB912] text-[10px] font-mono tracking-widest uppercase border border-[#FDB912]/30 bg-[#FDB912]/5 px-5 py-2 rounded-xl flex items-center gap-2">
           <span>TAMAMLANAN SET: {cycle > 1 ? cycle - 1 : 0}</span> <span className="opacity-30">•</span> <span>MEVCUT: {cycle || 1}/4</span>
         </div>
      </div>

      {/* 🗺️ ÖZGÜR GEZİNME RADARI */}
      <div className="w-full bg-[#111] border border-white/5 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3 text-gray-500">
          <LayoutGrid size={14} /> <span className="text-[10px] font-black tracking-[0.2em] uppercase">Soru Radarı</span>
        </div>
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
          {questions.map((_, i) => {
             const isAnswered = userAnswers[i] !== undefined && userAnswers[i] !== null;
             const isCurrent = i === currentIdx;
             return (
               <button key={i} onClick={() => setCurrentIdx(i)}
                 className={`w-10 h-10 shrink-0 rounded-xl text-sm font-black flex items-center justify-center transition-all border
                 ${isCurrent ? 'bg-[#FDB912] text-black border-[#FDB912] scale-110 shadow-[0_0_15px_rgba(253,185,18,0.4)]' :
                   isAnswered ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                   'bg-white/5 text-gray-500 border-white/10 hover:bg-white/10 hover:text-white'}`}
               >
                 {i + 1}
               </button>
             )
          })}
        </div>
      </div>

      {/* 📄 SORU ALANI */}
      <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mb-6 text-left relative overflow-hidden">
          <span className="text-gray-500 text-[10px] font-black tracking-widest block mb-3 uppercase">
            SORU {currentIdx + 1} / {totalQ}
          </span>
          <h3 className="text-white text-base md:text-lg font-bold italic leading-relaxed">
            {currentQ?.text}
          </h3>
      </div>

      {/* 🔘 ŞIKLAR */}
      <div className="grid grid-cols-1 gap-3 w-full mb-6">
         {currentQ?.options?.map((opt, i) => {
           const isSelected = userAnswers[currentIdx] === i;
           return (
             <button key={i} onClick={() => handleAnswerSelect(i)}
               className={`border p-4 md:p-5 rounded-2xl text-left text-sm md:text-base font-bold transition-all flex items-center gap-4 
                ${isSelected ? 'bg-[#FDB912]/20 text-[#FDB912] border-[#FDB912]' : 'bg-black/40 border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/20'}`}
             >
               <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] shrink-0 font-black 
                 ${isSelected ? 'bg-[#FDB912] text-black' : 'bg-white/10 text-gray-500'}`}>
                 {String.fromCharCode(65 + i)}
               </span>
               {opt}
             </button>
           );
         })}
      </div>

      {/* 🕹️ KONTROL PANELİ */}
      <div className="w-full flex items-center justify-between gap-4 mt-2">
        <button onClick={handlePrev} disabled={currentIdx === 0}
          className="flex-1 py-4 md:py-5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center gap-2 font-black text-xs tracking-widest uppercase transition-all">
          <ChevronLeft size={18} /> Önceki
        </button>

        {currentIdx === totalQ - 1 ? (
          <button onClick={onFinish}
            className="flex-1 py-4 md:py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all">
            <Square fill="currentColor" size={16} /> Sınavı Bitir
          </button>
        ) : (
          <button onClick={handleNext}
            className="flex-1 py-4 md:py-5 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-2 font-black text-xs tracking-widest uppercase transition-all">
             Sonraki <ChevronRight size={18} />
          </button>
        )}
      </div>

    </div>
  );
};