import React, { useState, useEffect } from 'react';
import { ChevronLeft, AlertOctagon, CheckCircle2 } from 'lucide-react';

export const FocusScreen = ({ state, actions, pomodoro }) => {
  const { mode, formData, currentIdx, questions, totalQuestions, selectedAnswer, showFeedback } = state;
  const { handleAnswerSelect, handleStop, proceedToNextQuestion } = actions;
  const { formatTime, completedCycles, currentSetDisplay, remainingSetsForLongBreak } = pomodoro;

  // 2 Saniyelik Psikolojik Onay Kilidi
  const [lockTimer, setLockTimer] = useState(2);
  useEffect(() => {
    if (showFeedback) {
      setLockTimer(2);
      const interval = setInterval(() => setLockTimer((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
      return () => clearInterval(interval);
    }
  }, [showFeedback]);

  const currentQ = questions[currentIdx];

  return (
    <div className="animate-in zoom-in duration-500 flex flex-col items-center w-full">
      <div className="flex flex-col items-center mb-4 w-full px-2 text-center">
         <div className={`text-5xl font-black font-mono tracking-tighter mb-1 ${mode === 'FOCUS' ? 'text-[#FDB912]' : 'text-blue-500'}`}>
            {formatTime()}
         </div>
         <div className="flex flex-wrap justify-center gap-2 mb-2">
           <span className="bg-[#FDB912] text-black text-[9px] font-black px-2 py-0.5 rounded-md uppercase italic">{formData.courseName}</span>
           <span className="bg-white/10 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase italic">{formData.topic}</span>
         </div>
         
         <div className="text-[#FDB912] text-[8px] md:text-[10px] font-mono tracking-widest uppercase border border-[#FDB912]/30 bg-[#FDB912]/5 px-4 py-1.5 rounded-xl flex flex-wrap justify-center items-center gap-x-2 gap-y-1 w-full max-w-full shadow-[0_0_15px_rgba(253,185,18,0.05)]">
           <span className="whitespace-nowrap">TAMAMLANAN 4'LÜ DÖNGÜ: {completedCycles}</span>
           <span className="hidden md:inline opacity-30">•</span>
           <span className="whitespace-nowrap">SET: {currentSetDisplay}/4</span>
           <span className="hidden md:inline opacity-30">•</span>
           <span className="whitespace-nowrap">UZUN MOLAYA: SON {remainingSetsForLongBreak} SET</span>
         </div>
      </div>
      
      <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 mb-4 text-left relative overflow-hidden">
          <span className="text-gray-500 text-[9px] font-black tracking-widest block mb-2 uppercase">
            SORU {currentIdx + 1} / {questions?.length || totalQuestions}
          </span>
          <h3 className="text-white text-sm md:text-base font-bold italic leading-relaxed">
            {currentQ?.text}
          </h3>
      </div>

      <div className="grid grid-cols-1 gap-1.5 w-full mb-2">
         {currentQ?.options.map((opt, i) => {
           // Seçim yapıldıysa doğru ve yanlış şıkları renklendir
           const isSelected = selectedAnswer === i;
           const isCorrectOption = i === currentQ.correctOptionIndex;
           
           let btnStyle = 'bg-black/40 border-white/5 text-gray-400 hover:bg-white/5';
           if (selectedAnswer !== null) {
             if (isCorrectOption) btnStyle = 'bg-green-500/20 text-green-400 border-green-500';
             else if (isSelected) btnStyle = 'bg-red-500/20 text-red-400 border-red-500';
             else btnStyle = 'opacity-30 bg-black/40 border-white/5 text-gray-500';
           }

           return (
             <button key={i} onClick={() => handleAnswerSelect(i)} disabled={selectedAnswer !== null} 
              className={`border p-3.5 rounded-xl text-left text-sm font-bold transition-all flex items-center gap-4 ${btnStyle}`}
             >
               <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] shrink-0 ${isSelected ? 'bg-black/20' : 'bg-white/5'}`}>
                 {String.fromCharCode(65 + i)}
               </span>
               {opt}
             </button>
           );
         })}
      </div>

      {/* 🚀 AI TUTOR (ANINDA GERİ BİLDİRİM KARTI) */}
      {showFeedback && (
        <div className="w-full animate-in slide-in-from-bottom-4 duration-500 mt-2 mb-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-left relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-red-400">
              <AlertOctagon size={18} />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">AI Öğretmen Analizi</span>
            </div>
            <p className="text-white text-xs md:text-sm font-medium leading-relaxed mb-4">
              {currentQ?.cozumAnalizi || "Bu soruda bir hata yaptın. Konuyu tekrar gözden geçirmelisin."}
            </p>
            
            <button 
              onClick={proceedToNextQuestion}
              disabled={lockTimer > 0}
              className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                ${lockTimer > 0 ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-[#FDB912] text-black hover:bg-white hover:scale-[1.02]'}`}
            >
              <CheckCircle2 size={16} />
              {lockTimer > 0 ? `SİNDİRİLİYOR (${lockTimer} SN)` : "ANLADIM, YENİ SORUYA GEÇ"}
            </button>
          </div>
        </div>
      )}

      {!showFeedback && (
        <button onClick={handleStop} className="flex items-center gap-2 text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] hover:text-white transition-colors mt-4">
           <ChevronLeft size={16} /> OPERASYONU İPTAL ET
        </button>
      )}
    </div>
  );
};