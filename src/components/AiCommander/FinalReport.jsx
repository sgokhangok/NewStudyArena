import React from 'react';
import { CheckCircle, FileJson } from 'lucide-react';

export const FinalReport = ({ report, globalTotal }) => {
  return (
    <div className="w-full bg-[#111] border border-green-500/30 rounded-2xl p-8 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
        <CheckCircle size={40} />
      </div>
      <h2 className="text-3xl font-black text-white italic mb-2 tracking-widest">OPERASYON TAMAMLANDI</h2>
      <p className="text-gray-400 mb-8">Sipariş Fişi ve Performans Verisi hazırlandı. (F12 Konsoluna Bakınız)</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="bg-black border border-white/5 p-4 rounded-xl">
          <div className="text-gray-500 text-xs font-bold mb-1">TOPLAM SORU</div>
          <div className="text-2xl text-white font-black">{globalTotal}</div>
        </div>
        <div className="bg-black border border-white/5 p-4 rounded-xl">
          <div className="text-gray-500 text-xs font-bold mb-1">NET SÜRE</div>
          <div className="text-2xl text-[#FDB912] font-black">{report?.performance.durationFormatted}</div>
        </div>
        <div className="bg-black border border-white/5 p-4 rounded-xl">
          <div className="text-gray-500 text-xs font-bold mb-1">TAMAMLANAN SET</div>
          <div className="text-2xl text-blue-400 font-black">{report?.pomodoro.completedCycles}</div>
        </div>
        <div className="bg-black border border-white/5 p-4 rounded-xl flex items-center justify-center">
          <button onClick={() => console.log(report)} className="flex items-center gap-2 text-sm text-green-400 font-bold hover:text-green-300">
            <FileJson size={18} /> JSON ÇIKTISI
          </button>
        </div>
      </div>
    </div>
  );
};