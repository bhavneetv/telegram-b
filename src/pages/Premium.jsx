import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Crown,
  Check,
  X,
  Zap,
  Sparkles,
  ShieldCheck,
  Copy,
  Loader2,
  CreditCard,
  Star,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Bug,
  Clock
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { ModalShell } from '../components/ModalShell';
import { triggerHaptic } from '../utils/telegram';
import { toast } from 'sonner';

const TIERS = {
  free: {
    level: 1,
    label: 'Standard',
    text: 'text-gray-300',
    accentText: 'text-gray-400',
    border: 'border-white/10',
    ring: '',
    barLit: 'bg-gray-400',
    button: 'bg-white/10 text-white border border-white/15 hover:bg-white/15'
  },
  cyan: {
    level: 2,
    label: 'Fast',
    text: 'text-cyan-400',
    accentText: 'text-cyan-400',
    border: 'border-cyan-500/50',
    ring: 'shadow-2xl shadow-cyan-500/20',
    barLit: 'bg-cyan-400',
    button: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/25'
  },
  gold: {
    level: 3,
    label: 'Fastest',
    text: 'text-amber-400',
    accentText: 'text-amber-400',
    border: 'border-amber-500/60',
    ring: 'shadow-2xl shadow-amber-500/25',
    barLit: 'bg-amber-400',
    button: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:brightness-110'
  }
};

const SignalMeter = ({ level, tone }) => {
  const heights = ['h-2.5', 'h-4', 'h-5.5'];
  return (
    <div className="flex items-end gap-1" aria-hidden="true">
      {heights.map((h, i) => {
        const lit = i < level;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className={`w-1.5 rounded-sm ${h} ${
              lit ? tone.barLit : 'bg-white/10'
            }`}
            style={lit ? { boxShadow: `0 0 8px -1px currentColor` } : undefined}
          />
        );
      })}
    </div>
  );
};

export const Premium = () => {
  const { isPremium, currentPlan, activatePlan, userProfile, setUserProfile } = useAppState();

  const [isLoading, setIsLoading] = useState(false);
  const [showCompareTable, setShowCompareTable] = useState(false);
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const plans = [
    {
      id: 'lite-free',
      name: 'Lite (Free)',
      price: 'Free',
      subtitle: 'Unlock via 1 referral',
      duration: '1 hour access',
      badge: 'Try free',
      isPopular: false,
      isFree: true,
      tone: TIERS.free,
      speedLabel: 'No downloads',
      features: ['Unlimited HD streaming', 'Refer & earn access', 'No downloads included'],
      cta: 'Activate free access'
    },
    {
      id: 'lite-paid',
      name: 'Lite Paid',
      price: '₹10 / 10 Stars',
      subtitle: 'Daily access pass',
      duration: '1 day access',
      badge: 'Basic',
      isPopular: false,
      isFree: false,
      tone: TIERS.cyan,
      speedLabel: '5 files / min',
      features: ['Unlimited HD streaming', '5 downloads / min', 'Priority customer support'],
      cta: 'Buy Lite'
    },
    {
      id: 'premium-popular',
      name: 'Premium',
      price: '₹20 / 20 Stars',
      subtitle: 'Best value monthly pass',
      duration: '1 month access',
      badge: 'Most popular',
      isPopular: true,
      isFree: false,
      tone: TIERS.gold,
      speedLabel: '10 files / min',
      features: ['Unlimited HD streaming', '10 downloads / min', 'VIP priority support', 'Exclusive gold theme'],
      cta: 'Buy Premium'
    }
  ];

  const handleSelectPlan = (plan) => {
    if (isPremium && (currentPlan === plan.name || (currentPlan === 'Premium' && plan.isPopular))) {
      toast.info('You are already subscribed to this plan');
      return;
    }

    triggerHaptic('medium');
    if (plan.isFree) {
      setShowFreeModal(true);
    } else {
      setSelectedPlan(plan);
      setPaymentMethod(null);
      setShowPayModal(true);
    }
  };

  const handleConfirmPayment = (method) => {
    setPaymentMethod(method);
    triggerHaptic('medium');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowPayModal(false);

      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {
        // ignore
      }

      activatePlan(selectedPlan ? selectedPlan.name : 'Premium');
    }, 1400);
  };

  const handleCopyLink = () => {
    triggerHaptic('medium');
    navigator.clipboard.writeText(userProfile.referralLink);
    setCopied(true);

    setUserProfile((prev) => ({
      ...prev,
      referrals: prev.referrals + 1
    }));
    activatePlan("Lite (Free 1hr)");
    setShowFreeModal(false);

    toast.success('🎉 Test Referral Callback Triggered! 1-Hour Free Access Unlocked.');
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 pb-28 px-4 max-w-4xl mx-auto pt-[73px] text-white animate-pulse">
        <div className="glass-panel p-8 rounded-3xl h-36 shimmer-bg border border-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-panel p-6 rounded-3xl h-72 shimmer-bg border border-white/5" style={{ animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-28 px-4 max-w-4xl mx-auto pt-[73px] text-white">
      {/* Active Premium Popup Banner with Blur Backdrop */}
      {isPremium ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex flex-col p-5 rounded-3xl border-2 border-amber-500 bg-amber-950/80 backdrop-blur-xl shadow-2xl shadow-amber-500/30 overflow-hidden"
        >
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500 text-black shadow-lg shadow-amber-500/50">
                <Crown className="w-6 h-6 fill-black" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                  Active Subscription
                </span>
                <h2 className="text-base sm:text-lg font-black text-white">
                  You have active plan: <strong className="text-amber-400">{currentPlan}</strong>
                </h2>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold flex items-center gap-1.5 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              Active
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 text-xs">
            <div className="flex items-center gap-2 text-gray-200">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Expires in: <strong className="text-amber-300 font-bold">30 Days</strong></span>
            </div>

            <span className="text-[11px] font-bold text-amber-400/90">VIP Unlimited 4K Downloads</span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative flex flex-col items-center text-center p-6 glass-panel rounded-3xl border border-cyan-500/30 overflow-hidden bg-gradient-to-b from-cyan-950/30 via-blue-900/10 to-transparent"
        >
          <div className="absolute -top-12 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl" />

          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="p-3.5 rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-xl shadow-amber-500/30 mb-3 text-black"
          >
            <Crown className="w-8 h-8 fill-black" />
          </motion.div>

          <h1 className="text-sm sm:text-base font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Faster downloads start here
          </h1>
          <p className="text-xs text-gray-300 max-w-md mt-1.5 leading-relaxed font-medium">
            Every plan streams in HD. What changes is how fast you can pull files down — pick the speed you need.
          </p>
        </motion.div>
      )}

      {/* TIER CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, index) => {
          const isActivePlan = isPremium && (currentPlan === plan.name || (currentPlan === 'Premium' && plan.isPopular));
          const tone = plan.tone;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className={`relative flex flex-col justify-between p-5 glass-panel rounded-3xl transition-all duration-300 border ${
                isActivePlan
                  ? 'border-2 border-amber-500 shadow-2xl shadow-amber-500/30 bg-amber-950/25 md:-translate-y-2'
                  : plan.isPopular
                  ? `border-2 ${tone.border} ${tone.ring} bg-amber-950/10 md:-translate-y-2`
                  : `${tone.border} hover:border-white/20`
              }`}
            >
              {plan.isPopular && !isActivePlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                  {plan.badge}
                </div>
              )}

              {isActivePlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[10px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active plan
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-extrabold text-white">{plan.name}</h3>
                  {!plan.isPopular && !isActivePlan && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="mb-3">
                  <span className={`text-2xl font-black ${isActivePlan ? 'text-amber-400' : tone.accentText}`}>
                    {plan.price}
                  </span>
                  <p className="text-[11px] text-gray-400 font-medium">{plan.duration}</p>
                </div>

                <div className="flex items-center justify-between mb-4 px-3.5 py-2.5 rounded-xl bg-black/25 border border-white/5">
                  <div className={isActivePlan ? 'text-amber-400' : tone.accentText}>
                    <SignalMeter level={tone.level} tone={isActivePlan ? TIERS.gold : tone} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-300">{plan.speedLabel}</span>
                </div>

                <div className="flex flex-col gap-2 mb-6 border-t border-white/10 pt-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-200">
                      <Check className={`w-3.5 h-3.5 shrink-0 ${isActivePlan ? 'text-amber-400' : tone.accentText}`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={isActivePlan}
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 rounded-2xl font-extrabold text-xs transition-all cursor-pointer ${
                  isActivePlan
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default'
                    : tone.button
                }`}
              >
                {isActivePlan ? 'Current active plan' : plan.cta}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* COLLAPSIBLE COMPARISON SECTION: "Compare Plan" Accordion */}
      <div className="glass-panel rounded-3xl border border-white/10 bg-[#0F172A]/90 overflow-hidden shadow-xl">
        <button
          onClick={() => {
            triggerHaptic('light');
            setShowCompareTable(!showCompareTable);
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">Compare Plan</h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <span>{showCompareTable ? 'Hide Table' : 'Show Table'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showCompareTable ? 'rotate-180 text-amber-400' : ''}`} />
          </div>
        </button>

        {/* Accordion Table Body */}
        <AnimatePresence>
          {showCompareTable && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 border-t border-white/10 overflow-x-auto no-scrollbar"
            >
              <table className="w-full text-left text-xs border-collapse min-w-[440px]">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Feature</th>
                    <th className="py-3 px-3">Lite free</th>
                    <th className="py-3 px-3 text-cyan-400">Lite paid</th>
                    <th className="py-3 px-3 text-amber-400 font-bold">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  <tr>
                    <td className="py-3 px-3 font-semibold">HD streaming</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Unlimited</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Unlimited</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Download speed</td>
                    <td className="py-3 px-3 text-rose-400 font-semibold">Disabled</td>
                    <td className="py-3 px-3 text-cyan-400 font-medium">5 files / min</td>
                    <td className="py-3 px-3 text-amber-400 font-bold">10 files / min</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Priority support</td>
                    <td className="py-3 px-3"><X className="w-3.5 h-3.5 text-gray-600" /></td>
                    <td className="py-3 px-3"><Check className="w-3.5 h-3.5 text-emerald-400" /></td>
                    <td className="py-3 px-3 text-amber-400 font-bold flex items-center gap-1">VIP <Check className="w-3.5 h-3.5" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Gold theme</td>
                    <td className="py-3 px-3"><X className="w-3.5 h-3.5 text-gray-600" /></td>
                    <td className="py-3 px-3"><X className="w-3.5 h-3.5 text-gray-600" /></td>
                    <td className="py-3 px-3 text-amber-400 font-bold flex items-center gap-1">Unlocked <Check className="w-3.5 h-3.5" /></td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL 1: Free referral modal */}
      <ModalShell
        isOpen={showFreeModal}
        onClose={() => setShowFreeModal(false)}
        title="Get 1 hour of free HD access"
      >
        <div className="flex flex-col gap-4 text-xs text-gray-200">
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3">
            <Zap className="w-6 h-6 text-cyan-400 shrink-0" />
            <p className="leading-snug">
              Share your link below — copying the link will trigger a test referral callback & activate your 1-hour free access!
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              readOnly
              value={userProfile.referralLink}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy & Test'}</span>
            </button>
          </div>

          <button
            onClick={() => setShowFreeModal(false)}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-white transition-colors mt-2 cursor-pointer"
          >
            Close
          </button>
        </div>
      </ModalShell>

      {/* MODAL 2: Paid checkout */}
      <ModalShell
        isOpen={showPayModal}
        onClose={() => !isProcessing && setShowPayModal(false)}
        title={`Activate ${selectedPlan?.name || 'plan'}`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
            <h3 className="text-sm font-bold text-white">Verifying payment</h3>
            <p className="text-xs text-gray-400">Processing via simulated gateway</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-xs text-gray-200">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase">Selected plan</span>
                <h3 className="text-sm font-extrabold text-white">{selectedPlan?.name}</h3>
              </div>
              <span className="text-base font-black text-amber-400">{selectedPlan?.price}</span>
            </div>

            <p className="font-semibold text-gray-300">Choose a payment method</p>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => handleConfirmPayment('UPI')}
                className="p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/50 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-amber-400 transition-colors">
                      Pay with UPI
                    </h4>
                    <p className="text-[10px] text-gray-400">GPay, PhonePe, Paytm</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => handleConfirmPayment('Stars')}
                className="p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/50 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Star className="w-5 h-5 fill-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-amber-400 transition-colors">
                      Pay with Telegram Stars
                    </h4>
                    <p className="text-[10px] text-gray-400">In-app Telegram currency</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </ModalShell>
    </div>
  );
};