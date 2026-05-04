import React from 'react';
import { Cloud, CloudOff } from 'lucide-react';

// ARENA SİSTEMİ: VERİTABANI BAĞLANTI GÖSTERGESİ
export const CloudBadge = ({ connected }) => {
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono tracking-widest uppercase transition-all duration-500
      ${connected 
        ? 'bg-green-500/10 border-green-500/30 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
        : 'bg-[#A90432]/10 border-[#A90432]/30 text-[#A90432] animate-pulse'}`}>
      {connected ? <Cloud size={12} /> : <CloudOff size={12} />}
      <span>DB: {connected ? 'SYNCED' : 'DISCONNECTED'}</span>
    </div>
  );
};