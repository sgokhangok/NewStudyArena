import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

export const PomodoroCurtain = ({ pomodoro, onSessionContinue }) => {
  const { isCurtainDown, cycleCount, molaTime, isWaitingForApproval, continueSession, formatTime } = pomodoro;

  const handleDevamEt = () => {
    continueSession();
    if (onSessionContinue) {
      onSessionContinue(); // Sayfaya özel ekstra bir işlem varsa (örneğin yeni soru çekmek gibi) tetikler
    }
  };

  // 🚀 YENİ MATEMATİK: Uzun molaya kaç set kaldı ve kaç 4'lü döngü bitti?
  const remainingSetsForLongBreak = 4 - (cycleCount % 4);
  const currentSetDisplay = (cycleCount % 4) === 0 ? 4 : (cycleCount % 4);
  const completedCycles = Math.floor(cycleCount / 4); // Kaç tane 4 set bitti

  return (
    <AnimatePresence>
      {isCurtainDown && (
        <motion.div 
          initial={{ y: '100%' }} 
          animate={{ y: 0 }} 
          exit={{ y: '100%' }} 
          className="fixed inset-0 bg-[#FDB912] z-[100] flex flex-col items-center justify-center p-8 text-black font-black text-center"
        >
          <Clock size={100} className="mb-8 animate-pulse" />
          
          <h2 className="text-7xl md:text-8xl italic uppercase tracking-tighter mb-4 leading-none">
            {cycleCount > 0 && cycleCount % 4 === 0 ? "BÜYÜK DİNLENME" : "MOLA VAKTİ"}
          </h2>
          
          <div className="text-[10rem] md:text-[12rem] tabular-nums leading-none mb-4">
            {formatTime(molaTime)}
          </div>

          {/* 🚀 YENİ EKLENEN: YOL HARİTASI BİLGİ ETİKETİ (4'LÜ DÖNGÜ EKLENDİ) */}
          <div className="bg-black/10 px-6 py-3 rounded-xl mb-12 text-sm font-mono uppercase tracking-[0.3em] flex flex-col gap-2 items-center">
            <span className="font-black">TAMAMLANAN 4'LÜ DÖNGÜ: {completedCycles}</span>
            <span>
              TOPLAM SET: {cycleCount} • 
              {cycleCount > 0 && cycleCount % 4 === 0 
                ? " (ŞU AN UZUN MOLADASIN)" 
                : ` UZUN MOLAYA SON ${remainingSetsForLongBreak} SET`}
            </span>
          </div>

          {isWaitingForApproval && (
            <button 
              onClick={handleDevamEt} 
              className="bg-black text-white px-24 py-8 rounded-full text-3xl font-black shadow-2xl hover:scale-110 transition-transform uppercase"
            >
              DEVAM ET
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};