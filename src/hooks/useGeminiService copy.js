import { useState, useCallback, useRef } from 'react';

export const useGeminiService = () => {
  const [questions, setQuestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorToast, setErrorToast] = useState({ type: '', text: '' });
  const attemptRef = useRef(false);

  const fetchQuestions = useCallback(async (aiConfig, trainingConfig) => {
    const apiKey = aiConfig?.geminiKey?.trim();
    if (!apiKey) return;

    setIsAiLoading(true);
    setErrorToast({ type: '', text: '' });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    // 🔥 YENİ ZEKİ PROMPT: Öğrencinin sınıfını, dersini ve konusunu tam olarak biliyor!
    const promptText = `Karşındaki öğrenci ${trainingConfig.sinif || 'belirtilmemiş bir'} seviyesindedir. 
    Lütfen ${trainingConfig.courseName || 'Genel Kültür'} dersinin ${trainingConfig.topicName} konusundan, 
    tam olarak onun sınıf seviyesine ve ${trainingConfig.seviye} zorluk derecesine uygun ${trainingConfig.soruSayisi || 5} adet Türkçe çoktan seçmeli soru üret. 
    Soruların karmaşıklığını ve dilini öğrencinin sınıf seviyesine göre ayarla.
    Yanıtı SADECE saf bir JSON objesi olarak ver. Markdown kod bloğu kullanma. 
    Format: { "questions": [ { "id": 1, "text": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": "A" } ] }`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      if (response.status === 503) {
        throw new Error("MEŞGUL");
      }

      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      
      if (parsed.questions) {
        setQuestions(parsed.questions);
      }
    } catch (err) {
      if (err.message === "MEŞGUL") {
        setErrorToast({ type: 'warning', text: "Google Meşgul. Birkaç saniye bekleyip yenileyin." });
      } else {
        setErrorToast({ type: 'error', text: "Sinyal Karıştı. Key veya İnternet kontrolü yapın." });
      }
    } finally {
      setIsAiLoading(false);
    }
  }, []);

  const clearQuestions = () => setQuestions([]);

  return { questions, isAiLoading, errorToast, fetchQuestions, attemptRef, clearQuestions };
};