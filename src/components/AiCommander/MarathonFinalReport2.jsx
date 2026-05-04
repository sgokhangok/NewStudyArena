/**
 * AiCommander2 - MarathonFinalReport2.jsx (FİNAL ANALİZİ)
 * Özellikler: 
 * - 12 Soru Üzerinden Performans Karnesi
 * - Dinamik Başarı Rütbeleri
 * - Gelişmiş AI Hata Analiz Kartları
 * - V11 Black & Gold Estetiği
 */

import React from 'react';
import { 
  CheckCircle, XCircle, Clock, Trophy, 
  AlertCircle, Target, Sparkles, ChevronRight,
  Medal, Star, Zap
} from 'lucide-react';

export const MarathonFinalReport2 = ({ report, onReturn }) => {
  const { skorRaporu, performance, yanitlananSoru, toplamSoru } = report || {};
  
  if (!skorRaporu) return null;

  // V2: Başarı Yüzdesine Göre Rütbe Belirleme
  const successRate = (skorRaporu.correct / toplamSoru) * 100;
  
  const getRank = () => {
    if (successRate === 100) return { label: "MARATON USTASI", icon: <Trophy className="text-yellow-400" />, color: "text-yellow-400" };
    if (successRate >= 80) return { label: "KIDEMLİ ANALİST", icon: <Medal className="text-blue-400" />, color: "text-blue-400" };
    if (successRate >= 50) return { label: "OPERASYON ŞEFİ", icon: <Star className="text-green-400" />, color: "text-green-400" };
    return { label: "SAHA ÇAYLAĞI", icon: <Zap className="text-red-400" />, color: "text-red-400" };
  };

  const rank = getRank();

  return (
    <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      {/* BAŞLIK VE RÜTBE PANELİ */}
      <div className="bg-[#0A0A0A] border border-[#FDB912]/20 rounded-[3rem] p-10 text-center mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FDB912] to-transparent" />
        
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-[#FDB912]/10 rounded-full border border-[#FDB912]/20 animate-pulse">
            {rank.icon}
          </div>
        </div>
        
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">
          MARATON <span className="text-[#FDB912]">BİLANÇOSU</span>
        </h2>
        
        <div className={`text-[11px] font-black tracking-[0.5em] mb-6 ${rank.color}`}>
          RÜTBE: {rank.label}
        </div>

        <div className="flex justify-center gap-4">
          <span className="bg-white/5 text-gray-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-white/5">
            TOPLAM: {toplamSoru} SORU
          </span>
          <span className="bg-[#FDB912]/10 text-[#FDB912] text-[10px] font-black px-4 py-1.5 rounded-full border border-[#FDB912]/20">
            BAŞARI: %{Math.round(successRate)}
          </span>
        </div>
      </div>

      {/* İSTATİSTİK GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-[2rem] text-center group hover:bg-green-500/10 transition-all">
          <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">DOĞRU</div>
          <div className="text-4xl font-black text-white">{skorRaporu.correct}</div>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-[2rem] text-center group hover:bg-red-500/10 transition-all">
          <XCircle size={24} className="text-red-500 mx-auto mb-2" />
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">YANLIŞ</div>
          <div className="text-4xl font-black text-white">{skorRaporu.wrong}</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">BOŞ</div>
          <div className="text-4xl font-black text-white">{skorRaporu.empty}</div>
        </div>

        <div className="bg-[#FDB912]/5 border border-[#FDB912]/20 p-6 rounded-[2rem] text-center group hover:bg-[#FDB912]/10 transition-all">
          <Clock size={24} className="text-[#FDB912] mx-auto mb-2" />
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">SÜRE</div>
          <div className="text-2xl font-black text-white mt-1">{performance?.durationFormatted || "00:00"}</div>
        </div>
      </div>

      {/* HATA ANALİZ BÖLÜMÜ */}
      {skorRaporu.aiAnalysis && skorRaporu.aiAnalysis.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4 mb-2">
            <AlertCircle className="text-[#FDB912]" size={20} />
            <h3 className="text-lg font-black text-white uppercase italic tracking-widest">STRATEJİK HATA ANALİZİ</h3>
          </div>
          
          {skorRaporu.aiAnalysis.map((item, idx) => (
            <div key={idx} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] hover:border-[#FDB912]/30 transition-all relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600/50 group-hover:bg-[#FDB912] transition-colors" />
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-mono text-[#FDB912] bg-[#FDB912]/10 px-2 py-0.5 rounded">SORU #{idx + 1}</span>
              </div>

              <p className="text-white font-bold text-sm md:text-base leading-relaxed mb-6 italic">
                "{item.soru}"
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4">
                  <span className="text-[9px] font-black text-red-500/70 uppercase block mb-1 tracking-widest">Senin Yanıtın</span>
                  <span className="text-xs font-bold text-gray-400">{item.ogrenciCevabi || "CEVAPSIZ"}</span>
                </div>
                <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-4">
                  <span className="text-[9px] font-black text-green-500/70 uppercase block mb-1 tracking-widest">Doğru Yanıt</span>
                  <span className="text-xs font-bold text-gray-200">{item.dogruCevap}</span>
                </div>
              </div>

              <div className="bg-[#FDB912]/5 border border-[#FDB912]/10 p-6 rounded-3xl relative">
                <div className="flex items-center gap-2 mb-3 text-[#FDB912]">
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Öğretmen Kritik Notu</span>
                </div>
                <p className="text-gray-400 text-sm italic leading-relaxed">
                  {item.cozum}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* KUSURSUZ ZAFER EKRANI */
        <div className="bg-gradient-to-b from-[#FDB912]/10 to-transparent border border-[#FDB912]/20 rounded-[3rem] p-16 text-center shadow-2xl">
          <div className="relative inline-block mb-8">
            <Target size={80} className="text-[#FDB912]" />
            <Sparkles className="absolute -top-2 -right-2 text-white animate-bounce" size={24} />
          </div>
          <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">KUSURSUZ MARATON!</h3>
          <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
            12 soruda sıfır hata! Bu performans senin sadece konuyu bildiğini değil, maraton disiplinine de sahip olduğunu gösteriyor.
          </p>
        </div>
      )}

      {/* GERİ DÖNÜŞ BUTONU */}
      <button 
        onClick={onReturn} 
        className="group w-full py-6 bg-white text-black font-black text-sm uppercase tracking-[0.4em] rounded-[2rem] mt-12 hover:bg-[#FDB912] shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95"
      >
        MERKEZE DÖN <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};