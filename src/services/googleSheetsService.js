export const fetchTestInventory = async (dersInput, konuInput, rawSheetUrl) => {
  if (!rawSheetUrl || !rawSheetUrl.trim()) {
    throw new Error("Sistem Hatası: Ayarlar panelinden geçerli bir Google Sheets veri tabanı linki tanımlanmadı.");
  }

  if (!dersInput.trim() || !konuInput.trim()) {
    throw new Error("Sorgu başlatılamadı: Ders ve Konu alanları boş bırakılamaz.");
  }

  const normalizeText = (text) => {
    return text.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/\s+/g, '');
  };

  const getLevenshteinDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };

  try {
    const idMatch = rawSheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!idMatch || !idMatch[1]) {
      throw new Error("Geçersiz Veri Tabanı Linki.");
    }
    
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${idMatch[1]}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(dersInput.trim())}`;
    const response = await fetch(sheetUrl);
    
    if (!response.ok) throw new Error("Ağ hatası veya sayfa bulunamadı. Lütfen ders adını (sayfa adını) kontrol edin.");
    
    const text = await response.text();
    const jsonStr = text.substring(47, text.length - 2);
    const data = JSON.parse(jsonStr);

    const searchRaw = konuInput.trim().toLowerCase();
    const searchNorm = normalizeText(searchRaw);
    
    // 🚀 JOKER KONTROLÜ: Eğer kullanıcı * veya *.* yazdıysa filtreyi devre dışı bırak
    const isJoker = searchRaw === '*' || searchRaw === '*.*';

    let rowsWithScores = [];

    // 🚀 DEĞİŞİKLİK BURADA: index parametresi eklendi
    data.table.rows.forEach((row, index) => {
      
      // 🛡️ KRİTİK GÜVENLİK KİLİDİ: 1. Satırı (Başlık satırını) kesinlikle atla!
      if (index === 0) return;

      const sheetKonuRaw = row.c[1]?.v?.toString().toLowerCase() || '';
      const sheetKonuNorm = normalizeText(sheetKonuRaw);
      
      let distance = 999;

      // KADEME 0: JOKER (Doğrudan Kabul Et)
      if (isJoker) {
        distance = 0;
      }
      // KADEME 1: Kesin Eşleşme
      else if (sheetKonuRaw.includes(searchRaw) || sheetKonuNorm.includes(searchNorm)) {
        distance = 0;
      } 
      // KADEME 2: Hata Payı Hesaplama
      else {
        distance = getLevenshteinDistance(searchNorm, sheetKonuNorm);
        const words = sheetKonuRaw.split(' ').map(w => normalizeText(w));
        for (let w of words) {
          if (w.length > 2) {
            const d = getLevenshteinDistance(searchNorm, w);
            if (d < distance) distance = d;
          }
        }
      }

      // 🛡️ TOLERANS: Joker ise veya hata payı 3'ten küçükse listeye ekle
      if (distance <= 3 || isJoker) {
        rowsWithScores.push({
          test: {
            klasor: row.c[0]?.v || 'Bilinmeyen Klasör',
            konu: row.c[1]?.v || '',
            seviye: row.c[2]?.v || 'Standart',
            testAdi: row.c[3]?.v || 'İsimsiz Test',
            cevapAnahtari: row.c[4]?.v || '',
            dosyaLink: row.c[6]?.v || '',
            cozumLink: row.c[7]?.v || ''
          },
          distance: distance 
        });
      }
    });

    if (rowsWithScores.length === 0) {
      throw new Error(`"${dersInput}" veri tabanında "${konuInput}" kelimesine yakın hiçbir mühimmat bulunamadı.`);
    }

    // Skorlara göre sırala (Joker kullanımında hepsinin skoru 0 olduğu için Sheets'teki sırayla gelir)
    rowsWithScores.sort((a, b) => a.distance - b.distance);

    return rowsWithScores.map(item => item.test);

  } catch (err) {
    throw new Error(err.message || "Sistem Hatası: Veri tabanı bağlantısı kurulamadı.");
  }
};