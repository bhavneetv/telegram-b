import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Crown, Clock, X, TrendingDown } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export const CreditDeductionPopup = ({ isVisible, onClose }) => {
  const { isPremium, currentPlan, referralTimeLeft, userProfile } = useAppState();

  if (!isVisible) return null;

  const isReferralPlan = currentPlan === "Lite (Free 1hr)";
  const minsLeft = Math.ceil(referralTimeLeft / 60);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 100, opacity: 0, scale: 0.85 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: 100, opacity: 0, scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="fixed top-[95px] right-2.5 z-50 glass-panel p-2.5 rounded-xl border border-cyan-500/40 bg-[#0F172A]/95 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] max-w-[190px] flex flex-col gap-1.5 backdrop-blur-xl"
      >
        {/* Header Row */}
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <div className="flex items-center gap-1">
            {isPremium ? (
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            )}
            <span className="text-[10px] font-black text-white uppercase tracking-wider">
              {isPremium ? 'VIP Active' : 'Credit Used'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-0.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Content Body */}
        {isReferralPlan ? (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
              <Clock className="w-3 h-3" />
              <span>{minsLeft} mins left</span>
            </div>
          </div>
        ) : isPremium ? (
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-amber-400">Unlimited VIP</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-300 font-medium">Deduction</span>
              
              <div className="flex items-center gap-0.5 text-[9px] font-black text-rose-400 bg-rose-500/20 px-1.5 py-0.2 rounded-full border border-rose-500/40">
                <TrendingDown className="w-2.5 h-2.5" />
                <span>-1</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[9px]">
              <span className="text-gray-400">Credits:</span>
              <span className="font-black text-cyan-300">{userProfile.credits}/100</span>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
