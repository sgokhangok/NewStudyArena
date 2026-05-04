import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalState';
import { Shield, Database, ArrowLeft, History, X, Target, Calendar } from 'lucide-react';

// Firebase Bağlantısı
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { fetchTestInventory } from '../services/googleSheetsService';
import { TestInventoryList } from '../components/TestInventoryList';
import { TargetParameters } from '../components/TargetParameters';
import { PomodoroSelector } from '../components/PomodoroSelector';

export const AITestSelectionScreen = () => {
  const navigate = useNavigate();
  const { dbUser, arenaSheetsLink, currentUser } = useGlobalState();
  const db = getFirestore();

  const [dersInput, setDersInput] = useState('');
  const [konuInput, setKonuInput] = useState('');
  
  const [inventory, setInventory] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedPomodoroKey, setSelectedPomodoroKey] = useState(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // 🚀 ARŞİV SİSTEMİ STATE'LERİ
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [warHistory, setWarHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // 📂 ARŞİV VERİLERİNİ ÇEKME (Zindandan Bilgileri Getir)
  const fetchWarHistory = async () => {
    if (!currentUser) return;
    setIsLoadingHistory(true);
    try {
      const q = query(
        collection(db, `users/${currentUser.uid}/warHistory`),
        orderBy("tamamlanmaTarihi", "desc")
      );
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWarHistory(history);
    } catch (err) {
      console.error("Arşiv çekme hatası:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleOpenArchive = () => {
    setIsArchiveOpen(true);
    fetchWarHistory();
  };

  const handleStartBattle = () => {
    if (!selectedTest || !selectedPomodoroKey) return;
    navigate('/adrenalin-war', { state: { test: selectedTest, pomodoroKey: selectedPomodoroKey } });
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);
    try {
      const data = await fetchTestInventory(dersInput, konuInput, arenaSheetsLink || "");
      setInventory(data);
    } catch (err) {
      setInventory([]);
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      
      {/* 🚀 ARŞİV PANELİ (OVERLAY) */}
      {isArchiveOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 md:p-10 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl h-full bg-[#0A0A0A] border-l border-white/10 shadow-2xl flex flex-col relative rounded-[2rem] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#111]">
              <div className="flex items-center gap-3">
                <History className="text-[#00F0FF]" />
                <h2 className="text-xl font-black italic tracking-widest uppercase">Savaş Arşivi</h2>
              </div>
              <button onClick={() => setIsArchiveOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {isLoadingHistory ? (
                <div className="h-full flex items-center justify-center font-mono text-[#FDB912] animate-pulse uppercase tracking-widest text-xs">
                  Veri Zindanından Bilgiler Çekiliyor...
                </div>
              ) : warHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 italic">
                  <Target size={48} className="mb-4 opacity-20" />
                  <p className="text-sm uppercase tracking-widest">Henüz tamamlanmış bir savaş kaydı yok.</p>
                </div>
              ) : (
                warHistory.map((war) => (
                  <div 
                    key={war.id}
                    onClick={() => navigate('/adrenalin-analiz', { state: { 
                      test: { testAdi: war.testAdi, konu: war.konu, cozumLink: war.soruDetaylari?.[0]?.videoLink || "" }, 
                      battleReport: { correct: war.dogru, wrong: war.yanlis, empty: war.bos, total: war.toplamSoru, details: war.soruDetaylari },
                      isFresh: false 
                    }})}
                    className="group bg-[#111] border border-white/5 p-5 rounded-2xl cursor-pointer hover:border-[#00F0FF]/40 transition-all hover:bg-[#111]/80 shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-black text-white tracking-widest uppercase italic group-hover:text-[#00F0FF] transition-colors">{war.testAdi}</h4>
                      <span className="text-[10px] text-gray-600 font-mono flex items-center gap-1 uppercase tracking-widest">
                         {war.tamamlanmaTarihi?.toDate().toLocaleDateString('tr-TR') || '---'}
                      </span>
                    </div>
                    <div className="flex gap-4">
                       <div className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded font-bold uppercase">D: {war.dogru}</div>
                       <div className="text-[10px] bg-red-500/10 text-red-500 px-2 py-1 rounded font-bold uppercase">Y: {war.yanlis}</div>
                       <div className="text-[10px] bg-gray-500/10 text-gray-500 px-2 py-1 rounded font-bold uppercase">B: {war.bos}</div>
                       <div className="text-[10px] text-gray-600 ml-auto uppercase tracking-widest font-bold">Hedef: {war.konu}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- ANA EKRAN İÇERİĞİ --- */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-white/10 pb-4 flex justify-between items-end">
        <div className="flex flex-col gap-4">
          <button onClick={() => navigate('/lobby')} className="flex items-center gap-2 text-gray-500 hover:text-[#FDB912] transition-colors self-start group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Merkez Üsse Dön</span>
          </button>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3 italic">
              ADRENALİN <span className="text-[#FDB912]">ARENA</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">Savaş Seçim Modülü</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          {/* 🚀 AKTİF EDİLEN BUTON */}
          <button 
            onClick={handleOpenArchive}
            className="flex items-center gap-2 bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/30 px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.05)] active:scale-95 group"
          >
            <History size={18} className="group-hover:rotate-[-45deg] transition-transform" />
            <span className="text-[11px] font-black tracking-[0.2em] uppercase">Savaş Arşivi</span>
          </button>

          <div className="bg-[#FDB912]/10 border border-[#FDB912]/40 px-6 py-2 flex items-center gap-3 rounded-lg shadow-[0_0_15px_rgba(253,185,18,0.05)]">
            <Shield className="w-5 h-5 text-[#FDB912]" />
            <div>
              <div className="text-[10px] text-[#FDB912] font-bold tracking-wider uppercase">Kontrol Kulesi Aktif</div>
              <div className="text-white font-mono text-sm uppercase">Operatör Sınıfı: <span className="font-black text-[#FDB912]">{dbUser.class || dbUser.grade || '7'}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <TestInventoryList inventory={inventory} selectedTest={selectedTest} setSelectedTest={setSelectedTest} isSearching={isSearching} error={error} />
        </div>
        <div className="lg:col-span-6 bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 shadow-2xl flex flex-col h-fit">
          <h2 className="text-2xl font-black text-white italic tracking-widest uppercase mb-2">PARAMETRELER</h2>
          <p className="text-[#FDB912]/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-8">Savaş Ayarlarını Yapılandır</p>
          <TargetParameters dersInput={dersInput} setDersInput={setDersInput} konuInput={konuInput} setKonuInput={setKonuInput} handleSearch={handleSearch} isSearching={isSearching} />
          <PomodoroSelector selectedTest={selectedTest} selectedPomodoroKey={selectedPomodoroKey} setSelectedPomodoroKey={setSelectedPomodoroKey} handleStartBattle={handleStartBattle} />
        </div>
      </div>
    </div>
  );
};