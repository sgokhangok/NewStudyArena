/**
 * AiWatch - VideoPlayer.jsx (V9 - CSS OVERRIDE)
 * - setSize() tamamen kaldırıldı, inline style savaşı bitti.
 * - #youtube-player iframe üzerine !important CSS yazılıyor.
 * - !important, YouTube'un inline style'larını (width: 1078px) ezer.
 * - Android WebView dahil her ortamda çalışır.
 */

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, PlayCircle, Maximize, Minimize } from 'lucide-react';
import { PomodoroCurtain } from '../PomodoroCurtain';

// YouTube iframe'ini her zaman container'ına tam oturtacak stil.
// !important, YouTube API'nin yazdığı "width: 1078px" gibi inline style'ları ezer.
const YOUTUBE_FILL_STYLE = `
  #youtube-player iframe {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    border: none !important;
  }
`;

export const VideoPlayer = ({ activeVideo, onBack, pomodoroHook, savedProgress, onProgressUpdate }) => {
  const isLocked = !pomodoroHook.isActive || pomodoroHook.mode !== 'FOCUS';

  const playerWrapperRef = useRef(null);
  const playerRef = useRef(null);
  const maxTimeRef = useRef(savedProgress?.time || 0);
  const [isCompleted, setIsCompleted] = useState(savedProgress?.completed || false);
  const [isNativeFullScreen, setIsNativeFullScreen] = useState(false);

  const curtainAdapter = {
    isCurtainDown: pomodoroHook.mode !== 'FOCUS',
    cycleCount: pomodoroHook.completedSets,
    molaTime: pomodoroHook.timeLeft,
    isWaitingForApproval: !pomodoroHook.isActive && pomodoroHook.mode !== 'FOCUS',
    continueSession: () => pomodoroHook.startFocus(),
    formatTime: () => pomodoroHook.formatTime(),
  };

  // ── Tam Ekran Aç/Kapat ───────────────────────────────────────────────────
  const toggleFullScreen = async () => {
    if (!playerWrapperRef.current) return;
    try {
      if (!isNativeFullScreen) {
        const el = playerWrapperRef.current;
        if (el.requestFullscreen)            await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen)    await el.mozRequestFullScreen();
        else if (el.msRequestFullscreen)     await el.msRequestFullscreen();
      } else {
        if (document.exitFullscreen)            await document.exitFullscreen();
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen)  await document.mozCancelFullScreen();
        else if (document.msExitFullscreen)     await document.msExitFullscreen();
      }
    } catch (err) {
      console.error('Tam Ekran Hatası:', err);
    }
  };

  // ── Fullscreen state takibi — setSize YOK, CSS halleder ─────────────────
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!(
        document.fullscreenElement      ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement    ||
        document.msFullscreenElement
      );
      setIsNativeFullScreen(isFs);
    };

    document.addEventListener('fullscreenchange',       handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange',    handleFsChange);
    document.addEventListener('MSFullscreenChange',     handleFsChange);

    return () => {
      document.removeEventListener('fullscreenchange',       handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange',    handleFsChange);
      document.removeEventListener('MSFullscreenChange',     handleFsChange);
    };
  }, []);

  // ── Kilitlenince tam ekrandan çık ────────────────────────────────────────
  useEffect(() => {
    if (isLocked && isNativeFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }, [isLocked, isNativeFullScreen]);

  // ── YouTube IFrame API ───────────────────────────────────────────────────
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(tag, first);
    }

    const initPlayer = () => {
      if (playerRef.current) playerRef.current.destroy();

      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: activeVideo.id,
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 0,
          controls: 1,
          disablekb: 1,
          rel: 0,
          modestbranding: 1,
          fs: 1,
          playsinline: 1,
        },
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
          },
        },
      });
    };

    if (window.YT && window.YT.Player) initPlayer();
    else window.onYouTubeIframeAPIReady = initPlayer;

    return () => {
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [activeVideo.id]);

  // ── İlerleme takibi & kilit kontrolü ────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        !playerRef.current ||
        typeof playerRef.current.getCurrentTime !== 'function'
      ) return;

      if (isLocked) {
        playerRef.current.pauseVideo();
        return;
      }

      if (isCompleted) return;

      const currentTime = playerRef.current.getCurrentTime();
      const duration    = playerRef.current.getDuration();

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
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, isCompleted, onProgressUpdate]);

  // ── Pomodoro + Video başlat ──────────────────────────────────────────────
  const handleStartPomodoroAndVideo = () => {
    pomodoroHook.startFocus();
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      playerRef.current.playVideo();
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col h-full animate-in fade-in duration-500 relative">

      {/* YouTube iframe'ini container'a kilitleyen kritik CSS */}
      <style>{YOUTUBE_FILL_STYLE}</style>

      {/* ÜST BAR */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#FDB912] font-mono text-xs uppercase tracking-widest bg-black/50 px-4 py-2 rounded-lg border border-white/10 group hover:border-[#FDB912]/30 transition-all"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Listeye Dön
        </button>
        <span className="text-xs text-gray-500 font-mono tracking-widest uppercase border border-white/10 px-3 py-1 rounded-lg bg-black/50 flex items-center gap-2">
          {activeVideo.channel}
          {isCompleted && <span className="text-green-500">✅</span>}
        </span>
      </div>

      {/* VIDEO WRAPPER */}
      <div
        ref={playerWrapperRef}
        className={`bg-black overflow-hidden relative transition-all duration-0
          ${
            isNativeFullScreen
              ? 'fixed inset-0 z-[9999] w-[100vw] h-[100vh] m-0 p-0 rounded-none border-none'
              : 'w-full aspect-video rounded-xl border border-white/10 shadow-2xl'
          }`}
      >

        {/* TAM EKRAN BUTONU */}
        <button
          onClick={toggleFullScreen}
          disabled={isLocked}
          className={`absolute top-3 right-3 z-[10000] p-2.5 rounded-xl transition-all border shadow-lg ${
            isNativeFullScreen
              ? 'bg-black/80 border-white/20 text-white hover:bg-[#FDB912] hover:text-black hover:border-[#FDB912]'
              : 'bg-[#0A0A0A] border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
          } ${isLocked ? 'opacity-20 pointer-events-none' : ''}`}
          title={isNativeFullScreen ? 'Tam Ekrandan Çık' : 'Tam Ekran Yap'}
        >
          {isNativeFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>

        {/* POMODORO PERDESİ */}
        <PomodoroCurtain pomodoro={curtainAdapter} />

        {/* BAŞLAT BUTONU */}
        {isLocked && pomodoroHook.mode === 'FOCUS' && (
          <div className="absolute inset-0 z-[9998] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
            <button
              onClick={handleStartPomodoroAndVideo}
              className="bg-[#FDB912] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(253,185,18,0.3)] hover:scale-105 transition-transform active:scale-95"
            >
              <PlayCircle size={24} />
              {maxTimeRef.current > 0 ? 'DEVAM ET' : 'BAŞLAT'}
            </button>
          </div>
        )}

        {/* YOUTUBE IFRAME ALANI */}
        <div
          className={`absolute inset-0 w-full h-full ${
            isLocked ? 'grayscale opacity-30 pointer-events-none' : ''
          }`}
        >
          <div id="youtube-player" className="w-full h-full" />
        </div>

      </div>
    </div>
  );
};
