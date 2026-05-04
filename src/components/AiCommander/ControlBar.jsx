import React from 'react';
import { Play, Square } from 'lucide-react';

export const ControlBar = ({ examStatus, isBlocked, globalTotal, globalQuota, onStart, onFinish }) => {
  return (
    // 🚀 Margin ve paddingler tıraşlandı (mt-8 -> mt-4)
    <div className="w-full max-w-3xl mx-auto mt-4 flex flex-col gap-3">
      <div className={`flex justify-between items-center px-4 py-3 rounded-xl border-2 transition-all ${isBlocked ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10 text-white'}`}>
        <span className="font-black tracking-widest text-sm">GLOBAL KOTA RADARI:</span>
        <span className="text-xl font-black">{globalTotal} / {globalQuota}</span>
      </div>

      {examStatus === 'IDLE' ? (
        <button 
          onClick={onStart}
          disabled={isBlocked || globalTotal === 0}
          className={`w-full py-4 rounded-xl font-black tracking-[0.2em] text-lg transition-all uppercase flex items-center justify-center gap-3
            ${isBlocked || globalTotal === 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#FDB912] text-black hover:bg-[#ffc933] shadow-[0_0_20px_rgba(253,185,18,0.4)]'}
          `}
        >
          <Play fill="currentColor" size={20} /> {isBlocked ? 'HATA: KOTA AŞIMI' : 'SINAVI BAŞLAT'}
        </button>
      ) : (
        <button 
          onClick={onFinish}
          className="w-full py-4 rounded-xl font-black tracking-[0.2em] text-lg transition-all uppercase flex items-center justify-center gap-3 bg-red-600 text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
        >
          <Square fill="currentColor" size={20} /> SINAVI BİTİR VE FİŞİ YAZDIR
        </button>
      )}
    </div>
  );
};