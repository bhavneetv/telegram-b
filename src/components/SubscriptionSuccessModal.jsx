import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Crown, Sparkles, Check, Clock, ShieldCheck, Film, ArrowRight } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { triggerHaptic } from '../utils/telegram';

export const SubscriptionSuccessModal = () => {
  const { activationSuccess, closeActivationSuccess } = useAppState();

  useEffect(() => {
    if (activationSuccess) {
      triggerHaptic('heavy');
      try {
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#FFD700', '#FCD34D', '#10B981', '#FFFFFF']
        });
      } catch (e) {
        // ignore
      }
    }
  }, [activationSuccess]);

  if (!activationSuccess) return null;

  const handleDismiss = () => {
    triggerHaptic('medium');
    closeActivationSuccess();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Deep Dark Blurred Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Centered Celebration Popup Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#141824] via-[#0D101A] to-[#07090F] border-2 border-amber-400/80 p-6 sm:p-7 shadow-[0_0_60px_rgba(245,158,11,0.35)] flex flex-col items-center text-center gap-4 text-white overflow-hidden"
        >
          {/* Subtle gold ambient glow */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Crown Emblem with Shimmer Glow */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-600 flex items-center justify-center text-black shadow-xl shadow-amber-500/50 relative"
          >
            <Crown className="w-9 h-9 fill-black" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              className="absolute -inset-1 rounded-full border border-amber-300/40 border-dashed"
            />
          </motion.div>

          {/* Main Title & Plan Name */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
              <span>Subscription Activated</span>
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activationSuccess.planName}
            </h2>
          </div>

          {/* Prominent Validity Period Badge */}
          <div className="w-full p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-left">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Validity Period
                </span>
                <span className="text-sm font-black text-amber-300">
                  {activationSuccess.validityText}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wide">
              Active Now
            </span>
          </div>

          {/* Unlocked Perks List */}
          <div className="w-full flex flex-col gap-2 py-1 text-left text-xs text-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="font-semibold">Unlimited 4K Ultra HD Cloud Streaming</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="font-semibold">Turbo High-Speed Downloads Unlocked</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
              </div>
              <span className="font-semibold">100% Ad-Free Experience Guaranteed</span>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDismiss}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/40 hover:brightness-110 transition-all cursor-pointer mt-1"
          >
            <span>Start Enjoying VIP</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubscriptionSuccessModal;
