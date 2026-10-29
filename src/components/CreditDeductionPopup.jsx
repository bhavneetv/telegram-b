import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Crown, Clock, TrendingDown, AlertTriangle } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export const CreditDeductionPopup = ({ isVisible, onClose }) => {
  const { isPremium, currentPlan, referralTimeLeft, userProfile } = useAppState();

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2200);
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const isReferralPlan = currentPlan === "Lite (Free 1hr)";
  const minsLeft = Math.ceil(referralTimeLeft / 60);
  const credits = userProfile?.credits ?? 0;
  const isLowCredit = !isPremium && !isReferralPlan && credits <= 20;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9, x: '-50%' }}
        animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
        exit={{ opacity: 0, y: -16, scale: 0.9, x: '-50%' }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className="fixed top-6 left-1/2 z-[80] pointer-events-none select-none"
      >
        <div
          className={`px-4 py-2 rounded-full flex items-center gap-2.5 backdrop-blur-2xl shadow-2xl border transition-all duration-300 ${
            isLowCredit
              ? 'bg-[#180a0f]/95 border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.4)] text-rose-300'
              : isPremium
              ? 'bg-[#141008]/95 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.35)] text-amber-300'
              : isReferralPlan
              ? 'bg-[#06241b]/95 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.35)] text-emerald-300'
              : 'bg-[#0a0d15]/95 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.25)] text-white'
          }`}
        >
          {isReferralPlan ? (
            <>
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-xs font-black tracking-tight">1-Hr Free Pass</span>
              <span className="text-[10px] text-emerald-400/90 font-medium">({minsLeft}m left)</span>
            </>
          ) : isPremium ? (
            <>
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-bounce" />
              </div>
              <span className="text-xs font-black tracking-tight text-amber-300">Royal VIP Active</span>
              <span className="text-[10px] text-amber-300 font-black bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40 shadow-sm">
                0 Credits Cut
              </span>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 1.4, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[10px] font-black shadow-md"
              >
                <TrendingDown className="w-3 h-3 stroke-[3]" />
                <span>-1 CREDIT</span>
              </motion.div>

              <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-200">
                {isLowCredit ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {credits} left
                  </span>
                ) : (
                  <span>{credits}/100 remaining</span>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreditDeductionPopup;
