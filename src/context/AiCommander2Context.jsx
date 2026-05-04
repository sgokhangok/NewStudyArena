import React, { createContext, useContext, useState, useCallback } from 'react';

const AiCommander2Context = createContext();

export const AiCommander2Provider = ({ children }) => {
  const [commander2State, setCommander2State] = useState({
    settings: { defaultSavePath: null },
    pomodoroConfig: { focusTime: 25, shortBreak: 5, longBreak: 15 },
    subjectCounters: {
      "Matematik": {}, 
      "Türkçe": {},
      "Fizik": {},
      "Kimya": {}
    },
    activeExamState: { karmaTestId: null, createdAt: null, isCompleted: false, questions: [] },
    archive: []
  });

  const getSubjectTotalCount = useCallback((subjectName) => {
    const topics = commander2State.subjectCounters[subjectName] || {};
    let total = 0;
    Object.values(topics).forEach(levels => {
      total += (levels.easy + levels.medium + levels.hard);
    });
    return total;
  }, [commander2State.subjectCounters]);

  const updateQuestionCount = useCallback((subject, topic, level, increment) => {
    setCommander2State(prev => {
      const newState = { ...prev };
      if (!newState.subjectCounters[subject][topic]) {
        newState.subjectCounters[subject][topic] = { easy: 0, medium: 0, hard: 0 };
      }

      const currentSubjectTotal = getSubjectTotalCount(subject);
      const currentVal = newState.subjectCounters[subject][topic][level];

      if (increment === 1 && currentSubjectTotal >= 12) return prev; // 12 Kotası Kilidi
      if (increment === -1 && currentVal <= 0) return prev; // 0 Kilidi

      newState.subjectCounters[subject][topic][level] += increment;
      return newState;
    });
  }, [getSubjectTotalCount]);

  return (
    <AiCommander2Context.Provider value={{ commander2State, setCommander2State, updateQuestionCount, getSubjectTotalCount }}>
      {children}
    </AiCommander2Context.Provider>
  );
};

export const useAiCommander2 = () => {
  const context = useContext(AiCommander2Context);
  if (!context) throw new Error("useAiCommander2, Provider içinde kullanılmalı.");
  return context;
};