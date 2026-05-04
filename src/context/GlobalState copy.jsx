import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'; // 🚀 onSnapshot eklendi

const GlobalStateContext = createContext();
export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
  const [firebaseInstance, setFirebaseInstance] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [dbUser, setDbUser] = useState(null); // 🚀 dbUser artık Global State'in bir parçası!

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
        if (!user) setDbUser(null); // Kullanıcı çıkış yaparsa verisini temizle
      });
    } catch (e) { console.error("Firebase Hatası:", e); }
  };

  // 📡 OTOMATİK VERİTABANI TAKİBİ (YENİ!)
  // Kullanıcı giriş yaptığı anda Firestore'dan verilerini canlı olarak çeker
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

  // 💾 OTOMATİK MÜHÜRLEME
  useEffect(() => { localStorage.setItem('arena_ai_config', JSON.stringify(aiConfig)); }, [aiConfig]);
  useEffect(() => { 
    if (trainingConfig) localStorage.setItem('arena_training_config', JSON.stringify(trainingConfig));
    else localStorage.removeItem('arena_training_config');
  }, [trainingConfig]);

  return (
    <GlobalStateContext.Provider value={{ 
      currentUser, setCurrentUser, 
      dbUser, setDbUser, // 🚀 dbUser artık her yerden erişilebilir!
      firebaseInstance, systemConfig, 
      setSystemConfig, aiConfig, setAiConfig, initFirebaseCore, 
      trainingConfig, setTrainingConfig 
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};