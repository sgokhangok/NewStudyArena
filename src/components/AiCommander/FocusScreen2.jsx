/**
 * AiCommander2 - FocusScreen2.jsx (MARATHON SAHASI - MULTI-TAB MODU)
 * - Kitapçıklar (Branşlar) arası anında atlama (Shortcut).
 * - DEHB dostu Optik Palet (Görsel Navigasyon Izgarası).
 * - Cevap vermeden atlama özgürlüğü (Turlama Taktiği).
 */

import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export const FocusScreen2 = ({ state, actions, pomodoro }) => {
  const { 
    questions, 
    currentIdx, 
    userAnswers, 
    formData, 
    aiLevelLabel,
    bookletMap
  } = state;
  
  const { 
    handleAnswerSelect, 
    handleNext, 
    handlePrev, 
    handleStop,
    handleJump
  } = actions;

  const timeValue = pomodoro?.timeLeft !== undefined ? pomodoro.timeLeft : 1500;
  const minutes = Math.floor(timeValue / 60).toString().padStart(2, '0');
  const seconds = (timeValue % 60).toString().padStart(2, '0');
  const formattedTime = `${minutes}:${seconds}`;

  useEffect(() => {
    if (pomodoro && pomodoro.startTimer && !pomodoro.isActive) {
      pomodoro.startTimer();
    }
  }, [pomodoro]);

  if (!questions || questions.length === 0) return <div className="text-white p-4 font-black animate-pulse">Saha Hazırlanıyor...</div>;

  const currentQ = questions[currentIdx];
  const selectedAnswer = userAnswers[currentIdx] ?? null;
  
  // Hangi kitapçığın (Testin) içindeyiz?
  const activeBooklet = bookletMap?.find(b => currentIdx >= b.startIdx && currentIdx <= b.endIdx) || bookletMap?.[0];
  const progressPercent = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center w-full max-w-2xl mx-auto">
      
      {/* ÜST PANEL & ZAMANLAYICI */}
      <div className="flex flex-col items-center mb-4 w-full px-2 text-center">
        <div className="text-5xl font-black font-mono tracking-tighter text-[#FDB912] drop-shadow-[0_0_15px_rgba(253,185,18,0.3)] mb-2">
          {formattedTime}
        </div>
      </div>

      {/* DİNAMİK KİTAPÇIK SEKME MENÜSÜ (Shortcut Katmanı) */}
      <div className="flex w-full gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {bookletMap?.map((booklet) => {
          const isActive = activeBooklet?.id === booklet.id;
          
          let answeredCount = 0;
          for(let i = booklet.startIdx; i <= booklet.endIdx; i++) {
            if(userAnswers[i] !== undefined && userAnswers[i] !== null) answeredCount++;
          }
          
          return (
            <button
              key={booklet.id}
              onClick={() => handleJump(booklet.startIdx)}
              className={`flex-1 min-w-[100px] py-3 px-2 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all border ${
                isActive 
                ? 'bg-[#FDB912]/20 border-[#FDB912] text-[#FDB912] shadow-[0_0_15px_rgba(253,185,18,0.2)]'
                : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
              }`}
            >
              {booklet.title} 
              <span className="block text-[8px] opacity-80 mt-1">({answeredCount}/{booklet.count})</span>
            </button>
          )
        })}
      </div>

      {/* DEHB DOSTU OPTİK PALET (Question Grid) */}
      {activeBooklet && (
        <div className="w-full bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-4 mb-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">{activeBooklet.title} OPTİK PALETİ</span>
            <span className="text-[9px] font-black text-[#FDB912] uppercase tracking-widest">Soru {currentIdx - activeBooklet.startIdx + 1} / {activeBooklet.count}</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-start">
            {Array.from({ length: activeBooklet.count }).map((_, i) => {
              const absoluteIdx = activeBooklet.startIdx + i;
              if (absoluteIdx >= questions.length) return null; // Güvenlik çiti

              const isAnswered = userAnswers[absoluteIdx] !== undefined && userAnswers[absoluteIdx] !== null;
              const isCurrent = currentIdx === absoluteIdx;

              let style = "bg-white/5 text-gray-500 border-white/5 hover:bg-white/10";
              if (isCurrent) {
                style = "bg-[#FDB912]/20 text-[#FDB912] border-[#FDB912] scale-110 shadow-[0_0_10px_rgba(253,185,18,0.3)] z-10";
              } else if (isAnswered) {
                style = "bg-[#FDB912] text-black border-[#FDB912]";
              }

              return (
                <button
                  key={absoluteIdx}
                  onClick={() => handleJump(absoluteIdx)}
                  className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[10px] font-black border transition-all ${style}`}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* SORU KARTI */}
      <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-6 md:p-8 mb-4 shadow-2xl relative mt-2">
        <h3 className="text-white text-base md:text-lg font-bold leading-relaxed italic">
          {currentQ?.text || "Soru metni bulunamadı."}
        </h3>
      </div>

      {/* ŞIKLAR */}
      <div className="grid grid-cols-1 gap-2 w-full mb-6">
        {currentQ?.options?.map((opt, i) => {
          const isSelected = selectedAnswer === i;
          
          const btnStyle = isSelected 
            ? 'bg-[#FDB912]/10 border-[#FDB912]/50 text-white shadow-[0_0_15px_rgba(253,185,18,0.15)]' 
            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20';

          return (
            <button 
              key={i} 
              onClick={() => handleAnswerSelect(i)} 
              className={`border p-4 rounded-2xl text-left text-sm font-bold transition-all flex items-center gap-4 group ${btnStyle}`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] shrink-0 transition-colors ${
                isSelected ? 'bg-[#FDB912] text-black font-black' : 'bg-black/20 group-hover:bg-white/10'
              }`}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* NAVİGASYON KONTROLLERİ */}
      <div className="flex items-center justify-between w-full gap-4">
        <button 
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${
            currentIdx === 0 ? 'opacity-0 pointer-events-none' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
          }`}
        >
          <ChevronLeft size={16} /> Önceki
        </button>

        {/* Serbest Navigasyon: disabled kilit kaldırıldı. */}
        <button 
          onClick={handleNext}
          className="flex-[1.5] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl bg-[#FDB912] text-black hover:scale-[1.02] active:scale-95"
        >
          {currentIdx === questions.length - 1 ? 'MARATONU BİTİR' : 'SIRADAKİ SORU'} 
          <ChevronRight size={16} />
        </button>
      </div>

      {/* İPTAL BUTONU */}
      <button 
        onClick={handleStop} 
        className="flex items-center gap-2 text-[9px] text-gray-700 font-black uppercase tracking-[0.4em] hover:text-red-500 transition-colors mt-8 group"
      >
        <RotateCcw size={14} className="group-hover:rotate-[-180deg] transition-transform duration-500" /> 
        İptal Et
      </button>

    </div>
  );
};