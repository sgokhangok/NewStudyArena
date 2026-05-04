import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Settings, LogOut, BrainCircuit, Zap, Crosshair } from 'lucide-react';
import { signOut } from 'firebase/auth';

import { useGlobalState } from '../context/GlobalState';
import { useGemini } from '../hooks/useGemini';
import { AiBadge } from '../components/AiBadge';
import { CloudBadge } from '../components/CloudBadge';
import { GamesModule } from '../components/GamesModule';
import { SettingsCard } from '../components/SettingsCard';
import { AdminModal } from '../components/AdminModal';
import { SettingsModal } from '../components/SettingsModal';
import { ConnectionWatchdog } from '../components/ConnectionWatchdog';
import { GatekeeperModal } from '../components/GatekeeperModal'; 
import { SystemBootRoom } from '../components/SystemBootRoom'; 
// 🚀 YENİ MODÜLÜMÜZÜ IMPORT ETTİK
import { ArenaSettingsModal } from '../components/ArenaSettingsModal'; 

export const LobbyScreen = () => {
  const { firebaseInstance, currentUser, setCurrentUser, dbUser, aiConfig } = useGlobalState();
  const { checkConnection } = useGemini();
  
  const [isAiSuccess, setIsAiSuccess] = useState(false);
  const [activeModal, setActiveModal] = useState('NONE');
  const navigate = useNavigate();
  const [flowStage, setFlowStage] = useState('BOOT'); 
  const hasApiKey = !!aiConfig?.geminiKey?.trim();

  useEffect(() => {
    if (!currentUser || !firebaseInstance) { navigate('/'); }
  }, [currentUser, firebaseInstance, navigate]);

  useEffect(() => {
    if (flowStage === 'READY') {
      const runPing = async () => {
        if (hasApiKey) {
          const success = await checkConnection();
          setIsAiSuccess(success);
        } else {
          setIsAiSuccess(false);
        }
      };
      runPing();
    }
  }, [aiConfig, checkConnection, hasApiKey, flowStage]);

  const handleLogout = async () => {
    if (firebaseInstance?.auth) {
      await signOut(firebaseInstance.auth);
      setCurrentUser(null);
      navigate('/');
    }
  };

  if (flowStage === 'BOOT') {
    return <SystemBootRoom onComplete={() => setFlowStage('READY')} />;
  }

  // 🛡️ ARENA STANDART ZIRH
  const ArenaContainer = ({ children, onClick, isYellow = false }) => (
    <div 
      onClick={onClick}
      className={`
        w-full h-full relative group overflow-hidden rounded-[2.5rem] p-8
        border ${isYellow ? 'border-[#FDB912]/40 shadow-[#FDB912]/5' : 'border-white/10 shadow-black'}
        bg-[#0A0A0A] hover:bg-[#111] transition-all duration-300
        flex flex-col items-center justify-center gap-4 cursor-pointer
        hover:scale-[1.02] active:scale-[0.98] shadow-2xl
        hover:border-[#FDB912]/60
      `}
    >
      <div className="absolute -inset-24 bg-[#FDB912]/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </div>
  );

  // 🛡️ AI ARENA KULE ZIRHI
  const AiArenaTower = ({ onClick }) => (
    <div 
      onClick={onClick}
      className="
        w-full h-full relative group overflow-hidden rounded-[2.5rem] p-8
        border-2 border-[#FDB912]/40 hover:border-[#FDB912]
        bg-[#0A0A0A] hover:bg-[#111] transition-all duration-300
        flex flex-col items-center justify-center gap-6 cursor-pointer
        hover:scale-[1.01] active:scale-[0.99]
        shadow-[0_0_20px_rgba(253,185,18,0.1)] hover:shadow-[0_0_40px_rgba(253,185,18,0.2)]
      "
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDB912]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative">
        <Crosshair size={84} className="text-[#FDB912] group-hover:scale-110 group-hover:rotate-90 transition-all duration-700 drop-shadow-[0_0_15px_rgba(253,185,18,0.4)]" />
        <div className="absolute -top-4 -right-8 bg-[#FDB912] text-black text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(253,185,18,0.6)] animate-bounce">
          YENİ
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-3xl font-black italic tracking-widest uppercase text-white">AI ARENA</h3>
        <p className="text-[#FDB912]/70 text-[11px] font-bold tracking-[0.3em] uppercase mt-2">
          ADRENALİN OPERASYONU
        </p>
        <div className="mt-6 flex flex-col gap-2">
           <span className="text-[9px] text-gray-500 font-mono tracking-wider">RESMİ TESTLER</span>
           <span className="text-[9px] text-gray-500 font-mono tracking-wider">OPTİK ANALİZ</span>
           <span className="text-[9px] text-gray-500 font-mono tracking-wider">V2 MENTÖR</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col relative z-10 overflow-hidden text-white font-sans bg-[#050505]">
      
      {/* HEADER */}
      <header className="h-[80px] w-full bg-[#111]/90 backdrop-blur-xl border-b border-white/10 px-8 flex justify-between items-center z-50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-[#FDB912]">
            <Gamepad2 size={24} className="text-black" />
          </div>
          <span className="font-black text-2xl tracking-tighter italic uppercase">🎮 ARENA</span>
        </div>
        <div className="flex items-center gap-4">
          <AiBadge active={isAiSuccess && hasApiKey} />
          <CloudBadge connected={!!firebaseInstance} />
          
          {/* 🚀 ÜSTTEKİ DİŞLİ HALA ŞİFRELİ (GATEKEEPER) YOLA ÇIKAR */}
          <button onClick={() => setActiveModal('GATEKEEPER')} className="bg-white/5 p-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
             <Settings size={18} className="text-gray-400" />
          </button>
          
          <button onClick={handleLogout} className="bg-white/5 text-gray-400 p-2 px-4 rounded-lg border border-white/5 text-xs font-bold font-mono uppercase">
            <LogOut size={14} className="inline mr-2" /> ÇIKIŞ
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[90rem] mx-auto px-6 py-4">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-white leading-tight">
            HOŞ GELDİN KAPTAN <br/>
            <span className="text-[#FDB912]">{dbUser?.ad_soyad || 'ŞAMPİYON'}!</span>
          </h2>
        </div>

        <div className="w-full h-[70vh] max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <ArenaContainer onClick={() => navigate('/ai-study')} isYellow={true}>
              <div className="p-4 rounded-full bg-[#FDB912]/10 text-[#FDB912] group-hover:scale-110 transition-transform">
                <BrainCircuit size={48} strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-black italic tracking-widest uppercase">🧠 AI İLE DERS ÇALIŞ</h3>
                <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Sınav Üssüne Geçiş Yap</p>
              </div>
            </ArenaContainer>

            <ArenaContainer onClick={() => navigate('/watch')} isYellow={true}>
              <div className="p-4 rounded-full bg-[#FDB912] text-black group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(253,185,18,0.3)]">
                <Zap size={48} fill="black" />
              </div>
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-black text-[#FDB912] italic tracking-widest uppercase">⚡ AI İLE İZLE</h3>
                <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-1 text-center">Video Operasyon Merkezi</p>
              </div>
            </ArenaContainer>

            <ArenaContainer isYellow={true}>
              <div className="w-full h-full flex items-center justify-center">
                 <GamesModule className="w-full h-full" />
              </div>
            </ArenaContainer>

            {/* 🚀 DEV KART ARTIK ŞİFRESİZ YENİ ROTAYA (ARENA_SETTINGS) GİDER */}
            <ArenaContainer onClick={() => setActiveModal('ARENA_SETTINGS')} isYellow={true}>
              <div className="w-full h-full flex items-center justify-center pointer-events-none">
                 <SettingsCard className="w-full h-full" />
              </div>
            </ArenaContainer>

          </div>

          <div className="h-full">
            <AiArenaTower onClick={() => navigate('/adrenalin-arena')} />
          </div>

        </div>
      </main>

      {/* MODALLAR */}
      <GatekeeperModal isOpen={activeModal === 'GATEKEEPER'} onClose={() => setActiveModal('NONE')} onSuccess={() => setActiveModal('ADMIN')} />
      <AdminModal isOpen={activeModal === 'ADMIN'} onClose={() => setActiveModal('NONE')} />
      <SettingsModal isOpen={activeModal === 'SETTINGS'} onClose={() => setActiveModal('NONE')} />
      
      {/* 🚀 YENİ MODÜLÜMÜZ BURAYA EKLENDİ */}
      <ArenaSettingsModal isOpen={activeModal === 'ARENA_SETTINGS'} onClose={() => setActiveModal('NONE')} />
      
      <ConnectionWatchdog /> 
    </div>
  );
};