import React, { useState } from 'react';
import { AiCommander } from "../components/AiCommander.jsx";
import { AiCommander2 } from '../components/AiCommander2.jsx';
import { ArrowLeft, Zap, Brain, Home } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 

export const AiStudyScreen = () => {
  const navigate = useNavigate(); 
  
  const [operationMode, setOperationMode] = useState('LOBBY');

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white p-4 lg:p-8 font-sans flex flex-col relative">
      
      {/* 🏠 KARARGAHA DÖNÜŞ BUTONU (SABİT KONUM) */}
      <button 
        onClick={() => navigate('/lobby')} 
        className="fixed top-6 left-6 z-[70] flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/5 hover:border-[#FDB912]/50 text-gray-500 hover:text-[#FDB912] transition-all rounded-lg font-mono text-[9px] font-black tracking-[0.2em] uppercase group"
      >
        <Home size={14} className="group-hover:scale-110 transition-transform" />
        Karargaha Dön
      </button>

      {operationMode === 'LOBBY' ? (
        /* 🟢 HANGAR (GÖREV SEÇİMİ) */
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center flex-grow min-h-[70vh] gap-10 pt-16 lg:pt-0">
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase">
              Görev Seçimi
            </h1>
            <p className="text-gray-500 font-bold tracking-widest uppercase text-sm">
              Bugün hangi operasyona çıkıyorsun?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4">
            <button
              onClick={() => setOperationMode('V1')}
              className="group relative flex flex-col items-center justify-center p-12 bg-[#111] border-2 border-white/5 rounded-[2rem] hover:border-[#FDB912]/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(253,185,18,0.15)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FDB912]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="bg-black/50 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5 group-hover:border-[#FDB912]/30">
                <Zap size={48} className="text-[#FDB912]" />
              </div>
              <h2 className="text-3xl font-black tracking-widest mb-3 text-white">HIZLI TEST</h2>
              <p className="text-xs text-[#FDB912]/70 font-black tracking-widest uppercase text-center bg-[#FDB912]/10 px-4 py-2 rounded-lg">
                Tek Konu / Vur-Kaç Operasyonu
              </p>
            </button>

            <button
              onClick={() => setOperationMode('V2')}
              className="group relative flex flex-col items-center justify-center p-12 bg-[#111] border-2 border-white/5 rounded-[2rem] hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="bg-black/50 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5 group-hover:border-blue-500/30">
                <Brain size={48} className="text-blue-500" />
              </div>
              <h2 className="text-3xl font-black tracking-widest mb-3 text-white">KAPSAMLI DENEME</h2>
              <p className="text-xs text-blue-400/70 font-black tracking-widest uppercase text-center bg-blue-500/10 px-4 py-2 rounded-lg">
                Matris / Maraton Operasyonu
              </p>
            </button>
          </div>
        </div>
      ) : (
        /* 🔴 CEPHE (OPERASYON EKRANI) */
        <div className="w-full flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
          
          {/* ⬅️ GÖREV SEÇİMİNE DÖN (Üstteki butona çarpmaması için mt-20 verildi) */}
          <div className="w-full flex justify-start px-2 mt-20 lg:mt-24">
            <button
              onClick={() => setOperationMode('LOBBY')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#111] border border-white/10 hover:border-white/30 rounded-xl text-gray-400 hover:text-white transition-all text-[10px] font-black tracking-widest uppercase hover:bg-white/5"
            >
              <ArrowLeft size={16} /> GÖREV SEÇİMİNE DÖN
            </button>
          </div>
          
          <div className="w-full">
            {operationMode === 'V1' && <AiCommander />}
            {operationMode === 'V2' && <AiCommander2 />}
          </div>
          
        </div>
      )}
    </div>
  );
};