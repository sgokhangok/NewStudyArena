import React from 'react';
import { AlertTriangle, Power } from 'lucide-react';

export const AiSubjectCard2 = ({ subject, rows, isOverQuota, examStatus, isActive, onToggle, onChange }) => {
  return (
    <div className={`bg-[#0A0A0A] rounded-[2rem] border-2 transition-all duration-500 p-4 flex flex-col h-full w-full
      ${isActive ? (isOverQuota ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-white/10') : 'border-white/5 opacity-40 grayscale'}`}>
      
      <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={onToggle} disabled={examStatus === 'IN_PROGRESS'} className={`p-2 rounded-xl transition-all ${isActive ? 'bg-[#FDB912]/20 text-[#FDB912]' : 'bg-white/5 text-gray-500'}`}>
            <Power size={16} />
          </button>
          <h3 className={`text-sm md:text-base font-black tracking-tighter italic uppercase ${isActive ? 'text-white' : 'text-gray-600'}`}>
            {subject.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row, rowIndex) => {
          const isDisabled = !isActive || examStatus === 'IN_PROGRESS';
          return (
            <div key={rowIndex} className="flex flex-col gap-2 p-2 bg-black/40 rounded-xl border border-white/5">
              <input 
                type="text" 
                placeholder="Konu adı..." 
                value={row.topic || ''}
                disabled={isDisabled}
                onChange={(e) => onChange(subject.id, rowIndex, 'topic', e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white focus:border-[#FDB912] outline-none transition-all"
              />
              
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center bg-black border border-white/10 rounded-lg overflow-hidden">
                  <span className="bg-green-500/10 text-green-400 text-[10px] font-black px-2 py-1.5 h-full flex items-center">K</span>
                  {/* LİMİTLER 20'YE ÇIKARILDI */}
                  <input type="number" min="0" max="20" placeholder="0" value={row.easy || ''} disabled={isDisabled} onChange={(e) => onChange(subject.id, rowIndex, 'easy', e.target.value)} className="w-full bg-transparent text-center text-xs font-bold text-white outline-none py-1.5" />
                </div>
                <div className="flex items-center bg-black border border-white/10 rounded-lg overflow-hidden">
                  <span className="bg-yellow-500/10 text-yellow-400 text-[10px] font-black px-2 py-1.5 h-full flex items-center">O</span>
                  <input type="number" min="0" max="20" placeholder="0" value={row.medium || ''} disabled={isDisabled} onChange={(e) => onChange(subject.id, rowIndex, 'medium', e.target.value)} className="w-full bg-transparent text-center text-xs font-bold text-white outline-none py-1.5" />
                </div>
                <div className="flex items-center bg-black border border-white/10 rounded-lg overflow-hidden">
                  <span className="bg-red-500/10 text-red-400 text-[10px] font-black px-2 py-1.5 h-full flex items-center">Z</span>
                  <input type="number" min="0" max="20" placeholder="0" value={row.hard || ''} disabled={isDisabled} onChange={(e) => onChange(subject.id, rowIndex, 'hard', e.target.value)} className="w-full bg-transparent text-center text-xs font-bold text-white outline-none py-1.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {isActive && isOverQuota && (
        <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 text-red-500 font-black text-[9px] uppercase tracking-tighter">
          {/* UYARI METNİ GÜNCELLENDİ */}
          <AlertTriangle size={12} /> KOTA AŞILDI (MAX 20)
        </div>
      )}
    </div>
  );
};