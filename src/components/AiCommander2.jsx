import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Cpu } from 'lucide-react';

import { useGlobalState } from '../context/GlobalState';
import { usePomodoro } from '../hooks/usePomodoro';
import { useGeminiService2 } from '../hooks/useGeminiService2';
import { formatTime } from '../utils/formatters';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// V2 Alt Bileşenleri
import { PomodoroHeader } from './AiCommander/PomodoroHeader';
import { SubjectGrid2 } from './AiCommander/SubjectGrid2';
import { MarathonFinalReport2 } from './AiCommander/MarathonFinalReport2';
import { FocusScreen2 } from './AiCommander/FocusScreen2';
import { ControlBar } from './AiCommander/ControlBar';

// 1. MİMARİ GÜNCELLEME: Kota sınırları 12'den 20'ye çıkarıldı
const SUBJECTS = [
  { id: 'matematik', title: 'MATEMATİK', quota: 20, color: 'text-blue-400', border: 'border-blue-400/30' },
  { id: 'fen', title: 'FEN BİLGİSİ', quota: 20, color: 'text-green-400', border: 'border-green-400/30' },
  { id: 'turkce', title: 'TÜRKÇE', quota: 20, color: 'text-red-400', border: 'border-red-400/30' },
  { id: 'sosyal', title: 'SOSYAL BİLGİLER', quota: 20, color: 'text-yellow-400', border: 'border-yellow-400/30' }
];

const ROWS_PER_SUBJECT = 4;
// 20 x 4 Ders = 80 Global Kapasite
const GLOBAL_QUOTA = 80;

const POMO_CONFIGS = {
  turbo: { id: 'turbo', label: 'TURBO', focusTime: 10, shortBreak: 3, longBreak: 10 },
  klasik: { id: 'klasik', label: 'KLASİK', focusTime: 25, shortBreak: 6, longBreak: 15 },
  derin: { id: 'derin', label: 'DERİN', focusTime: 50, shortBreak: 12, longBreak: 30 }
};

export const AiCommander2 = () => {
  const navigate = useNavigate();
  const { dbUser, currentUser, aiConfig } = useGlobalState();
  const db = getFirestore();

  const { fetchQuestions, isAiLoading } = useGeminiService2();
  
  const [activePomoMode, setActivePomoMode] = useState('klasik');
  const pomodoro = usePomodoro(POMO_CONFIGS[activePomoMode]);

  const [aiQuestions, setAiQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  
  const [activeSubjects, setActiveSubjects] = useState(() => {
    const init = {};
    SUBJECTS.forEach(sub => init[sub.id] = true);
    return init;
  });

  const [matrix, setMatrix] = useState(() => {
    const initialState = {};
    SUBJECTS.forEach(sub => {
      initialState[sub.id] = Array(ROWS_PER_SUBJECT).fill({ topic: '', easy: '', medium: '', hard: '' });
    });
    return initialState;
  });

  const [examStatus, setExamStatus] = useState('IDLE');
  const [examStartTime, setExamStartTime] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  const { subjectTotals, globalTotal, isBlocked } = useMemo(() => {
    const totals = {};
    let gTotal = 0;
    let blocked = false;

    SUBJECTS.forEach(sub => {
      if (!activeSubjects[sub.id]) { totals[sub.id] = 0; return; }
      let subTotal = 0;
      matrix[sub.id].forEach(row => {
        subTotal += (Number(row.easy) || 0) + (Number(row.medium) || 0) + (Number(row.hard) || 0);
      });
      totals[sub.id] = subTotal;
      gTotal += subTotal;
      if (subTotal > sub.quota) blocked = true;
    });

    if (gTotal > GLOBAL_QUOTA) blocked = true;

    return { subjectTotals: totals, globalTotal: gTotal, isBlocked: blocked };
  }, [matrix, activeSubjects]);

  // 2. MİMARİ GÜNCELLEME: KİTAPÇIK HARİTASI (Booklet Mapping Engine)
  const bookletMap = useMemo(() => {
    const map = [];
    let current = 0;
    SUBJECTS.forEach(sub => {
      if (activeSubjects[sub.id] && subjectTotals[sub.id] > 0) {
        map.push({
          id: sub.id,
          title: sub.title,
          startIdx: current,
          endIdx: current + subjectTotals[sub.id] - 1,
          count: subjectTotals[sub.id]
        });
        current += subjectTotals[sub.id];
      }
    });
    return map;
  }, [subjectTotals, activeSubjects]);

  const handleInputChange = (subjectId, rowIndex, field, value) => {
    setMatrix(prev => {
      const newMatrix = { ...prev };
      const newSubjectRows = [...newMatrix[subjectId]];
      newSubjectRows[rowIndex] = { ...newSubjectRows[rowIndex], [field]: value };
      newMatrix[subjectId] = newSubjectRows;
      return newMatrix;
    });
  };

  const handleAiLaunch = async () => {
    if (isBlocked || globalTotal === 0) return;
    if (!aiConfig?.geminiKey) { alert("⚠️ Gemini API Anahtarı bulunamadı."); return; }
    
    const activeData = [];
    SUBJECTS.forEach(sub => {
      if (activeSubjects[sub.id]) {
        matrix[sub.id].forEach(row => {
          if (row.topic.trim() !== '' && (Number(row.easy) || Number(row.medium) || Number(row.hard))) {
            activeData.push(`${sub.title}: ${row.topic} (Kolay:${row.easy||0}, Orta:${row.medium||0}, Zor:${row.hard||0})`);
          }
        });
      }
    });

    const marathonConfig = {
      topicName: activeData.join(" | "),
      sinif: dbUser?.sinif || '7',
      soruSayisi: globalTotal
    };

    try {
      const questions = await fetchQuestions(aiConfig, marathonConfig);
      
      if (questions && questions.length > 0) {
        setAiQuestions(questions);
        setCurrentIdx(0);
        setUserAnswers({});
        setExamStartTime(Date.now());
        setExamStatus('IN_PROGRESS');
        if (pomodoro && pomodoro.startTimer) {
          pomodoro.startTimer();
        }
      } else {
        alert("⚠️ Yapay Zeka soruları oluşturamadı (Format veya Bağlantı Hatası). Lütfen konuları kontrol et.");
      }
    } catch (error) {
      console.error("Yapay Zeka Hatası:", error);
      alert("⚠️ Kritik Hata: Gemini servisiyle iletişim kurulamadı.");
    }
  };

  const handleFinishExam = async () => {
    const endTime = Date.now();
    const durationSeconds = Math.floor((endTime - examStartTime) / 1000);
    let correct = 0, wrong = 0, empty = 0, answered = 0;
    let aiAnalysis = [];

    aiQuestions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans === undefined || ans === null) { empty++; } 
      else {
        answered++;
        if (ans === q.correctOptionIndex) { correct++; } 
        else { 
          wrong++; 
          aiAnalysis.push({ 
            soru: q.text, ogrenciCevabi: q.options[ans], dogruCevap: q.options[q.correctOptionIndex], cozum: q.cozumAnalizi 
          }); 
        }
      }
    });

    const payload = {
      testAdi: "AI MARATON", toplamSoru: globalTotal, yanitlananSoru: answered, dogruSayisi: correct, yanlisSayisi: wrong,
      bosSayisi: empty, harcananSureSaniye: durationSeconds, performance: { durationFormatted: formatTime(durationSeconds) },
      skorRaporu: { correct, wrong, empty, aiAnalysis }, tamamlanmaTarihi: serverTimestamp()
    };

    setFinalReport(payload);
    setExamStatus('FINISHED');
    if (pomodoro && pomodoro.stopTimer) {
      pomodoro.stopTimer();
    }
    if (currentUser) {
      try { await addDoc(collection(db, `users/${currentUser.uid}/warHistory`), payload); } 
      catch (err) { console.error("Firebase kayıt hatası:", err); }
    }
  };

  const handleReturnToCenter = () => {
    setExamStatus('IDLE');
    setExamStartTime(null);
    setFinalReport(null);
    setAiQuestions([]);
    setCurrentIdx(0);
    setUserAnswers({});
    setMatrix(() => {
      const initialState = {};
      SUBJECTS.forEach(sub => {
        initialState[sub.id] = Array(ROWS_PER_SUBJECT).fill({ topic: '', easy: '', medium: '', hard: '' });
      });
      return initialState;
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-[#FDB912]/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12 border-b border-white/5 pb-6">
        <button onClick={() => navigate('/ai-study')} className="flex items-center gap-2 text-gray-500 hover:text-[#FDB912] transition-all font-black text-[10px] uppercase tracking-[0.3em]">
          <ArrowLeft size={16} /> Karargaha Dön
        </button>
        <div className="flex items-center gap-3 bg-[#FDB912]/5 border border-[#FDB912]/20 px-6 py-2 rounded-2xl">
          <GraduationCap className="text-[#FDB912]" size={20} />
          <span className="text-white font-black text-[10px] uppercase tracking-widest">{dbUser?.sinif || '7'}. SINIF MARATONU</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {isAiLoading ? (
          <div className="py-40 flex flex-col items-center gap-6 animate-pulse">
            <Cpu size={64} className="text-[#FDB912] animate-spin" />
            <p className="text-[#FDB912] font-black tracking-[0.5em] text-[10px] uppercase">Yapay Zeka Maraton Hazırlıyor...</p>
          </div>
        ) : examStatus === 'FINISHED' ? (
          <MarathonFinalReport2 
            report={finalReport} 
            onReturn={handleReturnToCenter} 
          />
        ) : examStatus === 'IN_PROGRESS' ? (
          <FocusScreen2 
            state={{ 
              questions: aiQuestions, 
              currentIdx, 
              userAnswers, // 3. MİMARİ GÜNCELLEME: Tüm tabloyu sahaya iletiyoruz (Optik Form için)
              formData: { courseName: 'AI MARATON', topic: 'Karışık' }, 
              aiLevelLabel: 'ADAPTİF',
              bookletMap   // Kitapçık Sınır Haritası
            }} 
            actions={{ 
              handleAnswerSelect: (idx) => setUserAnswers(prev => ({...prev, [currentIdx]: idx})), 
              handleNext: () => currentIdx < aiQuestions.length - 1 ? setCurrentIdx(prev => prev + 1) : handleFinishExam(), 
              handlePrev: () => setCurrentIdx(prev => Math.max(0, prev - 1)), 
              handleStop: handleReturnToCenter,
              handleJump: (idx) => setCurrentIdx(Math.max(0, Math.min(idx, aiQuestions.length - 1))) // Shortcut fonksiyonu
            }}
            pomodoro={pomodoro}
          />
        ) : (
          <div className="animate-in fade-in duration-1000 w-full">
            <PomodoroHeader pomodoro={pomodoro} examStatus={examStatus} activePomoMode={activePomoMode} setActivePomoMode={setActivePomoMode} pomoConfigs={POMO_CONFIGS} />
            <SubjectGrid2 subjects={SUBJECTS} matrix={matrix} subjectTotals={subjectTotals} examStatus={examStatus} activeSubjects={activeSubjects} onToggleSubject={(id) => setActiveSubjects(p => ({ ...p, [id]: !p[id] }))} onInputChange={handleInputChange} />
            <div className="mt-12 w-full">
              <ControlBar examStatus={examStatus} isBlocked={isBlocked} globalTotal={globalTotal} globalQuota={GLOBAL_QUOTA} onStart={handleAiLaunch} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};