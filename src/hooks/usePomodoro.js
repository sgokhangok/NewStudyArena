import { useState, useEffect, useCallback } from 'react';

export const usePomodoro = (config) => {
  const [timeLeft, setTimeLeft] = useState(config.focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [cycle, setCycle] = useState(1);

  // 🚀 REAKTİF VİTES KUTUSU: Config değiştiğinde (ve sayaç akmıyorsa) anında yeni süreye geç.
  useEffect(() => {
    if (!isActive && mode === 'focus') {
      setTimeLeft(config.focusTime * 60);
    }
  }, [config, isActive, mode]);

  // Geri sayım motoru
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handlePhaseComplete(); // Süre bittiğinde faz değiştir
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handlePhaseComplete = useCallback(() => {
    if (mode === 'focus') {
      if (cycle % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(config.longBreak * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(config.shortBreak * 60);
      }
    } else {
      // Mola bitti, tekrar odağa dön
      setMode('focus');
      setTimeLeft(config.focusTime * 60);
      setCycle(c => c + 1);
    }
    setIsActive(false); // Yeni faza geçerken otomatik başlatma, öğrenciyi bekle
  }, [mode, cycle, config]);

  // 🚀 MERKEZİ ATEŞLEME ŞALTERİ: Sadece ana sınav butonuyla tetiklenebilir
  const startTimer = () => setIsActive(true);

  return {
    timeLeft,
    isActive,
    mode,
    cycle,
    startTimer
  };
};