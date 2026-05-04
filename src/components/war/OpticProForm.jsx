import React from 'react';
import { Target, Zap } from 'lucide-react';

export const OpticProForm = ({ answers, setAnswers, answerKey, onFinishBattle }) => {
  // 🚀 ZEKİ ÇÖZÜCÜ: Senin formatındaki (1-B, 2-A) rakamları ve virgülleri çöpe atar, sadece A-E harflerini sayar!
  const cleanAnswerKey = answerKey ? answerKey.toUpperCase().replace(/[^A-E]/g, '') : '';
  
  // Artık uzunluk 13 değil, tam olarak 3 çıkacak!
  const totalQuestions = cleanAnswerKey.length > 0 ? cleanAnswerKey.length : 20;
  const questionsArray = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  const options = ['A', 'B', 'C', 'D', 'E'];

  const handleOptionClick = (qNum, opt) => {
    setAnswers(prev => ({
      ...prev,
      [qNum]: prev[qNum] === opt ? null : opt
    }));
  };

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col flex-1 relative overflow-hidden">
      
      <div className="mb-6 shrink-0">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-black text-white italic tracking-widest uppercase flex items-center gap-2">
            <Target className="text-[#FDB912]" size={20} /> OPTİK PRO
          </h2>
          <span className="text-xs font-mono text-[#FDB912]">{answeredCount} / {totalQuestions}</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#FDB912] shadow-[0_0_10px_rgba(253,185,18,0.8)] transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar mb-6">
        {questionsArray.map((qNum) => (
          <div key={qNum} className="flex items-center gap-4 bg-[#111] p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <span className="w-6 text-center text-sm font-black font-mono text-gray-500">{qNum}</span>
            <div className="flex gap-2 flex-1 justify-between">
              {options.map(opt => {
                const isSelected = answers[qNum] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleOptionClick(qNum, opt)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                      isSelected 
                        ? 'bg-[#FDB912] text-black shadow-[0_0_15px_rgba(253,185,18,0.4)] scale-110' 
                        : 'bg-black text-gray-400 border border-white/10 hover:border-[#FDB912]/50 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onFinishBattle}
        className="shrink-0 w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] uppercase"
      >
        <Zap size={20} fill="currentColor" /> SAVAŞI BİTİR VE RAPORLA
      </button>
    </div>
  );
};