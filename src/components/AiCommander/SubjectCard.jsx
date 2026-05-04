import React from 'react';
import { AlertTriangle, Power } from 'lucide-react';

export const SubjectCard = ({ subject, subjectIndex, rows, currentTotal, isOverQuota, examStatus, isActive, onToggle, onChange }) => {
  return (
    <div className={`bg-[#111] rounded-2xl border-2 transition-all flex flex-col h-full 
      ${isActive ? (isOverQuota ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : subject.border) : 'border-white/5 opacity-50 grayscale'}`}>
      
      <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-3">
          {/* 🚀 ON/OFF ŞALTERİ */}
          <button 
            onClick={onToggle}
            disabled={examStatus === 'IN_PROGRESS'}
            className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'} disabled:opacity-50`}
            title={isActive ? "Dersi Kapat" : "Dersi Aç"}
          >
            <Power size={16} />
          </button>
          <h3 className={`text-lg font-black tracking-widest italic ${isActive ? subject.color : 'text-gray-500'}`}>
            {subject.title}
          </h3>
        </div>
        
        {isActive && (
          <div className={`text-xs font-black px-3 py-1 rounded-md tracking-wider transition-all ${isOverQuota ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-gray-400'}`}>
            {currentTotal} / {subject.quota}
          </div>
        )}
      </div>

      <div className={`grid grid-cols-[1fr_45px_45px_45px] gap-2 mb-2 px-1 ${isActive ? '' : 'opacity-30'}`}>
        <div className="text-[10px] font-black text-gray-500 tracking-widest uppercase">Konu Adı</div>
        <div className="text-[10px] font-black text-green-400 text-center">K</div>
        <div className="text-[10px] font-black text-yellow-400 text-center">O</div>
        <div className="text-[10px] font-black text-red-400 text-center">Z</div>
      </div>

      <div className="flex flex-col gap-2 flex-grow">
        {rows.map((row, rowIndex) => {
          const baseTab = (subjectIndex * 100) + (rowIndex * 10);
          // 🚀 EĞER ŞALTER KAPALIYSA VEYA SINAV BAŞLADIYSA KİLİTLE
          const isDisabled = !isActive || examStatus === 'IN_PROGRESS';
          
          return (
            <div key={rowIndex} className="grid grid-cols-[1fr_45px_45px_45px] gap-2">
              <input 
                type="text" placeholder="Konu..." value={row.topic}
                disabled={isDisabled}
                autoComplete="off"
                tabIndex={baseTab + 1}
                onChange={(e) => onChange(subject.id, rowIndex, 'topic', e.target.value)}
                className={`bg-black border ${isOverQuota ? 'border-red-500/50 text-red-100' : 'border-white/10 text-white'} rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#FDB912] focus:ring-1 focus:ring-[#FDB912] transition-all disabled:opacity-30 disabled:cursor-not-allowed`}
              />
              <input 
                type="number" min="0" max="12" placeholder="0" value={row.easy}
                disabled={isDisabled}
                autoComplete="off"
                tabIndex={baseTab + 2}
                onChange={(e) => onChange(subject.id, rowIndex, 'easy', e.target.value)}
                className={`bg-black border ${isOverQuota ? 'border-red-500/50 text-red-400' : 'border-white/10 text-green-400'} rounded-lg text-center text-xs font-bold focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed`}
              />
              <input 
                type="number" min="0" max="12" placeholder="0" value={row.medium}
                disabled={isDisabled}
                autoComplete="off"
                tabIndex={baseTab + 3}
                onChange={(e) => onChange(subject.id, rowIndex, 'medium', e.target.value)}
                className={`bg-black border ${isOverQuota ? 'border-red-500/50 text-red-400' : 'border-white/10 text-yellow-400'} rounded-lg text-center text-xs font-bold focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed`}
              />
              <input 
                type="number" min="0" max="12" placeholder="0" value={row.hard}
                disabled={isDisabled}
                autoComplete="off"
                tabIndex={baseTab + 4}
                onChange={(e) => onChange(subject.id, rowIndex, 'hard', e.target.value)}
                className={`bg-black border ${isOverQuota ? 'border-red-500/50 text-red-400' : 'border-white/10 text-red-400'} rounded-lg text-center text-xs font-bold focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed`}
              />
            </div>
          );
        })}
      </div>
      
      {isActive && isOverQuota && (
        <div className="mt-2 p-2 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center justify-center gap-1 text-red-400 font-black tracking-widest text-[10px] uppercase animate-pulse">
          <AlertTriangle size={14} /> KOTA AŞILDI!
        </div>
      )}
    </div>
  );
};