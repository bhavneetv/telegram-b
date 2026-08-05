import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown } from 'lucide-react';
import logoImg from '../public/image.png';

export const SplashScreen = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070A12] text-white select-none pointer-events-none px-6 text-center"
        >
          {/* Glowing Halo Background */}
          <div className="absolute w-72 h-72 rounded-full bg-blue-600/25 blur-3xl" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center gap-5 relative z-10"
          >
            {/* Terabox Logo Image with Light Glowing Badge on Right Side */}
            <div className="relative flex items-center justify-center p-2 rounded-3xl bg-[#0052FF] shadow-2xl shadow-blue-500/50 border-2 border-blue-400/40">
              <img
                src={logoImg}
                alt="Terabox Logo"
                className="w-28 h-28 rounded-2xl object-cover shadow-xl"
              />
              
              {/* Light Glowing Crown Badge on Right Side */}
              <div className="absolute -top-2.5 -right-2.5 p-2 rounded-full bg-gradient-to-tr from-amber-300 via-amber-400 to-yellow-200 text-amber-950 shadow-[0_0_20px_4px_rgba(251,191,36,0.7)] border-2 border-white/80 animate-pulse">
                <Crown className="w-4 h-4 fill-amber-950" />
              </div>
            </div>
            
            {/* App Title & Subtitle */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                  Terabox
                </span>
                <span className="px-2.5 py-0.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-black uppercase tracking-widest shadow-md">
                  MINI
                </span>
              </div>

              <p className="text-xs text-gray-300 font-medium max-w-xs leading-relaxed">
                Fastest Telegram Cloud Storage & Media Hub
              </p>
            </div>
          </motion.div>

          {/* Loading Indicator */}
          <div className="absolute bottom-14 flex flex-col items-center gap-2 text-cyan-400 text-xs font-extrabold tracking-wider">
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.3, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"
              />
            </div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
              Entering Mini App...
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
