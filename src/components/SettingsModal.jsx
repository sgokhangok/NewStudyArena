import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, BrainCircuit, Timer, Gauge, Coffee, Lock, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalState';

export const SettingsModal = ({ isOpen, onClose }) => {
  // 🔥 KRİTİK DOKUNUŞ: Sadece setTrainingConfig'i değil, dbUser'ı (Firebase Verisini) de çağırdık!
  const { setTrainingConfig, dbUser } = useGlobalState();
  const navigate = useNavigate();

  const [config, setConfig] = useState({
    courseName: '',
    topicName: '',
    odakSuresi: 25,
    soruSayisi: 5,
    tekrarSayisi: 1,
    seviye: 'Orta',
    shortBreak: 8,
    longBreak: 25
  });

  const handleFocusChange = (val) => {
    const focus = Number(val);
    let sBreak = config.shortBreak;
    let lBreak = config.longBreak;

    if (focus === 5) { sBreak = 2; lBreak = 5; }
    else if (focus === 10) { sBreak = 3; lBreak = 10; }
    else if (focus === 15) { sBreak = 5; lBreak = 15; }
    else if (focus === 25) { sBreak = 8; lBreak = 25; }
    else if (focus === 50) { sBreak = 16; lBreak = 50; }
    else if (focus > 50) {
       sBreak = Math.floor(focus / 3);
       lBreak = focus;
    }

    setConfig({ ...config, odakSuresi: focus, shortBreak: sBreak, longBreak: lBreak });
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!config.courseName || !config.topicName) return;
    
    // 🔥 SİHİRLİ HAMLE: Sistemi ateşlerken, paketin içine Firebase'deki öğrenci sınıfını gizlice ekliyoruz.
    // Eğer öğrenci Firebase'e sınıfını "8. Sınıf" diye girdiyse, artık sistem bunu biliyor!
    const finalConfig = {
      ...config,
      sinif: dbUser?.sinif || "Belirtilmemiş" 
    };

    setTrainingConfig(finalConfig);
    onClose();
    navigate('/work');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0A0A0A] border-2 border-[#FDB912]/20 p-8 max-w-xl w-full rounded-[2.5rem] shadow-[0_0_80px_rgba(253,185,18,0.1)]">
            
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#FDB912] rounded-2xl text-black shadow-[0_0_20px_rgba(253,185,18,0.3)]">
                  <BrainCircuit size={24} />
                </div>
                <h2 className="text-white font-black text-2xl tracking-tighter uppercase italic">Operasyon Hazırlığı</h2>
              </div>
              <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors"><X size={28} /></button>
            </div>

            {/* 🔥 EĞER FİREBASE'DEN SINIF GELDİYSE ÜSTTE UFAK BİR KİMLİK KARTI GÖSTERELİM */}
            {dbUser?.sinif && (
              <div className="mb-6 bg-white/5 p-3 rounded-xl border border-white/10 flex justify-center items-center gap-2">
                 <span className="text-xs text-gray-400 uppercase tracking-widest">Sistem Tanındı:</span>
                 <span className="text-xs text-[#FDB912] font-black tracking-widest">{dbUser.sinif} Öğrencisi</span>
              </div>
            )}

            <form onSubmit={handleStart} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-500 tracking-widest uppercase ml-2">Hedef Ders</label>
                  <input required type="text" placeholder="Örn: Matematik" className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#FDB912]" 
                    value={config.courseName} onChange={e => setConfig({...config, courseName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-500 tracking-widest uppercase ml-2">Kritik Konu</label>
                  <input required type="text" placeholder="Örn: Üslü Sayılar" className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#FDB912]" 
                    value={config.topicName} onChange={e => setConfig({...config, topicName: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-500 tracking-widest uppercase ml-2 flex items-center gap-2"><Gauge size={12}/> Seviye</label>
                  <select className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#FDB912]"
                    value={config.seviye} onChange={(e) => setConfig({...config, seviye: e.target.value})}>
                    <option value="Kolay">🐣 Kolay</option>
                    <option value="Orta">⚔️ Orta</option>
                    <option value="Zor">💀 Zor</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-500 tracking-widest uppercase ml-2 flex items-center gap-2"><Timer size={12}/> Odak Süresi (Dk)</label>
                  <input type="number" className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#FDB912]" 
                    value={config.odakSuresi} onChange={e => handleFocusChange(e.target.value)} />
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 p-5 rounded-[2rem] flex items-center justify-around relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FDB912] text-black text-[8px] font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-tighter shadow-lg">
                  {config.odakSuresi > 50 ? <Unlock size={8}/> : <Lock size={8}/>}
                  {config.odakSuresi > 50 ? 'Serbest Mod' : 'Sistem Kontrolü'}
                </div>

                <div className="text-center">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-2">Kısa Mola</p>
                  <input type="number" className="bg-transparent text-[#FDB912] font-black text-2xl w-16 text-center outline-none border-b border-white/5 focus:border-[#FDB912]/50"
                    value={config.shortBreak} onChange={e => setConfig({...config, shortBreak: Number(e.target.value)})} />
                  <span className="text-[10px] text-white/20 ml-1">DK</span>
                </div>

                <div className="w-[1px] h-10 bg-white/10" />

                <div className="text-center">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-2">Uzun Mola (4 Set)</p>
                  <input type="number" className="bg-transparent text-[#FDB912] font-black text-2xl w-16 text-center outline-none border-b border-white/5 focus:border-[#FDB912]/50"
                    value={config.longBreak} onChange={e => setConfig({...config, longBreak: Number(e.target.value)})} />
                  <span className="text-[10px] text-white/20 ml-1">DK</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-center">
                  <label className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Soru Adedi</label>
                  <input type="number" className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white text-center" 
                    value={config.soruSayisi} onChange={e => setConfig({...config, soruSayisi: Number(e.target.value)})} />
                </div>
                <div className="space-y-2 text-center">
                  <label className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Set Sayısı</label>
                  <input type="number" className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white text-center" 
                    value={config.tekrarSayisi} onChange={e => setConfig({...config, tekrarSayisi: Number(e.target.value)})} />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#FDB912] text-black font-black py-5 rounded-2xl text-lg tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_40px_rgba(253,185,18,0.2)] uppercase mt-4">
                <Zap size={20} fill="black" /> Sistemi Ateşle
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};