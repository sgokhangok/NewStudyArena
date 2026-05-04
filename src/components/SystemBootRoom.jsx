import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Cpu, AlertTriangle, RefreshCw } from 'lucide-react';
import { useGlobalState } from '../context/GlobalState';
import { useGemini } from '../hooks/useGemini';

export const SystemBootRoom = ({ onComplete }) => {
  // 🚀 DİKKAT: dbUser artık doğrudan ana depodan (GlobalState) geliyor!
  const { currentUser, firebaseInstance, dbUser, aiConfig } = useGlobalState();
  const { checkConnection } = useGemini();
  
  const [status, setStatus] = useState('CONNECTING'); 
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const MAX_RETRY_TIME = 15000; 
  const PING_INTERVAL = 3000;  

  const runHandshake = async () => {
    // 🚀 DİKKAT: dbUser gelene kadar bekleyecek!
    if (!currentUser || !firebaseInstance || !dbUser || !aiConfig?.geminiKey) {
      return;
    }

    const isAlive = await checkConnection();

    if (isAlive) {
      setStatus('SUCCESS');
      clearAllTimers();
      setTimeout(() => onComplete(), 1000); 
    } else {
      setStatus('RETRYING');
      setRetryCount(prev => prev + 1);
    }
  };

  const clearAllTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    runHandshake();

    intervalRef.current = setInterval(() => {
      runHandshake();
    }, PING_INTERVAL);

    timeoutRef.current = setTimeout(() => {
      if (status !== 'SUCCESS') {
        setStatus('ERROR');
        clearAllTimers();
      }
    }, MAX_RETRY_TIME);

    return () => clearAllTimers();
  }, [currentUser, firebaseInstance, dbUser, aiConfig]); 

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-[100] flex flex-col items-center justify-center text-white font-mono p-6">
      <div className="relative mb-10">
        {status === 'ERROR' ? (
          <AlertTriangle size={80} className="text-red-600 animate-bounce" />
        ) : (
          <>
            <Cpu size={80} className={`transition-colors duration-500 ${status === 'SUCCESS' ? 'text-green-500' : 'text-[#FDB912] animate-pulse'}`} />
            <Loader2 size={100} className={`absolute -top-2.5 -left-2.5 text-[#FDB912]/20 animate-spin ${status === 'SUCCESS' ? 'hidden' : ''}`} />
          </>
        )}
      </div>

      <h2 className={`text-xl font-black italic tracking-[0.3em] uppercase mb-4 ${status === 'ERROR' ? 'text-red-600' : 'text-[#FDB912]'}`}>
        {status === 'ERROR' ? 'BAĞLANTI KESİLDİ' : 'SİSTEM ENTEGRASYONU'}
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-3">
        <div className="flex justify-between text-[10px] tracking-tighter">
          <span className="text-gray-500 uppercase">Güvenlik (Auth):</span>
          <span className={currentUser ? "text-green-500" : "text-red-500"}>{currentUser ? "OK" : "BEKLENİYOR"}</span>
        </div>
        <div className="flex justify-between text-[10px] tracking-tighter">
          <span className="text-gray-500 uppercase">Veritabanı Senkronu:</span>
          {/* 🚀 dbUser durumu ekranda gösteriliyor */}
          <span className={dbUser ? "text-green-500" : "text-red-500"}>{dbUser ? "BAĞLANDI" : "ARANIYOR"}</span>
        </div>
        <div className="flex justify-between text-[10px] tracking-tighter border-t border-white/5 pt-2">
          <span className="text-gray-500 uppercase">Yapay Zeka (Ping):</span>
          <span className={status === 'SUCCESS' ? "text-green-500" : "text-yellow-500"}>
            {status === 'SUCCESS' ? "AKTİF" : status === 'ERROR' ? "TIMEOUT" : `DENENİYOR (${retryCount})`}
          </span>
        </div>
      </div>

      {status === 'ERROR' && (
        <button 
          onClick={() => window.location.reload()} 
          className="mt-8 flex items-center gap-3 bg-red-600/20 text-red-500 border border-red-600/50 px-8 py-4 rounded-xl font-black hover:bg-red-600 hover:text-white transition-all"
        >
          <RefreshCw size={20} /> SİSTEMİ YENİDEN BAŞLAT
        </button>
      )}

      <p className="mt-8 text-[9px] text-gray-700 tracking-[0.5em] uppercase animate-pulse">
        {status === 'SUCCESS' ? "GİRİŞ İZNİ VERİLDİ" : "Güvenli bağlantı katmanı oluşturuluyor"}
      </p>
    </div>
  );
};