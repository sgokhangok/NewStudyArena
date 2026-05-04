import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MonitorPlay, Loader2, GraduationCap } from 'lucide-react';
import { useGlobalState } from '../context/GlobalState';

import { useYouTubeSearch } from '../hooks/useYouTubeSearch';
import { useMasterPomodoro } from '../hooks/useMasterPomodoro'; 
import { SearchPanel } from '../components/AiWatch/SearchPanel';
import { VideoList } from '../components/AiWatch/VideoList';
import { VideoPlayer } from '../components/AiWatch/VideoPlayer';

export const AiWatchScreen = () => {
  const navigate = useNavigate();
  const { dbUser } = useGlobalState();
  const pomodoro = useMasterPomodoro();

  const [selectedDers, setSelectedDers] = useState('');
  const [konu, setKonu] = useState('');
  const [activeChannel, setActiveChannel] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  // 🚀 YENİ: VİDEO İLERLEME HAFIZASI (Video ID'sine göre süreleri tutar)
  const [videoLogs, setVideoLogs] = useState({});

  const { searchResults, isLoading, handleSearch } = useYouTubeSearch(dbUser);

  const onSearchExecute = () => {
    setActiveVideo(null); 
    
    // 🛡️ GÖRÜNMEZ KALKAN: Öğrencinin sınıf bilgisini arama sorgusuna gizlice ekliyoruz.
    // dbUser.sinif üzerinden çekiliyor (Eğer yoksa referans sistemine göre '7' kabul edilir).
    const userClass = dbUser?.sinif || dbUser?.class || dbUser?.grade || "7";
    const classSuffix = userClass ? `${userClass}. Sınıf` : "";
    const enhancedKonu = classSuffix ? `${konu} ${classSuffix}` : konu;

    handleSearch(selectedDers, enhancedKonu, activeChannel);
  };

  // 🚀 YENİ: İlerlemeyi Güncelleyen Fonksiyon
  const updateVideoProgress = (videoId, time, completed) => {
    setVideoLogs(prev => ({
      ...prev,
      [videoId]: { time, completed }
    }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FDB912] selection:text-black">
      <div className="w-[90%] md:w-[80%] max-w-[1400px] mx-auto min-h-[80vh] pt-10 relative pb-20">
        
        {/* 🎯 HEADER: Geri Dönüş ve Sınıf Rozeti */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate('/lobby')} className="text-gray-500 hover:text-[#FDB912] font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Geri Dön
          </button>

          {/* 🛡️ SİBER ROZET: Öğrencinin sınıf bilgisini gösteren vizör (dbUser.sinif entegre edildi) */}
          <div className="flex items-center gap-3 bg-[#FDB912]/10 border border-[#FDB912]/30 px-5 py-2 rounded-xl shadow-[0_0_20px_rgba(253,185,18,0.1)]">
            <GraduationCap className="text-[#FDB912]" size={20} />
            <div className="flex flex-col">
              <span className="text-gray-400 font-bold text-[9px] tracking-[0.2em] uppercase">Aktif Profil</span>
              <span className="text-[#FDB912] font-black tracking-widest uppercase text-sm">
                Hedef Kitle: {dbUser?.sinif || dbUser?.class || dbUser?.grade || '7'}. Sınıf
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className={`lg:col-span-7 border border-[#FDB912]/20 rounded-[2rem] bg-[#0A0A0A]/50 backdrop-blur-sm p-8 min-h-[600px] flex flex-col shadow-[0_0_50px_rgba(253,185,18,0.05)] relative overflow-hidden group ${activeVideo ? 'justify-start' : 'items-center justify-center'}`}>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 w-full h-full flex flex-col">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-[#FDB912]"><Loader2 size={48} className="animate-spin" /></div>
              ) : activeVideo ? (
                <VideoPlayer 
                  activeVideo={activeVideo} 
                  onBack={() => setActiveVideo(null)} 
                  pomodoroHook={pomodoro}
                  // 🚀 Yeni Props'lar
                  savedProgress={videoLogs[activeVideo.id]}
                  onProgressUpdate={(time, completed) => updateVideoProgress(activeVideo.id, time, completed)}
                />
              ) : searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 opacity-50"><MonitorPlay size={48} className="text-[#FDB912]" /></div>
              ) : (
                <VideoList searchResults={searchResults} onVideoSelect={setActiveVideo} />
              )}
            </div>
          </div>

          <SearchPanel 
            dbUser={dbUser} selectedDers={selectedDers} setSelectedDers={setSelectedDers}
            konu={konu} setKonu={setKonu} activeChannel={activeChannel}
            setActiveChannel={setActiveChannel} isLoading={isLoading}
            onSearch={onSearchExecute} pomodoro={pomodoro} 
          />
        </div>
      </div>
    </div>
  );
};