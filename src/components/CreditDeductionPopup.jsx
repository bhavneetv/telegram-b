import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Crown, Clock, X, TrendingDown, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';

export const CreditDeductionPopup = ({ isVisible, onClose }) => {
  const { isPremium, currentPlan, referralTimeLeft, userProfile } = useAppState();
  const navigate = useNavigate();

  if (!isVisible) return null;

  const isReferralPlan = currentPlan === "Lite (Free 1hr)";
  const minsLeft = Math.ceil(referralTimeLeft / 60);
  const credits = userProfile?.credits ?? 0;
  const isLowCredit = !isPremium && !isReferralPlan && credits <= 20;
  const isCritical = !isPremium && !isReferralPlan && credits <= 5;

  const handleActionClick = () => {
    onClose();
    navigate('/premium');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 120, opacity: 0, scale: 0.9 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: 120, opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 360, damping: 26 }}
        className={`fixed top-[88px] right-3 z-50 p-3 rounded-2xl max-w-[215px] flex flex-col gap-2 backdrop-blur-2xl shadow-2xl transition-all duration-300 ${
          isLowCredit
            ? 'bg-[#180a0f]/95 border border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.35)]'
            : isPremium
            ? 'bg-[#141008]/95 border border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
            : 'bg-[#0d1424]/95 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
        }`}
      >
        {/* Header Row */}
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <div className="flex items-center gap-1.5">
            {isLowCredit ? (
              <div className="relative flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute" />
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              </div>
            ) : isPremium ? (
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            )}

            <span
              className={`text-[10px] font-black uppercase tracking-wider ${
                isLowCredit
                  ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  : isPremium
                  ? 'text-amber-400'
                  : 'text-cyan-300'
              }`}
            >
              {isLowCredit ? (isCritical ? 'Critical Credits' : 'Low Credit') : isPremium ? 'Royal VIP' : 'Credit Used'}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close notification"
            className="p-1 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Content Body */}
        {isReferralPlan ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{minsLeft} mins left</span>
            </div>
            <span className="text-[9px] text-gray-400 font-medium leading-tight">
              Free 1-Hour Access Pass active
            </span>
          </div>
        ) : isPremium ? (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-300">
              <span>Unlimited Playback</span>
            </div>
            <span className="text-[9px] text-amber-400/80 font-medium">
              0 Credits Deducted • VIP Perks Active
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {/* Animated Credit Cut Chip */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-gray-300">Deduction</span>
              <div
                className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border shadow-sm ${
                  isLowCredit
                    ? 'bg-rose-500/25 text-rose-300 border-rose-500/50 shadow-rose-500/20'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-cyan-500/20'
                }`}
              >
                <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                <span>-1 CREDIT</span>
              </div>
            </div>

            {/* Remaining Balance & Progress Bar */}
            <div className="flex flex-col gap-1 pt-1 border-t border-white/5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-400 font-medium">Remaining:</span>
                <span
                  className={`font-black tracking-tight ${
                    isLowCredit ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'text-cyan-300'
                  }`}
                >
                  {credits}/100
                </span>
              </div>

              {/* Visual Balance Bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isLowCredit
                      ? 'bg-gradient-to-r from-rose-600 to-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, credits))}%` }}
                />
              </div>
            </div>

            {/* Low Credit Refill Action Button */}
            {isLowCredit && (
              <button
                onClick={handleActionClick}
                className="mt-0.5 flex items-center justify-between px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-[9px] font-black text-rose-300 transition-all cursor-pointer"
              >
                <span>Refill Credits</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Auto Dismiss Countdown Bar */}
        <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden mt-0.5">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 4.5, ease: 'linear' }}
            className={`h-full ${
              isLowCredit ? 'bg-rose-500' : isPremium ? 'bg-amber-400' : 'bg-cyan-400'
            }`}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

