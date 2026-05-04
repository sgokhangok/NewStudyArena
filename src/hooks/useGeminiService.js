import { useState, useCallback } from 'react';

export const useGeminiService = () => {
  const [questions, setQuestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorToast, setErrorToast] = useState(null);

  const fetchQuestions = useCallback(async (aiConfig, trainingConfig) => {
    const apiKey = aiConfig?.geminiKey?.trim();
    if (!apiKey) {
      setErrorToast({ text: "API Anahtarı eksik!" });
      return null;
    }

    setIsAiLoading(true);
    setErrorToast(null);

    // 🔥 SENİN ESKİ, GÜVENİLİR VE %100 ÇALIŞAN BAĞLANTI YOLUN
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    // 🧠 YENİ AI TUTOR (ÖĞRETMEN) ZEKASI VE JSON FORMATI
    const promptText = `
      Sen uzman bir öğretmensin. Öğrenci için ${trainingConfig.courseName} dersinden, ${trainingConfig.topicName} konusunda, ${trainingConfig.seviye} zorluk seviyesinde ${trainingConfig.soruSayisi} adet çoktan seçmeli soru hazırla.
      
      KURAL 1: Sorular müfredata uygun ve hatasız olmalıdır.
      KURAL 2: Çıktıyı SADECE aşağıdaki JSON formatında, hiçbir markdown veya ek metin (örneğin \`\`\`json gibi) kullanmadan doğrudan düz metin olarak ver.

      [
        {
          "text": "Soru metni buraya",
          "options": ["A şıkkı", "B şıkkı", "C şıkkı", "D şıkkı"],
          "correctOptionIndex": 0,
          "cozumAnalizi": "Öğrenci yanlış yaparsa ona konuyu ve sorunun nasıl çözüleceğini anlatan, motive edici 2-3 cümlelik açıklama."
        }
      ]
    `;

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
      if (!response.ok) {
         throw new Error("API_HATASI");
      }

      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const parsedQuestions = JSON.parse(cleanJson);
      
      setQuestions(parsedQuestions);
      return parsedQuestions;

    } catch (err) {
      console.error("Gemini AI Hatası:", err);
      if (err.message === "MEŞGUL") {
        setErrorToast({ text: "Google Meşgul. Birkaç saniye bekleyip yenileyin." });
      } else {
        setErrorToast({ text: "Sinyal alınamadı. Lütfen tekrar deneyin." });
      }
      return null;
    } finally {
      setIsAiLoading(false);
    }
  }, []);

  const clearQuestions = () => {
    setQuestions([]);
    setErrorToast(null);
  };

  return { questions, isAiLoading, errorToast, fetchQuestions, clearQuestions, setQuestions };
};