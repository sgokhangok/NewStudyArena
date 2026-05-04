/**
 * AiCommander2 - SubjectGrid2.jsx
 * Görevi: Ders kartlarını (AiSubjectCard2) ekrana dizen orkestra şefi.
 * Farkı: Eski SubjectCard yerine yeni yazdığımız AiSubjectCard2'yi kullanır.
 */

import React from 'react';
// 🚀 DİKKAT: Eski SubjectCard yerine yeni V2 kartımızı çağırıyoruz!
import { AiSubjectCard2 } from './AiSubjectCard2'; 

export const SubjectGrid2 = ({ 
  subjects, 
  matrix, 
  subjectTotals, 
  examStatus, 
  activeSubjects, 
  onToggleSubject, 
  onInputChange 
}) => {
  return (
    // V11 Standartlarında ferah grid yapısı
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {subjects.map((subject, index) => (
        <AiSubjectCard2 
          key={subject.id}
          subject={subject}
          subjectIndex={index}
          // V2'de matrix yapısı artık tek bir questionCount üzerinden yürüyor
          rows={matrix[subject.id]}
          currentTotal={subjectTotals[subject.id] || 0}
          // 12 Soru Sınırı Kontrolü
          isOverQuota={(subjectTotals[subject.id] || 0) > 12} 
          examStatus={examStatus}
          isActive={activeSubjects[subject.id]} 
          onToggle={() => onToggleSubject(subject.id)} 
          onChange={onInputChange}
        />
      ))}
    </div>
  );
};