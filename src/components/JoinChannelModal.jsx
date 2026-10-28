import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, ShieldAlert, Film, Image as ImageIcon, Music } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { triggerHaptic } from '../utils/telegram';
import { toast } from 'sonner';

export const JoinChannelModal = ({ isOpen, onClose, item }) => {
  const navigate = useNavigate();
  const { isChannelJoined, setIsChannelJoined } = useAppState();

  const [step, setStep] = useState('modal'); // 'modal' | 'verifying'
  const [shuffledIconIndex, setShuffledIconIndex] = useState(0);
  const timerRef = useRef(null);

  // Icon Shuffler array for media loading: Music -> Film -> Image
  const mediaIcons = [
    { icon: Music, color: 'text-amber-400' },
    { icon: Film, color: 'text-cyan-400' },
    { icon: ImageIcon, color: 'text-emerald-400' }
  ];

  // Slower smooth cycling shuffled icons (every 1.2s)
  useEffect(() => {
    if (step === 'verifying') {
      const interval = setInterval(() => {
        setShuffledIconIndex((prev) => (prev + 1) % mediaIcons.length);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [step, mediaIcons.length]);

  // Handle modal mount & joined state logic
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (isChannelJoined) {
      // User has ALREADY joined: skip join popup completely, show 1.5s loading spinner then navigate
      setStep('verifying');
      timerRef.current = setTimeout(() => {
        onClose();
        navigate(`/player/${item.id}`);
      }, 1500);
    } else {
      // First time user: show Join Required Channels popup
      setStep('modal');
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, isChannelJoined, item, navigate, onClose]);

  if (!isOpen || !item) return null;

  const handleJoinChannel = () => {
    triggerHaptic('medium');
    window.open('https://t.me/TeraboxMiniBot', '_blank');
  };

  const handleIveJoined = () => {
    triggerHaptic('medium');
    setIsChannelJoined(true); // Save one-time joined status permanently
    setStep('verifying'); // Switch from Join Popup to Loading Spinner Popup

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      toast.success('Access verified! Opening Player...');
      onClose();
      navigate(`/player/${item.id}`);
    }, 1500);
  };

  const handleCancel = () => {
    triggerHaptic('light');
    if (timerRef.current) clearTimeout(timerRef.current);
    onClose();
  };

  const CurrentMediaIcon = mediaIcons[shuffledIconIndex].icon;
  const currentIconColor = mediaIcons[shuffledIconIndex].color;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCancel}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* STEP 1: Join Required Channels Popup (Shows FIRST TIME until user clicks I've Joined) */}
        {step === 'modal' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-sm glass-panel rounded-3xl border border-cyan-500/40 bg-[#0F172A]/95 text-white p-5 shadow-2xl overflow-hidden flex flex-col gap-4"
          >
            {/* Modal Title */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <h2 className="text-sm font-black text-white">Join Required Channels</h2>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-3 text-xs text-gray-200">
              <p className="leading-relaxed">
                To access <strong>"{item.title}"</strong> with high-speed streaming & downloads, please join our Telegram channel below.
              </p>

              {/* Join Channel Button */}
              <button
                onClick={handleJoinChannel}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Join Terabox / Update</span>
              </button>

              {/* 70 / 30 Single Row Ratio: [I've Joined (70%) | Cancel (30%)] */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleIveJoined}
                  className="w-[70%] py-3 rounded-2xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 active:scale-95 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I've Joined</span>
                </button>

                <button
                  onClick={handleCancel}
                  className="w-[30%] py-3 rounded-2xl glass-panel text-gray-400 hover:text-white border border-white/10 active:scale-95 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* X Close Button positioned at bottom */}
          
          </motion.div>
        )}

        {/* STEP 2: Immersive Cinema Loading Screen */}
        {step === 'verifying' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center justify-center w-full max-w-[280px] rounded-[28px] overflow-hidden border border-white/15 shadow-[0_0_60px_rgba(6,182,212,0.2)] text-white"
          >
            {/* Blurred Thumbnail Backdrop */}
            <div className="absolute inset-0 z-0">
              <img
                src={item.thumbnail}
                alt=""
                className="w-full h-full object-cover scale-110 blur-xl opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#070A12]/80 via-[#0a0f1e]/90 to-[#070A12]/95" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center p-7 gap-4">
              {/* Orbiting Ring Spinner with Thumbnail Preview */}
              <div className="relative flex items-center justify-center w-24 h-24">
                {/* Outer Orbit */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-500 animate-spin" style={{ animationDuration: '1.2s' }} />
                {/* Inner Orbit (counter-rotate) */}
                <div className="absolute inset-1.5 rounded-full border border-transparent border-b-amber-400/60 border-l-cyan-300/40 animate-spin" style={{ animationDuration: '1.8s', animationDirection: 'reverse' }} />
                {/* Center Thumbnail Circle */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-xl shadow-black/50">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Ambient Glow behind */}
                <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl pointer-events-none" />
              </div>

              {/* Title */}
              <div className="flex flex-col items-center gap-1">
                <h3 className="text-[13px] font-black text-white tracking-tight text-center leading-snug line-clamp-2 px-2">{item.title}</h3>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Preparing Stream</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.4, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                />
              </div>

              {/* Cancel Button */}
              <button
                onClick={handleCancel}
                className="px-5 py-1.5 rounded-full bg-white/8 hover:bg-white/15 text-[11px] font-bold text-gray-400 hover:text-white border border-white/10 transition-all active:scale-90 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
