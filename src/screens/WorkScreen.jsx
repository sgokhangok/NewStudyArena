import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, AlertTriangle, RefreshCcw, BookOpen } from 'lucide-react';
import { useGlobalState } from '../context/GlobalState';
import { Toast } from '../components/Toast';

// BAĞIMSIZ MOTORLAR
import { useMasterPomodoro } from '../hooks/useMasterPomodoro';
import { useGeminiService } from '../hooks/useGeminiService';
import { PomodoroCurtain } from '../components/PomodoroCurtain';

// 🔇 KONSOLLARI SUSTURUCU
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    const msg = args[0]?.toString() || '';
    if (msg.includes('503') || msg.includes('Service Unavailable') || msg.includes('high demand')) return; 
    originalError.apply(console, args);
  };
}

export const WorkScreen = () => {
  const { trainingConfig, aiConfig, setTrainingConfig } = useGlobalState();
  const navigate = useNavigate();

  const gemini = useGeminiService();
  const pomodoro = useMasterPomodoro(trainingConfig);

  const [remainingSets, setRemainingSets] = useState(trainingConfig?.tekrarSayisi || 1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFinishedSet, setIsFinishedSet] = useState(false);
  const [clickedOption, setClickedOption] = useState(null);

  useEffect(() => {
    if (trainingConfig && aiConfig?.geminiKey && !gemini.attemptRef.current) {
      gemini.attemptRef.current = true;
      gemini.fetchQuestions(aiConfig, trainingConfig);
    }
  }, [trainingConfig, aiConfig, gemini]);

  useEffect(() => {
    if (gemini.questions.length > 0 && !gemini.isAiLoading && !isFinishedSet) {
      pomodoro.startFocus();
    }
  }, [gemini.questions.length, gemini.isAiLoading, isFinishedSet, pomodoro]);

  const handleAnswerClick = (idx) => {
    if (clickedOption !== null || isFinishedSet) return;
    setClickedOption(idx);
    
    setTimeout(() => {
      if (currentQuestionIndex < gemini.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setClickedOption(null);
      } else {
        const nextSets = remainingSets - 1;
        setRemainingSets(nextSets);
        setIsFinishedSet(true);
        setClickedOption(null);

        if (nextSets > 0) {
          pomodoro.triggerBreak(); 
        }
      }
    }, 400);
  };

  const handleSessionContinue = () => {
    setIsFinishedSet(false);
    setCurrentQuestionIndex(0);
    gemini.attemptRef.current = false;
    gemini.fetchQuestions(aiConfig, trainingConfig); 
  };

  if (!trainingConfig) return <div className="min-h-screen bg-black flex items-center justify-center text-[#FDB912] font-black italic text-2xl animate-pulse uppercase">HAZIRLIK BEKLENİYOR...</div>;

  if (remainingSets <= 0 && isFinishedSet) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}><Trophy size={140} className="text-[#FDB912] mb-8" /></motion.div>
        <h1 className="text-7xl font-black text-white italic mb-4 uppercase">ZAFER SENİNDİR</h1>
        <p className="text-gray-500 font-mono mb-12 uppercase tracking-[0.5em]">Operasyon Tamamlandı</p>
        <button onClick={() => { setTrainingConfig(null); navigate('/lobby'); }} className="bg-[#FDB912] text-black px-20 py-6 rounded-2xl font-black text-2xl hover:scale-110 transition-all uppercase shadow-2xl">Lobiye Dön</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
      <Toast alert={gemini.errorToast} />
      
      <header className="bg-[#111] border-b border-white/5 p-6 flex justify-between items-center shadow-2xl relative z-20">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest opacity-50">Kalan Set</span>
          <span className="text-3xl font-black text-[#FDB912] italic">{remainingSets}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-center font-black italic text-6xl tabular-nums tracking-tighter">
            {pomodoro.formatTime(pomodoro.timeLeft)}
          </div>
          <span className="text-[10px] text-[#FDB912] font-mono tracking-[0.3em] uppercase opacity-80">{trainingConfig.seviye} MODU</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest opacity-50">Döngü</span>
          <span className="text-2xl font-black">{pomodoro.cycleCount}/4</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <AnimatePresence mode="wait">
          {gemini.isAiLoading ? (
            <div className="flex flex-col items-center gap-6"><div className="w-16 h-16 border-4 border-[#FDB912] border-t-transparent rounded-full animate-spin" /><p className="text-[#FDB912] font-mono text-[10px] tracking-[0.4em] uppercase animate-pulse">Sinyal Kararlı Hale Getiriliyor...</p></div>
          ) : gemini.questions.length > 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full">
              <div className="bg-[#111] border border-white/10 p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5"><div style={{ width: `${((currentQuestionIndex + 1) / gemini.questions.length) * 100}%` }} className="h-full bg-[#FDB912] transition-all duration-700 shadow-[0_0_15px_#FDB912]" /></div>
                
                {/* 🔥 YENİ KİMLİK TABELASI (Sınıf + Ders Adı) 🔥 */}
                <div className="flex flex-wrap items-center gap-3 mb-8 pb-5 border-b border-white/5">
                  <div className="flex items-center gap-2 bg-[#FDB912] text-black px-4 py-2 rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(253,185,18,0.2)]">
                    <BookOpen size={18} />
                    {trainingConfig.sinif ? `${trainingConfig.sinif} - ` : ''} {trainingConfig.courseName || 'DERS SEÇİLMEDİ'}
                  </div>
                  <span className="text-gray-400 font-bold text-sm uppercase tracking-wider bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    {trainingConfig.topicName}
                  </span>
                </div>

                <div className="mb-12">
                  <span className="text-[#FDB912] font-black text-xs uppercase mb-4 block opacity-50">Soru {currentQuestionIndex + 1} / {gemini.questions.length}</span>
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight italic text-white/90">{gemini.questions[currentQuestionIndex]?.text}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gemini.questions[currentQuestionIndex]?.options.map((option, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleAnswerClick(idx)} 
                      className={`p-8 rounded-2xl text-left transition-all font-black text-xl border ${
                        clickedOption === idx ? 'bg-[#FDB912] text-black border-[#FDB912] scale-95' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:-translate-y-1'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
             <div className="text-center space-y-8">
               <AlertTriangle className="text-[#FDB912] mx-auto animate-bounce" size={80} />
               <button onClick={() => { gemini.attemptRef.current = false; gemini.fetchQuestions(aiConfig, trainingConfig); }} className="bg-[#FDB912] text-black px-10 py-4 rounded-xl font-black uppercase text-sm hover:scale-105 transition-all flex items-center gap-2 mx-auto"><RefreshCcw size={18}/> Sinyali Yenile</button>
             </div>
          )}
        </AnimatePresence>
      </main>

      <PomodoroCurtain 
        pomodoro={pomodoro} 
        onSessionContinue={handleSessionContinue} 
      />
    </div>
  );
};