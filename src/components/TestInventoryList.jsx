import React from 'react';
import { Database, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

export const TestInventoryList = ({ inventory, selectedTest, setSelectedTest, isSearching, error }) => {
  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 h-[650px] flex flex-col relative overflow-hidden shadow-2xl">
      <h2 className="text-2xl font-black text-white italic tracking-widest uppercase mb-6 flex items-center gap-3">
        <Database className="w-6 h-6 text-[#FDB912]" /> TEST ENVANTERİ
      </h2>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {inventory.length === 0 && !isSearching && !error && (
          <div className="h-full flex flex-col items-center justify-center text-gray-600">
            <div className="w-16 h-16 border-2 border-gray-700 rounded-full flex items-center justify-center mb-4">
               <span className="text-2xl">🎯</span>
            </div>
            <p className="text-center text-xs tracking-widest uppercase font-mono">Testlerin listelenmesi için<br/>sağ panodan ders ve konu seçiniz.</p>
          </div>
        )}

        {isSearching && (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FDB912]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm font-mono">{error}</p>
          </div>
        )}

        {!isSearching && inventory.map((test, index) => (
          <div 
            key={index}
            onClick={() => setSelectedTest(test)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden flex flex-col ${
              selectedTest === test ? 'border-[#FDB912] bg-[#FDB912]/10' : 'border-white/5 bg-[#111] hover:border-white/20'
            }`}
          >
            <div className="text-[10px] font-mono text-[#FDB912]/70 tracking-widest uppercase mb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#FDB912] rounded-full" />
              {test.klasor}
            </div>
            
            {/* 🚀 DEĞİŞİKLİK BURADA: Test Adı ve Konu yan yana hizalandı */}
            <div className="flex items-baseline gap-3 mb-4">
              <h3 className="text-xl font-black text-white italic tracking-wide group-hover:text-[#FDB912] transition-colors">
                {test.testAdi}
              </h3>
              {test.konu && (
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                  {test.konu}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
              <span className="text-xs font-mono text-gray-500 uppercase">Seviye: <span className="text-white font-bold">{test.seviye}</span></span>
              {selectedTest === test && <CheckCircle2 className="w-5 h-5 text-[#FDB912]" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};