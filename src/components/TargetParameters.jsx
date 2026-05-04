import React from 'react';

export const TargetParameters = ({ dersInput, setDersInput, konuInput, setKonuInput, handleSearch, isSearching }) => {
  return (
    <div className="space-y-6 mb-8">
      <div>
        <label className="block text-[#FDB912] text-xs font-black tracking-widest uppercase mb-3">GÖREV BRANŞI (DERS)</label>
        <input 
          type="text" 
          value={dersInput}
          onChange={(e) => setDersInput(e.target.value)}
          placeholder="Branş Seçiniz..."
          className="w-full bg-[#050505] border border-white/10 rounded-xl text-white p-4 focus:outline-none focus:border-[#FDB912] transition-colors font-mono text-sm"
        />
      </div>
      <div>
        <label className="block text-[#FDB912] text-xs font-black tracking-widest uppercase mb-3">OPERASYON SAHASI (KONU)</label>
        <input 
          type="text" 
          value={konuInput}
          onChange={(e) => setKonuInput(e.target.value)}
          placeholder="Konu Belirleyiniz..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full bg-[#050505] border border-white/10 rounded-xl text-white p-4 focus:outline-none focus:border-[#FDB912] transition-colors font-mono text-sm"
        />
      </div>
      <button 
        onClick={handleSearch}
        disabled={isSearching}
        className="w-full bg-white/5 border border-white/10 text-white hover:bg-[#FDB912] hover:text-black font-black uppercase tracking-widest p-4 rounded-xl transition-colors disabled:opacity-50 text-sm"
      >
        {isSearching ? 'TARANIYOR...' : 'VERİ TABANINI TARA'}
      </button>
    </div>
  );
};