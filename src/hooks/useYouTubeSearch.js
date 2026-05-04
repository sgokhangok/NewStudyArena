import { useState } from 'react';

// Elit kanallar veritabanı dışa aktarılıyor (Arayüzde de kullanılacak)
export const eliteChannels = [
  { id: 'hiz', name: 'Hız Yayınları', searchName: 'Hız Yayınları', keyword: 'hız', color: 'border-red-500/30 hover:border-red-500' },
  { id: 'derslike', name: 'Derslike', searchName: 'Derslike', keyword: 'derslike', color: 'border-blue-500/30 hover:border-blue-500' },
  { id: 'tonguc', name: 'Tonguç Akademi', searchName: 'Tonguç', keyword: 'tonguç', color: 'border-yellow-500/30 hover:border-yellow-500' },
  { id: 'partikul', name: 'Partikül Matematik', searchName: 'Partikül Matematik', keyword: 'partikül', color: 'border-purple-500/30 hover:border-purple-500' }
];

export const useYouTubeSearch = (dbUser) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // YouTube'un karmaşık süre formatını (PT15M33S) normal saate çeviren fonksiyon
  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const h = match[1] ? parseInt(match[1].replace('H', '')) : 0;
    const m = match[2] ? parseInt(match[2].replace('M', '')) : 0;
    const s = match[3] ? parseInt(match[3].replace('S', '')) : 0;

    let result = '';
    if (h > 0) result += `${h}:`;
    result += `${h > 0 && m < 10 ? '0' : ''}${m}:`;
    result += `${s < 10 ? '0' : ''}${s}`;
    return result;
  };

  const handleSearch = async (selectedDers, konu, activeChannel) => {
    if (!selectedDers && !konu && !activeChannel) return;

    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const seciliKanal = eliteChannels.find(c => c.id === activeChannel);
      
      const sinifBilgisi = dbUser?.sinif ? `${dbUser.sinif}. Sınıf` : '';
      const kanalEki = seciliKanal ? seciliKanal.searchName : '';
      
      const searchQuery = `${sinifBilgisi} ${selectedDers} ${konu} ${kanalEki}`.trim();

      // 1. AŞAMA: Videoları Bul
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(searchQuery)}&type=video&key=${apiKey}`);
      const data = await response.json();

      if (data.items) {
        let filtrelenmisVideolar = data.items;

        if (seciliKanal) {
          const arananKelime = seciliKanal.keyword.toLowerCase();
          const alternatifKelime = arananKelime === 'tonguç' ? 'tonguc' : arananKelime;

          filtrelenmisVideolar = filtrelenmisVideolar.filter(video => {
            const channelName = video.snippet.channelTitle.toLowerCase();
            return channelName.includes(arananKelime) || channelName.includes(alternatifKelime);
          });
        } else {
          const eliteKeywords = ['hız', 'hiz', 'derslike', 'tonguç', 'tonguc', 'partikül', 'partikul'];
          filtrelenmisVideolar.sort((a, b) => {
            const aTitle = a.snippet.channelTitle.toLowerCase();
            const bTitle = b.snippet.channelTitle.toLowerCase();
            return (eliteKeywords.some(k => bTitle.includes(k)) ? 1 : 0) - (eliteKeywords.some(k => aTitle.includes(k)) ? 1 : 0);
          });
        }

        // 2. AŞAMA: Bulunan videoların ID'lerini toplayıp sürelerini öğrenmek için 2. roketi ateşle
        const videoIds = filtrelenmisVideolar.map(item => item.id.videoId).join(',');
        const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`);
        const videoData = await videoResponse.json();

        const durationMap = {};
        if (videoData.items) {
          videoData.items.forEach(item => {
            durationMap[item.id] = formatDuration(item.contentDetails.duration);
          });
        }

        // 3. AŞAMA: Tüm verileri birleştir
        const formatliSonuclar = filtrelenmisVideolar.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.high.url,
          duration: durationMap[item.id.videoId] || '...' 
        }));
        
        setSearchResults(formatliSonuclar);
      }
    } catch (error) {
      console.error("Sinyal koptu, arama yapılamadı:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { searchResults, isLoading, handleSearch };
};