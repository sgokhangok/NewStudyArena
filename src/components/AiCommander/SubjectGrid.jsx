import React from 'react';
import { SubjectCard } from './SubjectCard';

export const SubjectGrid = ({ subjects, matrix, subjectTotals, examStatus, activeSubjects, onToggleSubject, onInputChange }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {subjects.map((subject, index) => (
        <SubjectCard 
          key={subject.id}
          subject={subject}
          subjectIndex={index}
          rows={matrix[subject.id]}
          currentTotal={subjectTotals[subject.id] || 0}
          isOverQuota={(subjectTotals[subject.id] || 0) > subject.quota}
          examStatus={examStatus}
          isActive={activeSubjects[subject.id]} // 🚀 Şalter Durumu
          onToggle={() => onToggleSubject(subject.id)} // 🚀 Şalter Tıklaması
          onChange={onInputChange}
        />
      ))}
    </div>
  );
};