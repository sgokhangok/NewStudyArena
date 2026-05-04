import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'; 

const GlobalStateContext = createContext();
export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
  const [firebaseInstance, setFirebaseInstance] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [dbUser, setDbUser] = useState(null); 

  // 🛡️ HAFIZALI STATE'LER
  const [systemConfig, setSystemConfig] = useState(() => {
    const saved = localStorage.getItem('arena_secure_config');
    return saved ? JSON.parse(saved) : null;
  });

  const [aiConfig, setAiConfig] = useState(() => {
    const saved = localStorage.getItem('arena_ai_config');
    return saved ? JSON.parse(saved) : { geminiKey: "", watchdogInterval: 60000 };
  });

  const [trainingConfig, setTrainingConfig] = useState(() => {
    const saved = localStorage.getItem('arena_training_config');
    return saved ? JSON.parse(saved) : null;
  });

  // 🚀 YENİ EKLENEN: ARENA SHEETS LİNKİ (Veri Uçuculuğuna Sıfır Tolerans)
  const [arenaSheetsLink, setArenaSheetsLink] = useState(() => {
    return localStorage.getItem('arena_sheets_link') || '';
  });

  // 🔥 FIREBASE BAŞLATICI
  const initFirebaseCore = (config) => {
    if (!config || !config.apiKey) return;
    try {
      const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
      const auth = getAuth(app);
      const db = getFirestore(app);
      setFirebaseInstance({ app, auth, db });
      
      onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        if (!user) setDbUser(null); 
      });
    } catch (e) { console.error("Firebase Hatası:", e); }
  };

  // 📡 OTOMATİK VERİTABANI TAKİBİ
  useEffect(() => {
    if (currentUser && firebaseInstance?.db) {
      const unsubscribe = onSnapshot(
        doc(firebaseInstance.db, 'users', currentUser.uid), 
        (docSnap) => {
          if (docSnap.exists()) {
            setDbUser(docSnap.data());
            console.log("✅ Kullanıcı verisi senkronize edildi:", docSnap.data().ad_soyad);
          }
        }
      );
      return () => unsubscribe();
    }
  }, [currentUser, firebaseInstance]);

  useEffect(() => { if (systemConfig) initFirebaseCore(systemConfig); }, []);

  // 💾 OTOMATİK MÜHÜRLEME (LOCALSTORAGE)
  useEffect(() => { localStorage.setItem('arena_ai_config', JSON.stringify(aiConfig)); }, [aiConfig]);
  useEffect(() => { 
    if (trainingConfig) localStorage.setItem('arena_training_config', JSON.stringify(trainingConfig));
    else localStorage.removeItem('arena_training_config');
  }, [trainingConfig]);
  
  // 🚀 YENİ: Sheets Linkini her değiştiğinde LocalStorage'a mühürle
  useEffect(() => { 
    localStorage.setItem('arena_sheets_link', arenaSheetsLink); 
  }, [arenaSheetsLink]);

  return (
    <GlobalStateContext.Provider value={{ 
      currentUser, setCurrentUser, 
      dbUser, setDbUser, 
      firebaseInstance, systemConfig, 
      setSystemConfig, aiConfig, setAiConfig, initFirebaseCore, 
      trainingConfig, setTrainingConfig,
      arenaSheetsLink, setArenaSheetsLink // 🚀 Yeni veriyi sisteme sunduk
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};