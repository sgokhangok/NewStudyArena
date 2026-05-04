import React from 'react';
import { MonitorPlay, ExternalLink, Target, User, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SolutionVideoPlayer = ({ questionData, testLink }) => {
  
  // Video linkini belirle (Sorunun kendi linki yoksa genel test linkini kullan)
  const activeVideoLink = questionData?.videoLink || testLink;

  const handleLaunch = () => {
    if (activeVideoLink) window.open(activeVideoLink, '_blank');
  };

  return (
    <div className="w-full h-full bg-[#050505] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative group">
      
      {/* Üst Bar */}
      <div className="bg-[#0A0A0A] p-5 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse shadow-[0_0_10px_#00F0FF]" />
          <h3 className="text-white font-black tracking-[0.3em] text-xs uppercase">Analiz Vizörü v4.5</h3>
        </div>
        {questionData && (
          <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">
            Sector: {questionData.qNum} / Status: {questionData.status}
          </span>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Arka plan efekti */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#00F0FF_0%,transparent_70%)] pointer-events-none" />

        <AnimatePresence mode="wait">
          {!questionData ? (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <Target size={64} className="text-gray-800" />
              <p className="font-black text-gray-600 text-sm tracking-[0.4em] uppercase leading-relaxed">
                İncelemek İstediğiniz<br/>Hedefi Sağdan Seçin
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="intel-card"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-lg flex flex-col items-center"
            >
              {/* Soru Numarası ve İkon */}
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-3xl border-2 border-[#00F0FF]/30 flex items-center justify-center bg-[#00F0FF]/5 rotate-45 group-hover:rotate-0 transition-transform duration-500">
                  <span className="text-4xl font-black text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    {questionData.qNum}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2">
                  {questionData.status === 'correct' ? <CheckCircle2 size={32} className="text-green-500" /> :
                   questionData.status === 'wrong' ? <XCircle size={32} className="text-red-500" /> :
                   <AlertCircle size={32} className="text-gray-500" />}
                </div>
              </div>

              {/* İstihbarat Detayları */}
              <div className="grid grid-cols-2 gap-6 w-full mb-10">
                <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col items-center">
                  <User size={16} className="text-gray-500 mb-2" />
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Senin Hamlen</span>
                  <span className={`text-2xl font-black ${questionData.status === 'wrong' ? 'text-red-500' : 'text-white'}`}>
                    {questionData.userAns}
                  </span>
                </div>
                <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col items-center">
                  <Target size={16} className="text-[#FDB912] mb-2" />
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Doğru Hedef</span>
                  <span className="text-2xl font-black text-[#FDB912]">
                    {questionData.correctAns}
                  </span>
                </div>
              </div>

              {/* Fırlatma Butonu */}
              <button 
                onClick={handleLaunch}
                className="w-full group/btn relative flex flex-col items-center gap-2"
              >
                <div className="w-full bg-[#00F0FF] hover:bg-[#00D0EE] text-black py-5 rounded-2xl font-black tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                  <MonitorPlay size={24} />
                  VİDEO ANALİZİNE GİT
                  <ExternalLink size={18} className="opacity-50" />
                </div>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-4">
                  Analiz Yeni Sekmede Açılacaktır
                </p>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Alt Dekoratif Grid */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent" />
    </div>
  );
};