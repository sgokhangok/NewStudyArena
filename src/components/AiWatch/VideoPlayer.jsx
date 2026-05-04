import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, PlayCircle, Timer } from 'lucide-react';
import { PomodoroCurtain } from '../PomodoroCurtain';

export const VideoPlayer = ({ activeVideo, onBack, pomodoroHook, savedProgress, onProgressUpdate }) => {
  const isLocked = !pomodoroHook.isActive || pomodoroHook.mode !== 'FOCUS';
  
  const playerRef = useRef(null);
  const maxTimeRef = useRef(savedProgress?.time || 0); 
  const [isCompleted, setIsCompleted] = useState(savedProgress?.completed || false);

  const curtainAdapter = {
    isCurtainDown: pomodoroHook.mode !== 'FOCUS',
    cycleCount: pomodoroHook.completedSets,
    molaTime: pomodoroHook.timeLeft,
    isWaitingForApproval: !pomodoroHook.isActive && pomodoroHook.mode !== 'FOCUS',
    continueSession: () => pomodoroHook.startFocus(),
    formatTime: () => pomodoroHook.formatTime() 
  };

  // 🚀 YENİ: ZORUNLU TAHLİYE (FORCE EXIT FULLSCREEN) PROTOKOLÜ
  // Eğer kilit devreye girdiyse ve öğrenci tam ekrandaysa, onu zorla normal ekrana döndür!
  useEffect(() => {
    if (isLocked) {
      const isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
      
      if (isFullScreen) {
        // Tarayıcı uyumluluklarına göre tam ekrandan çıkma komutları
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
  }, [isLocked]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (playerRef.current) playerRef.current.destroy();

      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: activeVideo.id,
        playerVars: { autoplay: 0, controls: 1, disablekb: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: (event) => {
            if (maxTimeRef.current > 0) {
              event.target.seekTo(maxTimeRef.current);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setIsCompleted(true);
              onProgressUpdate(maxTimeRef.current, true);
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) initPlayer();
    else window.onYouTubeIframeAPIReady = initPlayer;

    return () => { if (playerRef.current) playerRef.current.destroy(); };
  }, [activeVideo.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        if (isLocked) {
          playerRef.current.pauseVideo();
          return;
        }

        if (isCompleted) return;

        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();

        if (duration > 0 && currentTime >= duration - 2) {
          setIsCompleted(true);
          onProgressUpdate(currentTime, true);
          return;
        }

        if (currentTime > maxTimeRef.current + 1.5) {
          playerRef.current.seekTo(maxTimeRef.current);
        } else if (currentTime > maxTimeRef.current) {
          maxTimeRef.current = currentTime;
          onProgressUpdate(currentTime, false);
        }
      }
    }, 1000); 

    return () => clearInterval(interval);
  }, [isLocked, isCompleted, onProgressUpdate]);

  const handleStartPomodoroAndVideo = () => {
    pomodoroHook.startFocus();
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      playerRef.current.playVideo();
    }
  };

  return (
    <div className="w-full flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-[#FDB912] font-mono text-xs uppercase tracking-widest bg-black/50 px-4 py-2 rounded-lg border border-white/10">
          <ArrowLeft size={14} /> Listeye Dön
        </button>
        <span className="text-xs text-gray-500 font-mono tracking-widest uppercase border border-white/10 px-3 py-1 rounded-lg bg-black/50">
          {activeVideo.channel} {isCompleted && "✅"}
        </span>
      </div>
      
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
        <PomodoroCurtain pomodoro={curtainAdapter} />

        {isLocked && pomodoroHook.mode === 'FOCUS' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
            <button onClick={handleStartPomodoroAndVideo} className="bg-[#FDB912] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(253,185,18,0.3)] hover:scale-105 transition-transform">
               <PlayCircle size={24} /> {maxTimeRef.current > 0 ? 'DEVAM ET' : 'BAŞLAT'}
            </button>
          </div>
        )}

        <div className={`absolute top-0 left-0 w-full h-full ${isLocked ? 'grayscale opacity-30 pointer-events-none' : ''}`}>
          <div id="youtube-player" className="w-full h-full"></div>
        </div>
      </div>
    </div>
  );
};