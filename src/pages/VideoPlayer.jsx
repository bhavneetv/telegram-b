import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  RotateCcw,
  RotateCw,
  Crown,
  LayoutGrid,
  List,
  Loader2,
  Check,
  ChevronRight,
  ChevronLeft,
  Gauge,
  Sliders,
  Download,
  CloudDownload,
  Clock
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { DUMMY_CONTENT } from '../data/dummyContent';
import { formatFileSize } from '../utils/formatters';
import { triggerHaptic } from '../utils/telegram';
import { AdCard } from '../components/AdCard';
import { toast } from 'sonner';

// Config for each download stage
const DOWNLOAD_STAGES = {
  checking: {
    label: 'Checking Availability...',
    icon: Clock,
    progress: 20,
    gradient: 'linear-gradient(90deg, #334155, #64748b, #1e293b, #334155)',
    textClass: 'text-gray-200',
  },
  caching: {
    label: 'Caching Download Link...',
    icon: CloudDownload,
    progress: 65,
    gradient: 'linear-gradient(90deg, #f59e0b, #fde047, #fb923c, #f59e0b)',
    textClass: 'text-black',
  },
  ready: {
    label: 'Download Now',
    icon: Download,
    progress: 100,
    gradient: 'linear-gradient(90deg, #10b981, #22d3ee, #2dd4bf, #10b981)',
    textClass: 'text-white',
  },
};

export const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { favourites, toggleFavourite, isPremium, triggerVideoPlayNotification } = useAppState();

  const mediaItem = DUMMY_CONTENT.find((item) => item.id === id) || DUMMY_CONTENT[0];
  const isFavourited = favourites.includes(mediaItem.id);
  const isPortrait = mediaItem.orientation === 'portrait';

  // Video Ref & States
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const settingsRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Controls Visibility State
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  // Settings & Gestures
  const [showSettings, setShowSettings] = useState(false);
  const [settingSubView, setSettingSubView] = useState('main'); // 'main' | 'speed' | 'quality'
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [quality, setQuality] = useState('1080p 4K');
  const [is2xHolding, setIs2xHolding] = useState(false);

  // Video Buffer Loading State
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  // 3-Stage Download Availability Flow
  const [downloadStage, setDownloadStage] = useState('checking');

  // Hold Timer Ref for 2x Speed
  const holdTimerRef = useRef(null);
  const isHoldingRef = useRef(false);

  // Related Videos View Mode & Pagination
  const [relatedViewMode, setRelatedViewMode] = useState('card'); // 'card' | 'list'
  const [visibleCount, setVisibleCount] = useState(6);

  // Reset controls timer during playback
  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  // Auto-play media on mount & trigger video play notification based on plan
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsVideoLoading(true);
    setIsPlaying(false);
    setShowControls(true);
    setDownloadStage('checking');

    // Trigger credit deduction / plan notification on video play
    triggerVideoPlayNotification();

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => {
      setDuration(video.duration);
      setIsVideoLoading(false);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };
    const onWaiting = () => setIsVideoLoading(true);
    const onPlaying = () => setIsVideoLoading(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', onEnded);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);

    const cachingTimer = setTimeout(() => setDownloadStage('caching'), 2500);
    const readyTimer = setTimeout(() => setDownloadStage('ready'), 5000);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      clearTimeout(cachingTimer);
      clearTimeout(readyTimer);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      video.pause();
    };
  }, [id]);

  // Close settings popover on outside click
  useEffect(() => {
    if (!showSettings) return;
    const handleOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
        setSettingSubView('main');
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [showSettings]);

  // Handle Play/Pause
  const togglePlay = () => {
    triggerHaptic('light');
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      video.play();
      setIsPlaying(true);
      resetControlsTimer();
    }
  };

  // Handle Mute/Unmute
  const toggleMute = () => {
    triggerHaptic('light');
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
    resetControlsTimer();
  };

  // Handle Seekbar Change
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
      setCurrentTime(time);
    }
    resetControlsTimer();
  };

  // Skip Seconds (-10s / +10s)
  const handleSkip = (seconds) => {
    triggerHaptic('light');
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), duration);
    }
    resetControlsTimer();
  };

  // Double Tap & Single Tap Gesture Handler on Player Container
  const lastTapRef = useRef(0);
  const handlePlayerTap = (e) => {
    if (isHoldingRef.current) return;

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width / 2) {
        handleSkip(-10);
        toast.info('Rewind 10s', { duration: 1000 });
      } else {
        handleSkip(10);
        toast.info('Fast Forward 10s', { duration: 1000 });
      }
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      // Single Tap: Toggle Controls Visibility
      setShowControls((prev) => {
        const next = !prev;
        if (next && isPlaying) {
          if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
          controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3500);
        }
        return next;
      });
    }
  };

  // 2x Speed Press & Hold Gesture (3 Seconds trigger condition)
  const handleTouchHoldStart = () => {
    isHoldingRef.current = false;
    holdTimerRef.current = setTimeout(() => {
      isHoldingRef.current = true;
      setIs2xHolding(true);
      if (videoRef.current) {
        videoRef.current.playbackRate = 2.0;
      }
      triggerHaptic('heavy');
      toast.success('2X Fast Speed Active');
    }, 1000);
  };

  const handleTouchHoldEnd = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    if (is2xHolding) {
      setIs2xHolding(false);
      if (videoRef.current) {
        videoRef.current.playbackRate = playbackSpeed;
      }
      triggerHaptic('light');
    }
  };

  // Playback Speed Handler
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    triggerHaptic('light');
    toast.success(`Speed set to ${speed}x`);
    resetControlsTimer();
  };

  // Quality Selection Handler
  const handleQualityChange = (q) => {
    setQuality(q);
    triggerHaptic('medium');
    toast.success(`Quality changed to ${q}`);
    resetControlsTimer();
  };

  // Fullscreen Handler for Portrait vs Landscape
  const toggleFullscreen = () => {
    triggerHaptic('light');
    const container = playerContainerRef.current;
    const video = videoRef.current;
    const tg = window.Telegram?.WebApp;

    const nextState = !isFullscreen;
    setIsFullscreen(nextState);
    resetControlsTimer();

    if (nextState) {
      // Screen Orientation API
      if (screen.orientation?.lock) {
        try {
          if (isPortrait) {
            screen.orientation.lock('portrait').catch(() => {});
          } else {
            screen.orientation.lock('landscape').catch(() => {});
          }
        } catch (e) {}
      }

      // Trigger Telegram Mini App WebApp requestFullscreen if supported
      if (tg?.requestFullscreen) {
        try { tg.requestFullscreen(); } catch (e) {}
      }

      // Trigger iOS WebKit Video native fullscreen if available
      if (video && video.webkitEnterFullscreen) {
        try { video.webkitEnterFullscreen(); } catch (e) {}
      }

      // Trigger standard HTML5 Container Fullscreen
      if (container) {
        if (container.requestFullscreen) {
          container.requestFullscreen().catch(() => {});
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        }
      }
    } else {
      // Unlock orientation
      if (screen.orientation?.unlock) {
        try { screen.orientation.unlock(); } catch (e) {}
      }

      // Exit Telegram Mini App Fullscreen if supported
      if (tg?.exitFullscreen) {
        try { tg.exitFullscreen(); } catch (e) {}
      }

      // Exit iOS WebKit Video native fullscreen
      if (video && video.webkitExitFullscreen) {
        try { video.webkitExitFullscreen(); } catch (e) {}
      }

      // Exit standard HTML5 Fullscreen
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }
  };

  // Download Action Handler
  const handleDownloadClick = () => {
    triggerHaptic('medium');
    if (downloadStage === 'ready') {
      window.open(mediaItem.url, '_blank');
      toast.success(`Downloading ${mediaItem.title}`);
    } else {
      toast.info(`Preparing link (${downloadStage})...`);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Recommendation Videos
  const relatedMedia = DUMMY_CONTENT.filter((item) => item.id !== id);

  const handleSelectRelatedVideo = (item) => {
    triggerHaptic('light');
    navigate(`/player/${item.id}`);
  };

  const handleLoadMore = () => {
    triggerHaptic('light');
    setVisibleCount((prev) => Math.min(prev + 6, relatedMedia.length));
  };

  const stage = DOWNLOAD_STAGES[downloadStage];
  const StageIcon = stage.icon;

  const firstFourRelated = relatedMedia.slice(0, 4);
  const remainingRelated = relatedMedia.slice(4, visibleCount);

  return (
    <div className="flex flex-col pb-36 sm:pb-40 text-white relative min-h-screen bg-[#030407]">
      <style>{`
        @keyframes sweepGradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .download-sweep {
          background-size: 250% 100%;
          animation: sweepGradient 3.2s linear infinite;
        }
      `}</style>

      {/* HIGHLIGHTED BOTTOM BACK BUTTON (POSITIONED ON RIGHT SIDE) */}
      {!isFullscreen && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-[calc(var(--sab)+24px)] right-4 z-50"
        >
          <button
            onClick={() => {
              triggerHaptic('light');
              navigate(-1);
            }}
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-extrabold shadow-[0_0_24px_rgba(245,158,11,0.6)] border border-amber-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-xs cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4 text-black stroke-[3]" />
            <span>Back</span>
          </button>
        </motion.div>
      )}

      {/* STICKY TOP VIDEO PLAYER SECTION */}
      <div className={`sticky top-0 z-40 w-full bg-[#030407]/95 backdrop-blur-md shadow-2xl transition-all ${isFullscreen ? 'pt-0 pb-0 px-0' : 'pt-24 sm:pt-28 pb-3 px-2 sm:px-4'}`}>
        {/* Center Mini Player Header */}
        {!isFullscreen && (
          <div className="flex items-center justify-center relative pb-2 text-center">
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-black tracking-tight text-white">
                Mini Player
              </span>
              {isPremium && (
                <Crown className="w-4 h-4 fill-amber-400 text-amber-400 -rotate-12 shadow-amber-500/50 drop-shadow-md animate-bounce" />
              )}
            </div>
          </div>
        )}

        {/* Video Container (Removed blue border, applied sleek dark styling) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          ref={playerContainerRef}
          onTouchStart={handleTouchHoldStart}
          onTouchEnd={handleTouchHoldEnd}
          onMouseDown={handleTouchHoldStart}
          onMouseUp={handleTouchHoldEnd}
          onClick={handlePlayerTap}
          className={`relative transition-all duration-300 select-none cursor-pointer overflow-hidden border border-neutral-800/80 shadow-[0_12px_45px_rgba(0,0,0,0.95)] ${
            isFullscreen
              ? 'fixed inset-0 z-[9999] w-screen h-screen max-w-none rounded-none bg-black flex flex-col justify-center items-center'
              : 'max-w-md sm:max-w-lg mx-auto aspect-video w-full bg-black rounded-2xl'
          }`}
        >
          {/* HTML5 Video Element (Portrait vs Landscape Responsive Sizing) */}
          <video
            ref={videoRef}
            src={mediaItem.url}
            poster={mediaItem.thumbnail}
            playsInline
            className={`w-full h-full transition-all duration-300 ${
              isFullscreen
                ? isPortrait
                  ? 'object-contain max-h-screen py-2'
                  : 'object-contain max-w-screen'
                : 'object-cover'
            }`}
          />

          {/* Loading Spinner Overlay */}
          <AnimatePresence>
            {isVideoLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm text-amber-400 gap-2"
              >
                <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                <span className="text-[11px] font-bold text-gray-200">Loading Video...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2x Speed Hold Indicator Overlay */}
          <AnimatePresence>
            {is2xHolding && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/50 flex items-center gap-1"
              >
                <span>2X SPEED ACTIVE</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Big Center Play / Pause Indicator */}
          <AnimatePresence>
            {!isPlaying && !isVideoLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px] z-20 pointer-events-none"
              >
                <div className="p-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black shadow-2xl shadow-amber-500/50 hover:scale-105">
                  <Play className="w-6 h-6 fill-black ml-0.5" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Player Controls Overlay */}
          <div
            className={`absolute inset-0 flex flex-col justify-between p-3 bg-gradient-to-t from-black/90 via-transparent to-black/40 transition-opacity duration-300 z-20 ${
              showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Title & Settings */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white truncate max-w-[200px]">{mediaItem.title}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-extrabold">
                {playbackSpeed}x
              </span>
            </div>

            {/* Middle Quick Seek Buttons */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => handleSkip(-10)}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-amber-500 hover:text-black transition-all active:scale-90 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={togglePlay}
                className="p-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
              </button>
              <button
                onClick={() => handleSkip(10)}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-amber-500 hover:text-black transition-all active:scale-90 cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Bar: Seekbar & Controls */}
            <div className="flex flex-col gap-1">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 accent-amber-400 bg-white/30 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-[10px] font-mono text-gray-300">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="p-1 rounded text-white hover:text-amber-400 transition-colors cursor-pointer active:scale-90"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="p-1 rounded text-white hover:text-amber-400 transition-colors cursor-pointer active:scale-90"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  </button>

                  <span>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="relative" ref={settingsRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSettings(!showSettings);
                        setSettingSubView('main');
                      }}
                      className="p-1 rounded text-white hover:text-amber-400 transition-colors cursor-pointer active:scale-90"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    {/* Settings Popover */}
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.18 }}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 bottom-8 w-44 glass-panel rounded-xl p-2.5 border border-white/10 shadow-2xl bg-[#090b10]/95 text-[10px] flex flex-col gap-2 z-40"
                        >
                          <AnimatePresence mode="wait">
                            {settingSubView === 'main' && (
                              <motion.div
                                key="main"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 8 }}
                                transition={{ duration: 0.15 }}
                                className="flex flex-col gap-1 text-gray-200"
                              >
                                <button
                                  onClick={() => setSettingSubView('speed')}
                                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/10 text-left cursor-pointer transition-colors"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Playback Speed</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-400 text-[9px]">
                                    <span>{playbackSpeed}x</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </div>
                                </button>

                                <button
                                  onClick={() => setSettingSubView('quality')}
                                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/10 text-left cursor-pointer transition-colors"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Quality</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-400 text-[9px]">
                                    <span>{quality}</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </div>
                                </button>
                              </motion.div>
                            )}

                            {settingSubView === 'speed' && (
                              <motion.div
                                key="speed"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.15 }}
                                className="flex flex-col gap-2"
                              >
                                <button
                                  onClick={() => setSettingSubView('main')}
                                  className="flex items-center gap-1 text-gray-300 hover:text-white text-[9px] font-bold pb-1 border-b border-white/10 cursor-pointer"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Settings</span>
                                </button>

                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                  Speed ({playbackSpeed}x)
                                </span>

                                <input
                                  type="range"
                                  min="0.5"
                                  max="2.0"
                                  step="0.25"
                                  value={playbackSpeed}
                                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                                  className="w-full h-1 accent-amber-400 bg-white/20 rounded-lg cursor-pointer"
                                />

                                <div className="grid grid-cols-3 gap-1 text-[9px] font-bold pt-1">
                                  {[0.5, 1.0, 1.25, 1.5, 2.0].map((s) => (
                                    <button
                                      key={s}
                                      onClick={() => handleSpeedChange(s)}
                                      className={`py-0.5 rounded cursor-pointer transition-colors ${
                                        playbackSpeed === s
                                          ? 'text-amber-400 font-extrabold border border-amber-500/30 bg-amber-500/10'
                                          : 'text-gray-400 hover:text-white'
                                      }`}
                                    >
                                      {s}x
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}

                            {settingSubView === 'quality' && (
                              <motion.div
                                key="quality"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.15 }}
                                className="flex flex-col gap-2"
                              >
                                <button
                                  onClick={() => setSettingSubView('main')}
                                  className="flex items-center gap-1 text-gray-300 hover:text-white text-[9px] font-bold pb-1 border-b border-white/10 cursor-pointer"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Settings</span>
                                </button>

                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                  Select Quality
                                </span>

                                <div className="flex flex-col gap-1 text-[10px]">
                                  {['1080p 4K', '720p HD', '480p SD'].map((q) => (
                                    <button
                                      key={q}
                                      onClick={() => handleQualityChange(q)}
                                      className={`flex items-center justify-between px-1.5 py-1 rounded cursor-pointer transition-colors ${
                                        quality === q ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-gray-400 hover:text-white'
                                      }`}
                                    >
                                      <span>{q}</span>
                                      {quality === q && <Check className="w-3 h-3 text-amber-400" />}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                    }}
                    className="p-1 rounded text-white hover:text-amber-400 transition-colors cursor-pointer active:scale-90"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4 text-amber-400 font-bold" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* LOWER CONTENT CONTAINER */}
      <div className="flex flex-col gap-2.5 px-4 max-w-4xl mx-auto w-full pt-2">
        {/* Video Details Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="p-3.5 rounded-xl border border-white/5 flex items-center justify-between gap-3 bg-[#0a0c10]/95 shadow-md"
        >
          <h1 className="text-xs sm:text-sm font-extrabold text-white leading-snug flex-1">
            {mediaItem.title}
          </h1>

          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                triggerHaptic('medium');
                toggleFavourite(mediaItem.id, mediaItem.title);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isFavourited
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-md'
                  : 'glass-panel text-gray-300 border-white/10 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavourited ? 'fill-rose-500 text-rose-500' : ''}`} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                triggerHaptic('light');
                if (navigator.share) {
                  navigator.share({ title: mediaItem.title, url: mediaItem.url }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(mediaItem.url);
                  toast.success('Link copied!');
                }
              }}
              className="p-2 rounded-xl glass-panel text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* 3-STAGE DOWNLOAD BUTTON WITH LEFT-TO-RIGHT GRADIENT SWEEP + PROGRESS BAR */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="p-2.5 rounded-xl border border-white/5 bg-[#0a0c10]/95 flex flex-col gap-2 shadow-md"
        >
          <button
            onClick={handleDownloadClick}
            style={{ backgroundImage: stage.gradient }}
            className={`download-sweep w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-colors duration-700 ease-in-out cursor-pointer shadow-lg relative overflow-hidden border ${
              downloadStage === 'checking'
                ? 'border-gray-600/40'
                : downloadStage === 'caching'
                ? 'border-amber-400/50 shadow-amber-500/30'
                : 'border-emerald-400/40 shadow-emerald-500/30 hover:brightness-110 active:scale-98'
            } ${stage.textClass}`}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={downloadStage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2"
              >
                {downloadStage === 'ready' ? (
                  <StageIcon className="w-4 h-4" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <span>
                  {downloadStage === 'ready'
                    ? `Download Now (${formatFileSize(mediaItem.sizeMB)})`
                    : stage.label}
                </span>
              </motion.span>
            </AnimatePresence>
          </button>

          {/* Slim animated progress bar */}
          <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundImage: stage.gradient, backgroundSize: '250% 100%' }}
              animate={{ width: `${stage.progress}%` }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* More Recommendation Videos */}
        <div className="flex flex-col gap-2.5 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-extrabold text-white">More Recommendation Videos</h3>

            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setRelatedViewMode('card')}
                className={`p-1 rounded-lg transition-all cursor-pointer ${
                  relatedViewMode === 'card'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setRelatedViewMode('list')}
                className={`p-1 rounded-lg transition-all cursor-pointer ${
                  relatedViewMode === 'list'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Media Section: First 4 Cards */}
          {relatedViewMode === 'card' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {firstFourRelated.map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelectRelatedVideo(item)}
                  className="rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-amber-500/40 transition-all group bg-[#0a0c10]/95 shadow-md"
                >
                  <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2 flex flex-col gap-0.5">
                    <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-300">
                      {item.title}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {firstFourRelated.map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectRelatedVideo(item)}
                  className="p-2 rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-amber-500/40 transition-all flex items-center gap-2.5 group bg-[#0a0c10]/95 shadow-md"
                >
                  <div className="w-24 aspect-video rounded-lg overflow-hidden bg-slate-900 relative shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex flex-col justify-center flex-1 gap-0.5 overflow-hidden">
                    <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-300">
                      {item.title}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* COMPACT SPONSOR BANNER PLACED UNDER FIRST 4 RECOMMENDATION VIDEOS */}
          <div className="py-1">
            <AdCard item={DUMMY_CONTENT[5]} isCompact={true} />
          </div>

          {/* Media Section: Remaining Cards */}
          {remainingRelated.length > 0 && (
            relatedViewMode === 'card' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {remainingRelated.map((item) => (
                  <motion.div
                    key={item.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSelectRelatedVideo(item)}
                    className="rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-amber-500/40 transition-all group bg-[#0a0c10]/95 shadow-md"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2 flex flex-col gap-0.5">
                      <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-300">
                        {item.title}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {remainingRelated.map((item) => (
                  <motion.div
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectRelatedVideo(item)}
                    className="p-2 rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-amber-500/40 transition-all flex items-center gap-2.5 group bg-[#0a0c10]/95 shadow-md"
                  >
                    <div className="w-24 aspect-video rounded-lg overflow-hidden bg-slate-900 relative shrink-0">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex flex-col justify-center flex-1 gap-0.5 overflow-hidden">
                      <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-300">
                        {item.title}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Infinite Load More Button */}
        {visibleCount < relatedMedia.length && (
          <div className="flex items-center justify-center pt-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              className="px-4 py-2 rounded-xl glass-panel border border-white/10 text-[11px] font-bold text-amber-300 hover:text-white hover:border-amber-500/40 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Load More Videos</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};