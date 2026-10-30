import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Star,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Gem,
  Flame,
  ArrowRight,
  DownloadCloud,
  Film,
  QrCode,
  RefreshCw
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { ModalShell } from '../components/ModalShell';
import { triggerHaptic } from '../utils/telegram';
import { toast } from 'sonner';

const TIERS = {
  free: {
    level: 1,
    label: 'Trial Pass',
    badge: '1-Hour Trial',
    accentText: 'text-emerald-400',
    border: 'border-emerald-500/40',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    cardBg: 'bg-gradient-to-b from-emerald-950/20 via-[#0a0d16] to-[#07090e]',
    barLit: 'bg-emerald-400',
    circleBorderColors: ['rgba(255, 255, 255, 0.25)', 'rgba(52, 211, 153, 0.5)', 'rgba(52, 211, 153, 0.95)'],
    circleBgColors: ['rgba(255, 255, 255, 0.04)', 'rgba(16, 185, 129, 0.12)', 'rgba(16, 185, 129, 0.22)'],
    circleShadow: 'shadow-[0_0_10px_rgba(16,185,129,0.45)]',
    checkColor: 'text-emerald-300',
    rippleBg: 'bg-emerald-400/35',
    button: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-lg shadow-emerald-500/10'
  },
  silver: {
    level: 2,
    label: 'Daily VIP',
    badge: '24-Hour VIP',
    accentText: 'text-blue-400',
    border: 'border-blue-500/40',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.18)]',
    cardBg: 'bg-gradient-to-b from-blue-950/25 via-[#0a0d16] to-[#07090e]',
    barLit: 'bg-blue-400',
    circleBorderColors: ['rgba(255, 255, 255, 0.25)', 'rgba(96, 165, 250, 0.5)', 'rgba(96, 165, 250, 0.95)'],
    circleBgColors: ['rgba(255, 255, 255, 0.04)', 'rgba(59, 130, 246, 0.12)', 'rgba(59, 130, 246, 0.22)'],
    circleShadow: 'shadow-[0_0_10px_rgba(59,130,246,0.45)]',
    checkColor: 'text-blue-300',
    rippleBg: 'bg-blue-400/35',
    button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black border border-blue-400/40 shadow-lg shadow-blue-500/25 hover:brightness-110'
  },
  gold: {
    level: 3,
    label: 'Royal Sovereign VIP',
    badge: '👑 Royal Choice',
    accentText: 'text-amber-400',
    border: 'border-amber-400/80',
    glow: 'shadow-[0_0_40px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/40',
    cardBg: 'bg-gradient-to-b from-amber-950/30 via-[#0e1017] to-[#07090e]',
    barLit: 'bg-amber-400',
    circleBorderColors: ['rgba(255, 255, 255, 0.25)', 'rgba(251, 191, 36, 0.5)', 'rgba(251, 191, 36, 0.95)'],
    circleBgColors: ['rgba(255, 255, 255, 0.04)', 'rgba(245, 158, 11, 0.12)', 'rgba(245, 158, 11, 0.25)'],
    circleShadow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    checkColor: 'text-amber-300',
    rippleBg: 'bg-amber-400/40',
    button: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black hover:brightness-110 shadow-lg shadow-amber-500/30 active:scale-95'
  }
};

// Animated Checkmark Item with Smooth Sequential Drawing Inside Circle
const AnimatedCheckItem = ({ text, orderIndex = 0, tone, isActivePlan }) => {
  const checkDelay = 0.18 + orderIndex * 0.09;

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(orderIndex * 0.04, 0.35) }}
      className="flex items-center gap-2.5 text-xs text-gray-200 group"
    >
      {/* Animated Circle Container */}
      <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
        {/* Base circle border & background: circle shows immediately on page load, then checks smoothly */}
        <motion.div
          initial={{
            scale: 0.85,
            borderColor: 'rgba(255, 255, 255, 0.25)',
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }}
          animate={{
            scale: [0.85, 1, 1.18, 1],
            borderColor: isActivePlan
              ? ['rgba(255, 255, 255, 0.25)', 'rgba(251, 191, 36, 0.5)', 'rgba(251, 191, 36, 0.95)']
              : tone.circleBorderColors,
            backgroundColor: isActivePlan
              ? ['rgba(255, 255, 255, 0.04)', 'rgba(251, 191, 36, 0.12)', 'rgba(251, 191, 36, 0.25)']
              : tone.circleBgColors
          }}
          transition={{
            duration: 0.45,
            delay: checkDelay,
            times: [0, 0.3, 0.7, 1],
            ease: 'easeOut'
          }}
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-shadow ${
            isActivePlan
              ? 'shadow-[0_0_10px_rgba(251,191,36,0.5)]'
              : tone.circleShadow
          }`}
        >
          {/* Animated SVG Check Path that draws smoothly inside the circle */}
          <motion.svg
            viewBox="0 0 16 16"
            className="w-3 h-3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M3.5 8.5L6.5 11.5L12.5 4.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isActivePlan ? 'text-amber-300' : tone.checkColor}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.32,
                delay: checkDelay + 0.05,
                ease: [0.16, 1, 0.3, 1]
              }}
            />
          </motion.svg>
        </motion.div>

        {/* Subtle pop/ripple effect when checked */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.35, 1.75], opacity: [0, 0.65, 0] }}
          transition={{
            duration: 0.5,
            delay: checkDelay + 0.06,
            ease: 'easeOut'
          }}
          className={`absolute inset-0 rounded-full pointer-events-none ${
            isActivePlan ? 'bg-amber-400/35' : tone.rippleBg
          }`}
        />
      </div>

      <span className="leading-snug font-medium text-gray-200 group-hover:text-white transition-colors">
        {text}
      </span>
    </motion.div>
  );
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
            style={lit ? { boxShadow: `0 0 10px -1px currentColor` } : undefined}
          />
        );
      })}
    </div>
  );
};

export const Premium = () => {
  const navigate = useNavigate();
  const { isPremium, currentPlan, activatePlan, userProfile, setUserProfile } = useAppState();

  const [isLoading, setIsLoading] = useState(false);
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paySubView, setPaySubView] = useState('choose'); // 'choose' | 'stars'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessingStars, setIsProcessingStars] = useState(false);
  const [isRefreshingStars, setIsRefreshingStars] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const plans = [
    {
      id: 'lite-free',
      name: 'Lite (Free 1hr)',
      priceDisplay: 'Free',
      priceUpi: 'Free',
      priceStars: 'Free',
      subtitle: 'Unlock via 1 Referral Invite',
      duration: '1-Hour Full Access',
      badge: 'Free Trial',
      isPopular: false,
      isFree: true,
      tone: TIERS.free,
      speedLabel: 'Stream Only',
      features: [
        'Instant 4K Ultra HD & 60FPS Streaming',
        'Zero Cloud Buffering with Fast CDN Routes',
        '1-Click Instant Friend Referral Unlock',
        '100% Ad-Free Mini Player Experience'
      ],
      cta: 'Activate Free Access Key'
    },
    {
      id: 'lite-paid',
      name: 'Daily VIP Pass',
      priceDisplay: '₹10 / 10 Stars',
      priceUpi: '₹10',
      priceStars: '10 Stars',
      subtitle: 'Full 24-Hour VIP Pass',
      duration: '24 Hours Access',
      badge: 'Daily VIP',
      isPopular: false,
      isFree: false,
      tone: TIERS.silver,
      speedLabel: '5 files / min',
      features: [
        'Unlimited 4K HDR High-Speed Streaming',
        'Turbo Direct Cloud Downloads (5 files/min)',
        '100% Zero Sponsor Ads & Zero Popups',
        'Dedicated VIP High-Speed Bandwidth Route'
      ],
      cta: 'Get Daily Pass'
    },
    {
      id: 'premium-popular',
      name: 'Royal Sovereign VIP',
      priceDisplay: '₹20 / 20 Stars',
      priceUpi: '₹20',
      priceStars: '20 Stars',
      subtitle: 'Most Popular Monthly Royal Club',
      duration: '30 Days VIP Access',
      badge: '👑 Royal Choice',
      isPopular: true,
      isFree: false,
      tone: TIERS.gold,
      speedLabel: '10 files / min (Max Turbo)',
      features: [
        'Unlimited 4K Ultra HD Cinema Streaming',
        'Max Turbo Direct Downloads (10 files/min)',
        'Permanent Royal Crown VIP Profile Badge',
        '100% Zero Ads & Watermark-Free Downloads',
        'Infinite Daily Streaming & Download Credits',
        '24/7 Dedicated Cloud Server Priority Route'
      ],
      cta: 'Join Royal VIP'
    }
  ];

  const handleSelectPlan = (plan) => {
    if (isPremium && (currentPlan === plan.name || (currentPlan.includes('Royal') && plan.isPopular))) {
      toast.info('You are already an active subscriber to this plan', {
        description: 'Your Royal VIP benefits are fully unlocked.'
      });
      return;
    }

    triggerHaptic('medium');
    if (plan.isFree) {
      setShowFreeModal(true);
    } else {
      setSelectedPlan(plan);
      setPaySubView('choose');
      setShowPayModal(true);
    }
  };

  const handlePayWithUpi = () => {
    triggerHaptic('medium');
    setShowPayModal(false);
    const plan = selectedPlan?.name || 'Royal Sovereign VIP';
    const price = selectedPlan?.priceUpi || '₹20';
    // Navigate with rupee price only - zero mention of Stars
    navigate(`/payment/upi?plan=${encodeURIComponent(plan)}&price=${encodeURIComponent(price)}`);
  };

  const handleOpenStarsFlow = () => {
    triggerHaptic('light');
    setPaySubView('stars');
  };

  const handleRefreshStars = () => {
    triggerHaptic('light');
    setIsRefreshingStars(true);
    setTimeout(() => {
      setIsRefreshingStars(false);
      toast.info('Telegram Stars invoice refreshed', {
        description: 'Ready to receive confirmation.'
      });
    }, 600);
  };

  const handleConfirmStarsPayment = () => {
    triggerHaptic('heavy');
    setIsProcessingStars(true);

    setTimeout(() => {
      setIsProcessingStars(false);
      setShowPayModal(false);

      const activatedName = selectedPlan ? selectedPlan.name : 'Royal Sovereign VIP';
      // activatePlan triggers the fixed centered SubscriptionSuccessModal with validity in days!
      activatePlan(activatedName);
    }, 900);
  };

  const handleCopyLink = () => {
    triggerHaptic('medium');
    navigator.clipboard.writeText(userProfile.referralLink);
    setCopied(true);

    setUserProfile((prev) => ({
      ...prev,
      referrals: prev.referrals + 1
    }));
    activatePlan('Lite (Free 1hr)');
    setShowFreeModal(false);
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 pb-28 px-4 max-w-4xl mx-auto pt-[73px] text-white animate-pulse">
        <div className="glass-panel p-8 rounded-3xl h-44 shimmer-bg border border-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="glass-panel p-6 rounded-3xl h-80 shimmer-bg border border-white/5"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-28 px-4 max-w-5xl mx-auto pt-[65px] text-white">
      {/* TIER CARDS GRID */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Choose Your Royal Pass</span>
          </h2>
          <span className="text-[11px] text-gray-400">Cancel or upgrade anytime</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => {
            const isActivePlan =
              isPremium && (currentPlan === plan.name || (currentPlan.includes('Royal') && plan.isPopular));
            const tone = plan.tone;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl transition-all duration-300 border backdrop-blur-xl overflow-hidden ${
                  isActivePlan
                    ? 'border-2 border-amber-400 shadow-[0_0_45px_rgba(245,158,11,0.35)] bg-gradient-to-b from-amber-950/40 via-[#0e1017] to-[#07090e] md:-translate-y-2'
                    : plan.isPopular
                    ? `border-2 ${tone.border} ${tone.glow} ${tone.cardBg} md:-translate-y-2`
                    : `${tone.cardBg} ${tone.border} hover:border-white/30 shadow-xl`
                }`}
              >
                {/* Specular Top Chamfer Light Highlight */}
                <div className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${
                  isActivePlan ? 'via-amber-400/90' : plan.isPopular ? 'via-amber-400/80' : 'via-white/20'
                } to-transparent pointer-events-none`} />

                {/* Popular / Active Ribbon Badge */}
                {plan.isPopular && !isActivePlan && (
                  <div className="inline-flex self-start mb-2.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/30 items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-slate-950" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                {isActivePlan && (
                  <div className="inline-flex self-start mb-2.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/40 items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Royal Pass</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-black text-white flex items-center gap-1.5">
                      {plan.isPopular && <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />}
                      <span>{plan.name}</span>
                    </h3>
                    {!plan.isPopular && !isActivePlan && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="mb-3.5">
                    <span className={`text-2xl font-black ${isActivePlan ? 'text-amber-400' : tone.accentText}`}>
                      {plan.priceDisplay}
                    </span>
                    <p className="text-[11px] text-gray-400 font-medium">{plan.duration}</p>
                  </div>

                  {/* Signal Speed Meter */}
                  <div className="flex items-center justify-between mb-4 px-3.5 py-2 rounded-xl bg-black/40 border border-white/5">
                    <div className={isActivePlan ? 'text-amber-400' : tone.accentText}>
                      <SignalMeter level={tone.level} tone={isActivePlan ? TIERS.gold : tone} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-300">{plan.speedLabel}</span>
                  </div>

                  {/* Features List with Sequential Animated Checkmarks Inside Circles */}
                  <div className="flex flex-col gap-2.5 mb-6 border-t border-white/10 pt-3.5">
                    {plan.features.map((feature, idx) => {
                      const prevFeaturesCount = plans
                        .slice(0, index)
                        .reduce((acc, p) => acc + p.features.length, 0);
                      const globalIndex = prevFeaturesCount + idx;

                      return (
                        <AnimatedCheckItem
                          key={idx}
                          text={feature}
                          orderIndex={globalIndex}
                          tone={tone}
                          isActivePlan={isActivePlan}
                        />
                      );
                    })}
                  </div>
                </div>

                <motion.button
                  whileHover={!isActivePlan ? { scale: 1.02 } : undefined}
                  whileTap={!isActivePlan ? { scale: 0.96 } : undefined}
                  disabled={isActivePlan}
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 px-4 rounded-2xl font-black text-xs transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 shadow-md ${
                    isActivePlan
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default'
                      : tone.button
                  }`}
                >
                  <span>{isActivePlan ? 'Current Active Plan' : plan.cta}</span>
                  {!isActivePlan && <ArrowRight className="w-3.5 h-3.5" />}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: Free Referral Key Modal (Dark Obsidian Tone, No Blue) */}
      <ModalShell
        isOpen={showFreeModal}
        onClose={() => setShowFreeModal(false)}
        title="Activate Free Access Key"
        className="bg-[#0A0D15]/98 border border-amber-500/30 shadow-[0_12px_45px_rgba(0,0,0,0.85)]"
      >
        <div className="flex flex-col gap-4 text-xs text-gray-200">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-400 shrink-0" />
            <p className="leading-snug">
              Share your personal referral link with a friend. Copying the link will test the activation callback and immediately unlock 1-Hour Free Access!
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              readOnly
              value={userProfile.referralLink}
              className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:brightness-110"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy & Activate'}</span>
            </button>
          </div>

          <button
            onClick={() => setShowFreeModal(false)}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 font-bold text-white transition-colors mt-2 cursor-pointer border border-white/10"
          >
            Close
          </button>
        </div>
      </ModalShell>

      {/* MODAL 2: Paid Checkout Flow (Separated UPI and Stars Flows) */}
      <ModalShell
        isOpen={showPayModal}
        onClose={() => !isProcessingStars && setShowPayModal(false)}
        title={paySubView === 'stars' ? 'Telegram Stars Invoice' : `VIP Pass Activation`}
        className="bg-[#0A0D15]/98 border border-amber-500/40 shadow-[0_12px_45px_rgba(0,0,0,0.85)]"
      >
        {paySubView === 'choose' ? (
          <div className="flex flex-col gap-4 text-xs text-gray-200">
            {/* Selected Plan Details Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-transparent border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                  Selected Royal Pass
                </span>
                <h3 className="text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{selectedPlan?.name}</span>
                </h3>
                <span className="text-[10px] text-gray-400">{selectedPlan?.duration}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
                  Instant Access
                </span>
              </div>
            </div>

            <p className="font-bold text-gray-300 tracking-wide text-xs">Choose Payment Method</p>

            <div className="grid grid-cols-1 gap-3">
              {/* Option 1: Pay with UPI (Dedicated Page - ZERO Mention of Stars) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handlePayWithUpi}
                className="p-3.5 rounded-2xl bg-[#0e121d] border border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] flex items-center justify-between text-left transition-all duration-300 group cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-white group-hover:text-emerald-300 transition-colors">
                        Pay with UPI Instant ({selectedPlan?.priceUpi})
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold uppercase tracking-wide border border-emerald-500/30">
                        Instant
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">PhonePe, Google Pay, Paytm & BHIM QR</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </motion.button>

              {/* Option 2: Pay with Telegram Stars (Dedicated Stars Flow - ZERO Mention of UPI) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleOpenStarsFlow}
                className="p-3.5 rounded-2xl bg-[#0e121d] border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-center justify-between text-left transition-all duration-300 group cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30">
                    <Star className="w-5 h-5 fill-slate-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-white group-hover:text-amber-300 transition-colors">
                        Pay with Stars ({selectedPlan?.priceStars})
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-extrabold uppercase tracking-wide border border-amber-500/30">
                        Official
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Instant one-tap Telegram Stars currency</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </motion.button>
            </div>
          </div>
        ) : (
          /* STARS PAYMENT DEDICATED SCREEN (ZERO MENTION OF UPI) */
          <div className="flex flex-col gap-4 text-xs text-gray-200">
            <button
              onClick={() => setPaySubView('choose')}
              className="self-start flex items-center gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Payment Methods</span>
            </button>

            {/* Stars Invoice Hero Card */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
                <Star className="w-6 h-6 fill-slate-950" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  Telegram Bot Invoice
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">
                  ⭐ {selectedPlan?.priceStars}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  For {selectedPlan?.name} ({selectedPlan?.duration})
                </p>
              </div>

              <div className="w-full mt-2 p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-300">
                A Telegram Stars invoice message has been delivered to your chat. Please complete payment and tap <strong>I Have Paid (VIP)</strong> below.
              </div>
            </div>

            {/* Actions: Refresh & Cancel */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshStars}
                disabled={isRefreshingStars}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshingStars ? 'animate-spin' : ''}`} />
                <span>{isRefreshingStars ? 'Checking...' : 'Refresh'}</span>
              </button>

              <button
                onClick={() => setShowPayModal(false)}
                className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* ONLY "I Have Paid (VIP)" Button (No Active VIP button) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirmStarsPayment}
              disabled={isProcessingStars}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 hover:brightness-110 transition-all cursor-pointer mt-1"
            >
              {isProcessingStars ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Stars Payment...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>I Have Paid (VIP)</span>
                </>
              )}
            </motion.button>
          </div>
        )}
      </ModalShell>
    </div>
  );
};

export default Premium;