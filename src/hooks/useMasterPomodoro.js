import { useState, useEffect, useCallback } from 'react';

export const POMODORO_PRESETS = {
  MICRO:    { id: 'micro',    label: '5-1.5-5', focus: 5,  shortBreak: 1.5, longBreak: 5 },
  QUICK:    { id: 'quick',    label: '10-3-10', focus: 10, shortBreak: 3,   longBreak: 10 },
  STANDARD: { id: 'standard', label: '25-6-15', focus: 25, shortBreak: 6,   longBreak: 15 },
  DEEP:     { id: 'deep',     label: '50-12-30',focus: 50, shortBreak: 12,  longBreak: 30 },
  ULTRA:    { id: 'ultra',    label: '99-24-60',focus: 99, shortBreak: 24,  longBreak: 60 }
};

export const useMasterPomodoro = () => {
  const [currentPreset, setCurrentPreset] = useState(POMODORO_PRESETS.STANDARD);
  const [timeLeft, setTimeLeft] = useState(currentPreset.focus * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('FOCUS'); 
  const [completedSets, setCompletedSets] = useState(0);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const switchMode = useCallback(() => {
    if (mode === 'FOCUS') {
      const nextSetCount = completedSets + 1;
      setCompletedSets(nextSetCount);
      if (nextSetCount % 4 === 0) {
        setMode('LONG_BREAK');
        setTimeLeft(currentPreset.longBreak * 60);
      } else {
        setMode('SHORT_BREAK');
        setTimeLeft(currentPreset.shortBreak * 60);
      }
    } else {
      setMode('FOCUS');
      setTimeLeft(currentPreset.focus * 60);
    }
    setIsActive(false);
  }, [mode, completedSets, currentPreset]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      switchMode();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, switchMode]);

  // 🛡️ KRİTİK KOMUTLAR
  const startFocus = () => setIsActive(true);
  
  const initSession = (presetKey) => {
    const selected = POMODORO_PRESETS[presetKey] || POMODORO_PRESETS.STANDARD;
    setCurrentPreset(selected);
    setMode('FOCUS');
    setTimeLeft(selected.focus * 60);
    setCompletedSets(0);
    setIsActive(false); // Önce duraklatılmış (paused) başlat
  };

  return {
    timeLeft, isActive, mode, completedSets, currentPreset,
    startFocus, initSession,
    formatTime: () => formatTime(timeLeft),
    pauseTimer: () => setIsActive(false)
  };
};