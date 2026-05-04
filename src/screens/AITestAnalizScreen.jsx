import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, CheckCircle2, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

// Veritabanı Servisleri
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useGlobalState } from '../context/GlobalState';

import { SolutionVideoPlayer } from '../components/war/SolutionVideoPlayer';

export const AITestAnalizScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useGlobalState();
  const db = getFirestore();

  // 1. VERİ KARŞILAMA
  const { test, battleReport, isFresh } = location.state || {};

  // Seçili soruyu artık bir "obje" olarak tutuyoruz (İstihbarat Kartı için)
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  const hasSaved = useRef(false);

  useEffect(() => {
    if (!test || !battleReport) {
      navigate('/adrenalin-arena');
      return;
    }

    const saveToArchive = async () => {
      if (isFresh && !hasSaved.current && currentUser) {
        hasSaved.current = true;
        try {
          const archiveData = {
            testAdi: test.testAdi,
            konu: test.konu,
            seviye: test.seviye,
            toplamSoru: battleReport.total,
            dogru: battleReport.correct,
            yanlis: battleReport.wrong,
            bos: battleReport.empty,
            soruDetaylari: battleReport.details.map(d => ({
              ...d,
              videoLink: test.cozumLink || "" 
            })),
            tamamlanmaTarihi: serverTimestamp()
          };

          const warHistoryRef = collection(db, `users/${currentUser.uid}/warHistory`);
          await addDoc(warHistoryRef, archiveData);
          console.log("🔥 ARŞİV ZIRHI AKTİF: Savaş verileri başarıyla zindana mühürlendi.");
        } catch (error) {
          console.error("Arşivleme hatası:", error);
        }
      }
    };

    saveToArchive();
  }, [test, battleReport, isFresh, currentUser, db, navigate]);

  if (!test || !battleReport) return null;

  const handleQuestionSelect = (qData) => {
    setSelectedQuestion(qData);
  };

  return (
    <div className="h-screen w-screen bg-[#050505] text-white p-4 md:p-6 font-sans flex flex-col relative overflow-hidden">
      
      {/* 🎯 SAVAŞ KARNESİ (HEADER) */}
      <header className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 mb-6 flex flex-wrap md:flex-nowrap justify-between items-center shrink-0 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#00F0FF] shadow-[0_0_15px_#00F0FF]" />
        
        <div className="flex items-center gap-6 pl-4">
          <button onClick={() => navigate('/adrenalin-arena')} className="text-gray-500 hover:text-[#00F0FF] transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black italic tracking-widest text-white uppercase flex items-center gap-2">
              <Target className="text-[#00F0FF]" size={20} /> {test.testAdi}
            </h1>
            <div className="flex gap-4 mt-1">
              <p className="text-[#FDB912] text-[10px] font-bold tracking-[0.2em] uppercase">Hedef: {test.konu}</p>
              <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-1">
                <Calendar size={12} /> {isFresh ? "CANLI RAPOR" : "ARŞİV KAYDI"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
            <CheckCircle2 className="text-green-500" size={16} />
            <span className="text-xl font-black text-green-500 tabular-nums">{battleReport.correct}</span>
          </div>
          <div className="flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 shadow-[0_0_15px_rgba(253,185,18,0.1)]">
            <XCircle className="text-red-500" size={16} />
            <span className="text-xl font-black text-red-500 tabular-nums">{battleReport.wrong}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-500/10 px-4 py-2 rounded-lg border border-gray-500/20">
            <AlertCircle className="text-gray-400" size={16} />
            <span className="text-xl font-black text-gray-400 tabular-nums">{battleReport.empty}</span>
          </div>
        </div>
      </header>

      {/* 🚀 İKİLİ PANEL MİMARİSİ */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* SOL PANEL: ANALİZ VİZÖRÜ (7 Sütun) */}
        <div className="lg:col-span-7 h-full min-h-0">
          <SolutionVideoPlayer 
            // 🚀 KRİTİK GÜNCELLEME: Prop isimleri ve içeriği 2. yöntemle senkronize edildi
            questionData={selectedQuestion} 
            testLink={test.cozumLink}
          />
        </div>

        {/* SAĞ PANEL: OPERASYON GÜNLÜĞÜ (5 Sütun) */}
        <div className="lg:col-span-5 flex flex-col bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 shadow-2xl min-h-0">
          <h2 className="text-lg font-black text-white italic tracking-widest uppercase mb-4 shrink-0 flex items-center justify-between border-b border-white/5 pb-4">
            <span>Operasyon Günlüğü</span>
            <span className="text-xs text-[#FDB912] font-mono">Toplam: {battleReport.total}</span>
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {battleReport.details.map((item, index) => {
              const isWrong = item.status === 'wrong';
              const isSelected = selectedQuestion?.qNum === item.qNum;

              return (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.qNum} 
                  onClick={() => handleQuestionSelect(item)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? 'bg-[#00F0FF]/10 border-[#00F0FF]/40 scale-[1.02] shadow-[0_0_20px_rgba(0,240,255,0.1)]' :
                    isWrong ? 'bg-red-500/5 border-[#FDB912]/50 hover:bg-red-500/10' :
                    item.status === 'correct' ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10' :
                    'bg-gray-500/5 border-gray-500/20 hover:bg-gray-500/10'
                  }`}
                >
                  <div className={`font-black font-mono text-lg w-12 transition-colors ${isSelected ? 'text-[#00F0FF]' : 'text-gray-400'}`}>
                    {item.qNum}.
                  </div>
                  
                  <div className="flex-1 flex justify-center gap-8 text-sm font-bold tracking-widest uppercase">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-gray-500 mb-1">SEN</span>
                      <span className={`text-base ${isWrong ? 'text-red-400' : 'text-white'}`}>{item.userAns}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-gray-500 mb-1">HEDEF</span>
                      <span className="text-base text-[#FDB912]">{item.correctAns}</span>
                    </div>
                  </div>

                  <div className="w-8 flex justify-end">
                    {item.status === 'correct' && <CheckCircle2 size={24} className="text-green-500" />}
                    {item.status === 'wrong' && <XCircle size={24} className="text-red-500 animate-pulse" />}
                    {item.status === 'empty' && <AlertCircle size={24} className="text-gray-500" />}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

    </div>
  );
};