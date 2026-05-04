import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Gamepad2, Lock, BookOpen, User, AlertTriangle } from 'lucide-react';
import { useGlobalState } from '../context/GlobalState';
import { GatekeeperModal } from '../components/GatekeeperModal';
import { AdminModal } from '../components/AdminModal';
import { AuthModal } from '../components/AuthModal';

export const HomeScreen = () => {
  const { systemConfig, aiConfig, firebaseInstance } = useGlobalState();
  const [activeModal, setActiveModal] = useState('NONE');
  
  const isSystemActive = !!systemConfig;
  const isConnected = !!firebaseInstance;
  const isAiActive = !!aiConfig?.geminiKey;

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <header className="w-full bg-[#111]/90 backdrop-blur-xl border-b border-white/10 p-5 flex justify-between items-center z-50 sticky top-0 shadow-2xl">
        <div className="flex items-center gap-4 text-white">
          <div className={`p-2 rounded-lg transition-colors ${isConnected ? 'bg-[#FDB912]' : 'bg-[#A90432]'}`}>
            <Gamepad2 size={24} className={isConnected ? 'text-black' : 'text-white'} />
          </div>
          <span className="font-black text-2xl tracking-tighter italic uppercase">🎮 ARENA</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveModal('GATEKEEPER')} className="bg-white/5 hover:bg-[#FDB912]/10 p-3 rounded-xl border border-white/5 transition-all group">
            <Settings size={22} className="text-gray-500 group-hover:text-[#FDB912]" />
          </button>
        </div>
      </header>

      {/* SİSTEM KİLİTLİ UYARISI  */}
      {!isSystemActive && (
        <div className="fixed inset-0 top-[80px] bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="text-center font-mono space-y-4">
            <Lock size={48} className="text-[#A90432] mx-auto opacity-50" />
            <h2 className="text-[#A90432] tracking-[0.5em] font-black text-xl opacity-50">SİSTEM KİLİTLİ</h2>
            <p className="text-gray-500 text-xs tracking-widest uppercase">Yönetici Yapılandırması Bekleniyor</p>
          </div>
        </div>
      )}

      <main className={`flex-1 flex flex-col items-center w-full max-w-6xl mx-auto z-10 px-6 pt-16 pb-32 transition-all duration-700 ${!isSystemActive ? 'blur-md grayscale opacity-20 pointer-events-none' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-[1.1]">
            SAHAYA ÇIKMAYA HAZIR MISIN <br />
            <span className="inline-block mt-4 text-gray-600 transition-all duration-1000">ŞAMPİYON?</span>
          </h2>
          
          {isSystemActive && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 flex flex-col items-center gap-4">
              <span className="text-[#FDB912] font-mono text-sm tracking-widest animate-pulse bg-[#FDB912]/10 border border-[#FDB912]/30 px-6 py-2 rounded-full inline-flex items-center gap-2 uppercase">
                <AlertTriangle size={16} /> Lütfen Sisteme Giriş Yapın
              </span>
              <button onClick={() => setActiveModal('AUTH')} className="bg-white text-black font-black px-8 py-3 rounded-lg text-sm tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2 uppercase shadow-2xl">
                <User size={16} /> Giriş Yap / Kayıt Ol
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* KİLİTLİ KARTLAR [cite: 75-77] */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-16 opacity-50">
          {[ { icon: BookOpen, label: 'DERS SEÇİMİ' }, { icon: Gamepad2, label: 'OYUNLAR' }, { icon: Settings, label: 'AYARLAR' } ].map((btn, i) => (
            <div key={i} className="relative bg-[#2A2A2A] rounded-2xl p-12 border-2 border-white/5 flex flex-col items-center gap-8">
              <div className="p-5 bg-black/50 rounded-2xl border border-white/5 relative">
                <btn.icon size={52} className="text-gray-700" strokeWidth={1.5} />
                <div className="absolute -top-2 -right-2 bg-[#111] p-1.5 rounded-full border border-gray-700"><Lock size={14} className="text-gray-500" /></div>
              </div>
              <span className="font-mono text-xl font-black tracking-[0.2em] uppercase text-gray-600">{btn.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* MODALLAR */}
      <GatekeeperModal isOpen={activeModal === 'GATEKEEPER'} onClose={() => setActiveModal('NONE')} onSuccess={() => setActiveModal('ADMIN')} />
      <AdminModal isOpen={activeModal === 'ADMIN'} onClose={() => setActiveModal('NONE')} />
      <AuthModal isOpen={activeModal === 'AUTH'} onClose={() => setActiveModal('NONE')} />
    </div>
  );
};