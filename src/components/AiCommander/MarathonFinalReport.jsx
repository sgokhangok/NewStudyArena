import React from 'react';
import { CheckCircle, XCircle, Clock, Trophy, AlertCircle, Target, Sparkles } from 'lucide-react';

export const MarathonFinalReport = ({ report, onReturn }) => {
  const { skorRaporu, performance, yanitlananSoru, toplamSoru } = report || {};
  if (!skorRaporu) return null;

  return (
    <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-700 pb-10">
      
      <div className="bg-[#111] border border-white/10 rounded-[2rem] p-8 text-center mb-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FDB912] to-transparent opacity-50" />
        <Trophy size={48} className="text-[#FDB912] mx-auto mb-4 drop-shadow-[0_0_15px_rgba(253,185,18,0.5)]" />
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">MARATON BİLANÇOSU</h2>
        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">
          {toplamSoru} Soruda {yanitlananSoru} Yanıt
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl text-center">
          <CheckCircle size={20} className="text-green-500 mx-auto mb-1" />
          <div className="text-[10px] font-black text-gray-500 uppercase">DOĞRU</div>
          <div className="text-3xl font-black text-white">{skorRaporu.correct}</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-center">
          <XCircle size={20} className="text-red-500 mx-auto mb-1" />
          <div className="text-[10px] font-black text-gray-500 uppercase">YANLIŞ</div>
          <div className="text-3xl font-black text-white">{skorRaporu.wrong}</div>
        </div>
        <div className="bg-gray-500/10 border border-white/10 p-5 rounded-2xl text-center">
          <div className="text-[10px] font-black text-gray-500 uppercase mb-1">BOŞ</div>
          <div className="text-3xl font-black text-white">{skorRaporu.empty}</div>
        </div>
        <div className="bg-[#FDB912]/10 border border-[#FDB912]/20 p-5 rounded-2xl text-center">
          <Clock size={20} className="text-[#FDB912] mx-auto mb-1" />
          <div className="text-[10px] font-black text-gray-500 uppercase">NET SÜRE</div>
          <div className="text-2xl font-black text-white mt-1">{performance?.durationFormatted}</div>
        </div>
      </div>

      {skorRaporu.aiAnalysis.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <AlertCircle className="text-[#FDB912]" size={24} />
            <h3 className="text-xl font-black text-white uppercase italic tracking-widest">ÖĞRETİCİ HATA ANALİZİ</h3>
          </div>
          
          {skorRaporu.aiAnalysis.map((item, idx) => (
            <div key={idx} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[2rem] hover:border-[#FDB912]/30 transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600 group-hover:bg-[#FDB912] transition-colors" />
              <div className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-3">SORU METNİ:</div>
              <p className="text-white font-bold text-sm md:text-base leading-relaxed mb-4 italic">{item.soru}</p>

              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <span className="text-[9px] font-black text-red-500 uppercase block mb-1">Senin İşaretlediğin:</span>
                  <span className="text-xs font-bold text-gray-300">{item.ogrenciCevabi || "BOŞ BIRAKILDI"}</span>
                </div>
                <div className="flex-1 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                  <span className="text-[9px] font-black text-green-500 uppercase block mb-1">Doğru Şık:</span>
                  <span className="text-xs font-bold text-gray-300">{item.dogruCevap}</span>
                </div>
              </div>

              <div className="bg-[#FDB912]/5 border border-[#FDB912]/20 p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-[#FDB912]">
                  <Sparkles size={16} />
                  <span className="text-[11px] font-black uppercase tracking-widest">YAPAY ZEKA ÖĞRETMEN NOTU</span>
                </div>
                <p className="text-gray-300 text-sm italic leading-relaxed">{item.cozum}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/20 rounded-[2.5rem] p-12 text-center mt-6">
          <Target size={64} className="text-green-500 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-4">KUSURSUZ ZAFER!</h3>
          <p className="text-gray-400">Tek bir hataya bile yer vermedin. Karargah bu kusursuz operasyonunu arşive mühürledi!</p>
        </div>
      )}

      {/* 🚀 DİKKAT: window.location.reload() silindi, güvenli onReturn prop'u kullanıldı. */}
      <button onClick={onReturn} className="w-full py-5 bg-white text-black font-black text-sm uppercase tracking-[0.3em] rounded-[1.5rem] mt-8 hover:bg-[#FDB912] shadow-xl hover:scale-105 active:scale-95 transition-all">
        GÖREV SEÇİMİNE DÖN
      </button>
    </div>
  );
};