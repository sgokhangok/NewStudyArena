import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGlobalState } from './context/GlobalState';

// SAYFALAR (Ekrana basılacak ana modüller)
import { HomeScreen } from './screens/HomeScreen';
import { LobbyScreen } from './screens/LobbyScreen';
import { WorkScreen } from './screens/WorkScreen';
import { AiStudyScreen } from './screens/AiStudyScreen';
import { AiWatchScreen } from './screens/AiWatchScreen'; 
import { AITestSelectionScreen } from './screens/AITestSelectionScreen'; 
import { AITestWarScreen } from './screens/AITestWarScreen'; 
// 🚀 GÜNCELLEME: Gelişim Karargahı (Analiz Ekranı) import edildi
import { AITestAnalizScreen } from './screens/AITestAnalizScreen'; 

export default function App() {
  const { currentUser, trainingConfig } = useGlobalState();

  // Kaptanın Zafer Sinyali
  console.log("KAPTANIN KODU DOĞRU DOSYADA ÇALIŞIYOR!");

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white selection:bg-[#FDB912] selection:text-black font-sans relative overflow-x-hidden">
      {/* Arka Plan Izgarası (Grid)  */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Sayfa Yönlendirmeleri */}
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/lobby" element={currentUser ? <LobbyScreen /> : <Navigate to="/" />} />
          <Route path="/work" element={currentUser && trainingConfig ? <WorkScreen /> : <Navigate to="/lobby" />} />
          <Route path="/ai-study" element={currentUser ? <AiStudyScreen /> : <Navigate to="/" />} />
          <Route path="/watch" element={currentUser ? <AiWatchScreen /> : <Navigate to="/" />} />
          
          <Route path="/adrenalin-arena" element={currentUser ? <AITestSelectionScreen /> : <Navigate to="/" />} />
          <Route path="/adrenalin-war" element={currentUser ? <AITestWarScreen /> : <Navigate to="/" />} />
          
          {/* 🚀 GÜNCELLEME: Siyah ekranı çözen, Analiz Ekranı Rotası eklendi */}
          <Route path="/adrenalin-analiz" element={currentUser ? <AITestAnalizScreen /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}