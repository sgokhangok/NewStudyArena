import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { PdfViewer } from '../components/war/PdfViewer';
import { WarPomodoroTimer } from '../components/war/WarPomodoroTimer';
import { OpticProForm } from '../components/war/OpticProForm';

import { PomodoroCurtain } from '../components/PomodoroCurtain';
import { useMasterPomodoro } from '../hooks/useMasterPomodoro';

export const AITestWarScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { test, pomodoroKey } = location.state || {};

  const [userAnswers, setUserAnswers] = useState({});
  // Savaş durumu UI'ını buradan kaldırdık çünkü artık doğrudan diğer ekrana uçacağız.

  const pomodoro = useMasterPomodoro();

  useEffect(() => {
    if (!test || !pomodoroKey) {
      navigate('/adrenalin-arena');
    } else {
      pomodoro.initSession(pomodoroKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  if (!test) return null;

  const handleFinishBattle = () => {
    // Sadece A, B, C, D, E harflerini ayıklar.
    const answerKeyStr = test.cevapAnahtari ? test.cevapAnahtari.toUpperCase().replace(/[^A-E]/g, '') : '';
    const totalQ = answerKeyStr.length || Object.keys(userAnswers).length || 20;
    
    let correct = 0, wrong = 0, empty = 0;
    let details = []; // 🚀 GÜNCELLEME: Yeni analiz ekranı için çanta hazırlanıyor

    for (let i = 0; i < totalQ; i++) {
      const qNum = i + 1;
      const userAns = userAnswers[qNum];
      const correctAns = answerKeyStr[i];
      
      let status = 'empty';

      if (!userAns) {
        empty++;
      } else if (correctAns && userAns === correctAns) {
        correct++;
        status = 'correct';
      } else {
        wrong++;
        status = 'wrong';
      }

      details.push({
        qNum,
        userAns: userAns || '-',
        correctAns: correctAns || '?',
        status
      });
    }

    // Zamanlayıcıyı durdur
    if (pomodoro.isActive) {
      pomodoro.pauseTimer();
    }

    const battleReportData = { total: totalQ, correct, wrong, empty, details };

    // 🚀 GÜNCELLEME BURADA: UI değiştirmek yerine, paketi alıp doğrudan Gelişim Karargahına uçurur.
    navigate('/adrenalin-analiz', { 
      state: { test, battleReport: battleReportData, isFresh: true } 
    });
  };

  const curtainAdapter = {
    isCurtainDown: pomodoro.mode !== 'FOCUS',
    cycleCount: pomodoro.completedSets,
    molaTime: pomodoro.timeLeft,
    isWaitingForApproval: !pomodoro.isActive,
    continueSession: pomodoro.startFocus,
    formatTime: pomodoro.formatTime 
  };

  return (
    <div className="h-screen w-screen bg-[#050505] text-white p-4 md:p-6 font-sans flex flex-col relative overflow-hidden">
      
      <PomodoroCurtain pomodoro={curtainAdapter} onSessionContinue={() => console.log("Mola Geri Sayımı Başladı")} />

      <header className="flex justify-between items-center mb-6 shrink-0">
        <button 
          onClick={() => navigate('/adrenalin-arena')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#FDB912] transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase">Terk Et</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-black italic tracking-widest text-white uppercase">
            {test.testAdi}
          </h1>
          <p className="text-[#FDB912] text-[10px] font-bold tracking-[0.3em] uppercase mt-1">
            Hedef: {test.konu}
          </p>
        </div>
        <div className="w-[80px]"></div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        <div className="lg:col-span-8 h-full min-h-0">
          <PdfViewer fileUrl={test.dosyaLink} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
          <WarPomodoroTimer pomodoro={pomodoro} />
          
          {/* 🚀 GÜNCELLEME: Savaş bittiyse (zaten bu ekranda kalmıyor) Optik Form her zaman açık kalıyor */}
          <OpticProForm 
            answers={userAnswers} 
            setAnswers={setUserAnswers} 
            answerKey={test.cevapAnahtari}
            onFinishBattle={handleFinishBattle}
          />
        </div>
      </main>
    </div>
  );
};