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

        {/* STEP 2: Loading Popup (Appears AFTER clicking I've Joined OR on all future video clicks) */}
        {step === 'verifying' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 flex flex-col items-center justify-center p-8 glass-panel rounded-3xl border border-cyan-500/40 bg-[#0F172A]/95 text-white max-w-xs text-center shadow-2xl gap-3"
          >
            {/* Shuffling Icon Spinner */}
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 border-r-amber-400 animate-spin" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={shuffledIconIndex}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.4 }}
                  className="absolute"
                >
                  <CurrentMediaIcon className={`w-7 h-7 ${currentIconColor}`} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Simple Clean "Loading..." Text */}
            <h3 className="text-sm font-extrabold text-cyan-300">Loading...</h3>
            <p className="text-[11px] text-gray-300">Connecting fast streaming server</p>

            {/* X Close Button Below Spinner */}
            <button
              onClick={handleCancel}
              className="mt-2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/15 transition-all active:scale-90 cursor-pointer shadow-lg flex items-center justify-center"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
