import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../context/GlobalState';
import { useGemini } from '../hooks/useGemini';
import { RefreshCw, WifiOff } from 'lucide-react';

export const ConnectionWatchdog = () => {
  const { aiConfig } = useGlobalState();
  const { checkConnection } = useGemini();
  
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [lastCheckStatus, setLastCheckStatus] = useState(true);

  // ⚙️ PARAMETRİK SÜRE YÖNETİMİ
  // aiConfig içinde 'watchdogInterval' varsa onu kullan (milisaniye), yoksa 60sn varsayılan olsun.
  const CHECK_INTERVAL = aiConfig?.watchdogInterval || 60000; 

  const performHeartbeat = async () => {
    if (aiConfig?.geminiKey) {
      const isAlive = await checkConnection();
      
      if (!isAlive && lastCheckStatus) {
        setLastCheckStatus(false);
        setIsAlertOpen(true);
      } else if (isAlive && !lastCheckStatus) {
        setLastCheckStatus(true);
        setIsAlertOpen(false);
      }
    }
  };

  useEffect(() => {
    // İlk kontrolü hemen yap
    performHeartbeat();

    // Periyodik kontrolü başlat
    const heartbeat = setInterval(() => {
      performHeartbeat();
    }, CHECK_INTERVAL);

    // 🔥 KRİTİK: Eğer CHECK_INTERVAL değişirse eski interval'i temizle ve yenisini kur
    return () => clearInterval(heartbeat);
    
    // Bağımlılık dizisine CHECK_INTERVAL eklendi; böylece süre değiştiğinde sistem kendini günceller.
  }, [aiConfig?.geminiKey, CHECK_INTERVAL, lastCheckStatus]);

  if (!isAlertOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-[#111] border-2 border-red-600/50 p-8 rounded-[2rem] max-w-sm w-full text-center shadow-[0_0_50px_rgba(220,38,38,0.2)]">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-600/10 rounded-full text-red-600 animate-bounce">
            <WifiOff size={48} />
          </div>
        </div>
        
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">
          BAĞLANTI KESİLDİ
        </h3>
        <p className="text-gray-400 text-sm font-bold mb-8 leading-relaxed">
          Sistem şu an {CHECK_INTERVAL / 1000} saniyelik periyotlarla sinyal aramaya devam ediyor...
        </p>

        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all"
        >
          <RefreshCw size={20} /> SİNYALİ YENİLE
        </button>
      </div>
    </div>
  );
};