/**
 * AiCommander2 - Beyin Katmanı (V2)
 * Kural 1: Maksimum 12 Soru Sınırı
 * Kural 2: Manuel AI Seviye Kontrolü (Up/Down)
 * Kural 3: Gelişmiş Navigasyon (Next/Prev)
 */

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useGlobalState } from '../../context/GlobalState';
import { useMasterPomodoro, POMODORO_PRESETS } from '../../hooks/useMasterPomodoro';
import { useGeminiService } from '../../hooks/useGeminiService';

export const useCommanderLogic2 = () => {
    const { setTrainingConfig, dbUser, firebaseInstance, aiConfig } = useGlobalState();
    
    // Pomodoro ve Gemini Servisleri
    const { 
        initSession, startFocus, formatTime, pauseTimer,
        mode, isActive, timeLeft, completedSets 
    } = useMasterPomodoro();
    
    const { questions, isAiLoading, errorToast, fetchQuestions, clearQuestions } = useGeminiService();

    // V2 İzole State Yönetimi
    const [localDbUser, setLocalDbUser] = useState(dbUser);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    // V2 Form Verileri (12 Soru ve Manuel Seviye Odaklı)
    const [formData, setFormData] = useState({
        courseName: '',
        topic: '',
        questionCount: 5, // Varsayılan 5 soru
        aiLevel: 2        // 1: Kolay, 2: Orta, 3: Zor
    });
    const [selectedPreset, setSelectedPreset] = useState('STANDARD');

    // --- V2 ÖZEL FONKSİYONLAR (UP/DOWN KONTROLLERİ) ---

    const incrementQuestions = () => {
        if (formData.questionCount < 12) {
            setFormData(prev => ({ ...prev, questionCount: prev.questionCount + 1 }));
        }
    };

    const decrementQuestions = () => {
        if (formData.questionCount > 1) {
            setFormData(prev => ({ ...prev, questionCount: prev.questionCount - 1 }));
        }
    };

    const incrementLevel = () => {
        if (formData.aiLevel < 3) {
            setFormData(prev => ({ ...prev, aiLevel: prev.aiLevel + 1 }));
        }
    };

    const decrementLevel = () => {
        if (formData.aiLevel > 1) {
            setFormData(prev => ({ ...prev, aiLevel: prev.aiLevel - 1 }));
        }
    };

    const getLevelLabel = () => {
        const labels = { 1: 'Kolay', 2: 'Orta', 3: 'Zor' };
        return labels[formData.aiLevel];
    };

    // Navigasyon Kontrolleri
    const handleNext = () => {
        if (currentIdx + 1 < questions.length) {
            setCurrentIdx(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            pauseTimer();
            setIsCompleted(true);
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            setCurrentIdx(prev => prev - 1);
            setSelectedAnswer(null);
        }
    };

    // --- SİSTEM MANTIĞI ---

    const isReady = formData.courseName.trim() && 
                    formData.topic.trim() && 
                    formData.questionCount > 0 && 
                    formData.questionCount <= 12 && 
                    localDbUser?.sinif;

    const handleLaunch = async () => {
        if (!isReady || !aiConfig?.geminiKey) return;

        try {
            setCurrentIdx(0);
            setSelectedAnswer(null);
            setIsCompleted(false);
            setIsGenerating(true);

            initSession(selectedPreset);

            const v2TrainingConfig = {
                courseName: formData.courseName,
                topicName: formData.topic,
                sinif: localDbUser.sinif,
                seviye: getLevelLabel(), // Manuel seçilen seviye
                soruSayisi: formData.questionCount // Mühürlü 12 soru sınırı
            };

            await fetchQuestions(aiConfig, v2TrainingConfig);
        } catch (err) {
            setIsGenerating(false);
            console.error("V2 Ateşleme Hatası:", err);
        }
    };

    // ... (Diğer useEffect ve yardımcı fonksiyonlar v1 ile uyumlu ama v2 state'lerini kullanır)
    
    return {
        state: { 
            localDbUser, isGenerating, isStarted, isCompleted, 
            currentIdx, selectedAnswer, formData, questions, 
            isAiLoading, isReady, aiLevelLabel: getLevelLabel() 
        },
        actions: { 
            setFormData, incrementQuestions, decrementQuestions, 
            incrementLevel, decrementLevel, handleLaunch, 
            handleNext, handlePrev, setSelectedAnswer 
        }
    };
};