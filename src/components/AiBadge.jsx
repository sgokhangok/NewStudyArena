import React from 'react';
import { Cpu } from 'lucide-react';

// ARENA SİSTEMİ: AI DURUM GÖSTERGESİ
export const AiBadge = ({ active }) => {
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono tracking-widest uppercase transition-all duration-500
      ${active 
        ? 'bg-[#FDB912]/10 border-[#FDB912]/30 text-[#FDB912] shadow-[0_0_15px_rgba(253,185,18,0.1)]' 
        : 'bg-white/5 border-white/10 text-gray-500 opacity-50'}`}>
      <Cpu size={12} className={active ? 'animate-pulse' : ''} />
      <span>AI CORE: {active ? 'ACTIVE' : 'STANDBY'}</span>
    </div>
  );
};