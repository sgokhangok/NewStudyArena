import { useState, useEffect } from 'react';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useGlobalState } from '../../context/GlobalState';
import { useMasterPomodoro, POMODORO_PRESETS } from '../../hooks/useMasterPomodoro';
import { useGeminiService } from '../../hooks/useGeminiService';

export const useCommanderLogic = () => {
  const { setTrainingConfig, dbUser, firebaseInstance, aiConfig, activeAiSession, setActiveAiSession } = useGlobalState();
  
  const { initSession, startFocus, formatTime, pauseTimer, mode, isActive, timeLeft, completedSets } = useMasterPomodoro();
  const { questions, isAiLoading, errorToast, fetchQuestions, clearQuestions, setQuestions } = useGeminiService();
  
  const [localDbUser, setLocalDbUser] = useState(dbUser);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Ekrana Yansıyan Durumlar
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0); 
  const [selectedAnswer, setSelectedAnswer] = useState(null); 
  
  // AI Tutor & Hafıza Durumları
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [wrongQuestionsLog, setWrongQuestionsLog] = useState([]);
  const [formData, setFormData] = useState({ courseName: '', topic: '', easy: 0, medium: 0, hard: 0 });
  const [selectedPreset, setSelectedPreset] = useState('STANDARD');

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // --- 1. KURULUM VE SAYFA YENİLENMESİ (HAFIZA) KONTROLÜ ---
  useEffect(() => {
    const sync = async () => {
      if (dbUser) setLocalDbUser(dbUser);
      else if (firebaseInstance?.db && firebaseInstance?.auth?.currentUser) {
        const docSnap = await getDoc(doc(firebaseInstance.db, 'users', firebaseInstance.auth.currentUser.uid));
        if (docSnap.exists()) setLocalDbUser(docSnap.data());
      }
    };
    sync();

    // Eğer GlobalState'de yarım kalmış bir test varsa kurtar (Sayfa yenilendiğinde)
    if (activeAiSession && activeAiSession.isStarted && !activeAiSession.isCompleted) {
      setFormData(activeAiSession.formData);
      setQuestions(activeAiSession.questions);
      setCurrentIdx(activeAiSession.currentIdx);
      setScore(activeAiSession.score);
      setWrongQuestionsLog(activeAiSession.wrongQuestionsLog);
      setIsStarted(true);
      setSelectedPreset(activeAiSession.selectedPreset);
    }
  }, [dbUser, firebaseInstance, activeAiSession, setQuestions]);

  // Her soru/skor değişiminde GlobalState'i güncelle (Veri kaybetmemek için)
  useEffect(() => {
    if (isStarted && !isCompleted && setActiveAiSession) {
      setActiveAiSession({
        isStarted, isCompleted, currentIdx, score, wrongQuestionsLog, formData, questions, selectedPreset
      });
    }
  }, [currentIdx, score, isStarted, isCompleted, setActiveAiSession, wrongQuestionsLog, formData, questions, selectedPreset]);

  const totalQuestions = Number(formData.easy||0) + Number(formData.medium||0) + Number(formData.hard||0);
  const isReady = formData.courseName.trim() && formData.topic.trim() && totalQuestions > 0 && totalQuestions <= 12 && localDbUser?.sinif;

  // --- 2. YAPAY ZEKA RADARI (OPERASYONU BAŞLAT) ---
  const handleLaunch = async () => {
    if (!isReady) return;
    if (!aiConfig?.geminiKey) return alert("Kaptan, Operasyon için Gemini API Anahtarı eksik!");

    try {
      setCurrentIdx(0); 
      setSelectedAnswer(null);
      setIsCompleted(false); 
      setScore({ correct: 0, wrong: 0 });
      setWrongQuestionsLog([]);
      setShowFeedback(false);
      setIsGenerating(true);
      
      initSession(selectedPreset); 

      const currentTrainingConfig = {
        courseName: formData.courseName, topicName: formData.topic, sinif: localDbUser.sinif, seviye: 'Karma', soruSayisi: totalQuestions
      };

      await fetchQuestions(aiConfig, currentTrainingConfig);
    } catch (err) {
      setIsGenerating(false);
      alert("Ateşleme Hatası!");
    }
  };

  useEffect(() => {
    if (questions && questions.length > 0 && isGenerating) {
      setIsGenerating(false);
      setIsStarted(true);
    }
  }, [questions, isGenerating]);

  // --- 3. AI TUTOR (CEVAP KONTROLÜ) ---
  const handleAnswerSelect = async (index) => {
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentIdx].correctOptionIndex;

    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      await sleep(800); // Doğruysa 0.8 saniye yeşil yansın, sonra diğer soruya geçsin
      proceedToNextQuestion();
    } else {
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
      setWrongQuestionsLog(prev => [...prev, {
        soru: questions[currentIdx].text,
        konu: formData.topic,
        ogrencininCevabi: questions[currentIdx].options[index],
        dogruCevap: questions[currentIdx].options[questions[currentIdx].correctOptionIndex]
      }]);
      setShowFeedback(true); // Yanlışsa AI Tutor devreye girer, ekran kilitlenir
    }
  };

  const proceedToNextQuestion = async () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentIdx + 1 < questions?.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      await finalizeTest();
    }
  };

  // --- 4. FIREBASE VERİ MADENCİLİĞİ ---
  const finalizeTest = async () => {
    pauseTimer(); 
    setIsCompleted(true); 
    if (setActiveAiSession) setActiveAiSession(null); // Hafızayı temizle

    // Firebase'e Karnesini Gönder
    if (firebaseInstance?.db && localDbUser?.uid) {
      try {
        await addDoc(collection(firebaseInstance.db, 'users', localDbUser.uid, 'ai_sessions'), {
          timestamp: serverTimestamp(),
          bolum_konu: `${formData.courseName} - ${formData.topic}`,
          skor: {
            toplam: questions.length,
            dogru: score.correct, // Sorunsuz state güncellendiği için son durumu alır
            yanlis: score.wrong + (selectedAnswer !== questions[currentIdx].correctOptionIndex ? 1 : 0) // Son sorunun yanlışlığını da hesaplar
          },
          analiz: wrongQuestionsLog,
          pomodoroDöngüsü: completedSets
        });
      } catch (err) {
        console.error("Veri Firebase'e işlenirken hata oluştu:", err);
      }
    }
  };

  const handleStop = () => {
    setIsStarted(false); setIsCompleted(false); setTrainingConfig(null);
    setSelectedAnswer(null); setCurrentIdx(0); clearQuestions(); setShowFeedback(false);
    if (setActiveAiSession) setActiveAiSession(null);
    pauseTimer(); 
  };

  return {
    state: { localDbUser, isGenerating, isStarted, isCompleted, currentIdx, selectedAnswer, formData, selectedPreset, questions, isAiLoading, errorToast, mode, isActive, isReady, totalQuestions, showFeedback, score },
    actions: { setFormData, setSelectedPreset, handleLaunch, handleAnswerSelect, handleStop, startFocus, proceedToNextQuestion },
    pomodoro: { formatTime, curtainAdapter: { isCurtainDown: isStarted && mode !== 'FOCUS', cycleCount: completedSets, molaTime: timeLeft, isWaitingForApproval: !isActive && mode !== 'FOCUS', continueSession: () => startFocus(), formatTime: () => formatTime() }, remainingSetsForLongBreak: 4 - (completedSets % 4), currentSetDisplay: (completedSets % 4) + 1, completedCycles: Math.floor(completedSets / 4) }
  };
};