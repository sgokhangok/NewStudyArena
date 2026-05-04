export const generateAiOrderSlip = (subjectCounters) => {
  let orderDetails = "";
  let totalRequested = 0;

  // State'ten gelen veriyi okuyup metne dönüştürüyoruz
  Object.entries(subjectCounters).forEach(([subject, topics]) => {
    Object.entries(topics).forEach(([topic, levels]) => {
      const sum = levels.easy + levels.medium + levels.hard;
      if (sum > 0) {
        orderDetails += `- ${subject} > ${topic}: ${levels.easy} Kolay, ${levels.medium} Orta, ${levels.hard} Zor\n`;
        totalRequested += sum;
      }
    });
  });

  if (totalRequested === 0) return null;

  return `
    GÖREV: Aşağıda verilen tam sayılara ve zorluk derecelerine %100 sadık kalarak, Türkçe çoktan seçmeli ${totalRequested} adet soru üret. 
    SİPARİŞ LİSTESİ:
    ${orderDetails}
    
    KURAL 1: Sipariş listesindeki adetleri ASLA aşma veya eksik bırakma.
    KURAL 2: Her soru için, öğrencinin hata yapma ihtimalini anlatan detaylı bir 'aiExplanation' (çözüm notu) yaz.
    KURAL 3: SADECE SAF JSON FORMATINDA YANIT VER. Markdown (\`\`\`json) KULLANMA.
    
    BEKLENEN JSON ŞEMASI:
    {
      "questions": [
        {
          "id": "benzersiz_id",
          "questionText": "Soru metni...",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctAnswer": "A",
          "aiExplanation": "Açıklama...",
          "difficulty": "easy|medium|hard"
        }
      ]
    }
  `;
};