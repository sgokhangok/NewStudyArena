import { useState, useCallback } from 'react';

export const useGeminiService2 = () => {
  const [questions, setQuestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorToast, setErrorToast] = useState(null);

  const fetchQuestions = useCallback(async (aiConfig, marathonConfig) => {
    const apiKey = aiConfig?.geminiKey?.trim();
    if (!apiKey) return null;

    setIsAiLoading(true);
    setErrorToast(null);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    // 🚀 PEDAGOJİK VE MOTİVASYONEL ZEKÂ (Çeldirici Analizi)
    const promptText = `
      Sen MEB müfredatına hakim, vizyoner ve pedagojik formasyona sahip uzman bir öğretmensin. 
      Öğrenci ${marathonConfig.sinif}. Sınıf seviyesindedir. 
      Aşağıdaki matrise göre toplam ${marathonConfig.soruSayisi} adet çoktan seçmeli soru hazırla:
      Matris: ${marathonConfig.topicName}
      
      KURAL 1: Sorular pedagojik, hatasız ve MEB kazanımlarına uygun olmalıdır.
      KURAL 2: Çıktıyı SADECE JSON formatında ver.
      KURAL 3: 'cozumAnalizi' alanı ÇOK KRİTİKTİR! Öğrenci bu soruyu YANLIŞ yaptığında görecektir. Bu alana şu 3 maddeyi içeren akıcı bir paragraf yaz:
        1) Doğru cevabın nasıl bulunacağının net ve basit çözümü.
        2) Öğrenciyi hataya düşüren 'Çeldirici' unsurun ne olduğu (Neden yanlış şıkkı seçmiş olabileceği ve o tuzağa neden düştüğü).
        3) Öğrencinin moralini bozmadan ona şevk veren, "Harika bir çabaydı, bu tuzağı fark ettin, bir sonrakinde harikalar yaratacaksın!" tarzında samimi bir motivasyon cümlesi.

      Format:
      [
        {
          "ders": "Ders Adı",
          "text": "Soru metni",
          "options": ["A", "B", "C", "D"],
          "correctOptionIndex": 0,
          "cozumAnalizi": "Çözüm + Çeldirici Analizi + Motivasyon..."
        }
      ]
    `;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
      });
      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedQuestions = JSON.parse(cleanJson);
      
      setQuestions(parsedQuestions);
      return parsedQuestions;
    } catch (err) {
      setErrorToast({ text: "Sinyal hatası." });
      return null;
    } finally {
      setIsAiLoading(false);
    }
  }, []);

  return { questions, isAiLoading, errorToast, fetchQuestions, setQuestions };
};