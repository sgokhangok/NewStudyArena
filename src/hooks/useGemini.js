import { useState, useEffect } from 'react';
import { useGlobalState } from '../context/GlobalState';

// ARENA ZEKA MOTORU: GEMINI BAĞLANTI KANCASI
export const useGemini = () => {
  const { aiConfig } = useGlobalState();
  const [isConnected, setIsConnected] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    // API Key varsa bağlantı aktif kabul edilir
    if (aiConfig?.geminiKey) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [aiConfig]);

  // Burası ilerde AI ile yapılacak test sorguları için genişletilebilir
  const checkConnection = async () => {
    if (!aiConfig?.geminiKey) return false;
    return true;
  };

  return { isConnected, isAiLoading, checkConnection };
};