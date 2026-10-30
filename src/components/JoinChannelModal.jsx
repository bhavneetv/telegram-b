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
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* STEP 1: Join Required Channels Popup (Shows FIRST TIME until user clicks I've Joined) */}
        {step === 'modal' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-sm rounded-3xl border border-white/12 bg-[#0A0D16]/95 text-white p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(34,158,217,0.18)] overflow-hidden flex flex-col gap-4 backdrop-blur-3xl"
          >
            {/* Specular Top Chamfer Highlight */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#24A1DE]/80 to-transparent pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#24A1DE]/12 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Title */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white">Join Required Channel</h2>
                  <p className="text-[10px] text-gray-400">Unlock high-speed streaming & downloads</p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-3 text-xs text-gray-200 relative z-10">
              <p className="leading-relaxed text-gray-300">
                To access <strong className="text-white">"{item.title}"</strong> with zero buffering and priority cloud speed, join our official Telegram channel:
              </p>

              {/* Telegram Official Join Channel Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleJoinChannel}
                className="relative group overflow-hidden w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#2AABEE] via-[#229ED9] to-[#0088cc] hover:brightness-110 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-[#229ED9]/35 border border-[#229ED9]/60 cursor-pointer"
              >
                <div className="absolute top-0 inset-x-0 h-[1px] bg-white/40 pointer-events-none" />
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                  <Send className="w-3 h-3 text-white fill-white ml-0.5" />
                </div>
                <span>Join Official Telegram Channel</span>
              </motion.button>

              {/* 70 / 30 Single Row Ratio: [I've Joined (70%) | Cancel (30%)] */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleIveJoined}
                  className="w-[70%] py-3 rounded-2xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 active:scale-95 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>I've Joined</span>
                </button>

                <button
                  onClick={handleCancel}
                  className="w-[30%] py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 active:scale-95 font-bold text-xs transition-all cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
              </div>
            </div>
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
