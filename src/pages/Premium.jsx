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
  CreditCard,
  Star,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  Gem,
  Flame,
  Award,
  ArrowRight,
  DownloadCloud,
  Film,
  QrCode
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
    text: 'text-emerald-400',
    accentText: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/10',
    barLit: 'bg-emerald-400',
    button: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/25'
  },
  cyan: {
    level: 2,
    label: 'Daily VIP',
    badge: '24-Hour Pass',
    text: 'text-cyan-400',
    accentText: 'text-cyan-400',
    border: 'border-cyan-500/40',
    glow: 'shadow-cyan-500/20',
    barLit: 'bg-cyan-400',
    button: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30 shadow-md'
  },
  gold: {
    level: 3,
    label: 'Royal Sovereign VIP',
    badge: '👑 Royal Choice',
    text: 'text-amber-400',
    accentText: 'text-amber-400',
    border: 'border-amber-400/80',
    glow: 'shadow-2xl shadow-amber-500/30 ring-1 ring-amber-400/40',
    barLit: 'bg-amber-400',
    button: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black hover:brightness-110 shadow-lg shadow-amber-500/30'
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
  const [showCompareTable, setShowCompareTable] = useState(false);
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
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
      name: 'Lite (Free 1hr)',
      price: 'Free',
      subtitle: 'Unlock via 1 Referral Invite',
      duration: '1-Hour Full Access',
      badge: 'Free Trial',
      isPopular: false,
      isFree: true,
      tone: TIERS.free,
      speedLabel: 'Stream Only',
      features: [
        'Unlimited HD 4K streaming',
        'Instant invite activation',
        'Zero buffering cloud speed',
        'No direct file downloads'
      ],
      cta: 'Activate Free Access'
    },
    {
      id: 'lite-paid',
      name: 'Lite Daily Pass',
      price: '₹10 / 10 Stars',
      subtitle: 'Full 24-Hour VIP Pass',
      duration: '24 Hours Access',
      badge: 'Daily VIP',
      isPopular: false,
      isFree: false,
      tone: TIERS.cyan,
      speedLabel: '5 files / min',
      features: [
        'Unlimited 4K HD streaming',
        '5 High-speed downloads / min',
        '100% Ad-Free experience',
        'Priority cloud route'
      ],
      cta: 'Get Daily Pass'
    },
    {
      id: 'premium-popular',
      name: 'Royal Sovereign VIP',
      price: '₹20 / 20 Stars',
      subtitle: 'Most Popular Monthly Royal Club',
      duration: '30 Days VIP Access',
      badge: '👑 Royal Choice',
      isPopular: true,
      isFree: false,
      tone: TIERS.gold,
      speedLabel: '10 files / min (Max Turbo)',
      features: [
        'Unlimited 4K Ultra HD streaming',
        '10 Turbo downloads / min (Max Speed)',
        'Royal Crown VIP Profile Badge',
        '100% Ad-Free & Zero Sponsor Popups',
        'Exclusive VIP Priority 24/7 Route',
        'Unlimited Daily Credits'
      ],
      cta: 'Join Royal VIP'
    }
  ];

  const royalPerks = [
    {
      icon: DownloadCloud,
      title: 'Turbo Direct Downloads',
      desc: 'Bypass download queues with 10 files/min high-speed direct downloads.',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10 border-amber-400/20'
    },
    {
      icon: Crown,
      title: 'Royal Crown Identity',
      desc: 'Shine with a golden VIP crown emblem on your profile across the app.',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10 border-yellow-400/20'
    },
    {
      icon: ShieldCheck,
      title: '100% Zero Advertisements',
      desc: 'Completely ad-free, sponsor-free experience without annoying interruptions.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10 border-emerald-400/20'
    },
    {
      icon: Film,
      title: 'Ultra HD 4K HDR',
      desc: 'Stream full uncompressed bitrate video with instant seek and play.',
      color: 'text-sky-400',
      bg: 'bg-sky-400/10 border-sky-400/20'
    },
    {
      icon: Zap,
      title: 'Unlimited Daily Credits',
      desc: 'No credit limits or daily deductions — enjoy unlimited video consumption.',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10 border-amber-400/20'
    },
    {
      icon: Gem,
      title: 'VIP Dedicated Servers',
      desc: 'Connected to lightning-fast dedicated Telegram CDN server endpoints.',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10 border-purple-400/20'
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
      setPaymentMethod(null);
      setShowPayModal(true);
    }
  };

  const handlePayWithUpi = () => {
    triggerHaptic('medium');
    setShowPayModal(false);
    const plan = selectedPlan?.name || 'Royal Sovereign VIP';
    const price = selectedPlan?.price || '₹20';
    navigate(`/payment/upi?plan=${encodeURIComponent(plan)}&price=${encodeURIComponent(price)}`);
  };

  const handleConfirmPayment = (method) => {
    setPaymentMethod(method);
    triggerHaptic('medium');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowPayModal(false);

      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#FFD700', '#FCD34D', '#FFFFFF']
        });
      } catch (e) {
        // ignore
      }

      const activatedName = selectedPlan ? selectedPlan.name : 'Royal Sovereign VIP';
      activatePlan(activatedName);
      toast.success(`🎉 ${activatedName} Activated!`, {
        description: 'Welcome to the Terabox Royal VIP Club. All perks unlocked!',
        duration: 3500
      });
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
    activatePlan('Lite (Free 1hr)');
    setShowFreeModal(false);

    toast.success('🎉 Test Referral Verified! 1-Hour Access Activated.', {
      description: 'Enjoy free HD streaming access.',
      duration: 3000
    });
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
    <div className="flex flex-col gap-6 pb-28 px-4 max-w-4xl mx-auto pt-[65px] text-white">
      {/* ROYAL VIP / LOYAL ACTIVE CARD (ONLY SHOWN WHEN SUBSCRIBED) */}
      {isPremium && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex flex-col p-6 rounded-3xl border-2 border-amber-400/70 bg-gradient-to-br from-amber-950/70 via-[#0d0f17] to-[#07090e] backdrop-blur-2xl shadow-[0_0_40px_rgba(245,158,11,0.25)] overflow-hidden"
        >
          {/* Subtle gold mesh aura */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-gradient-to-br from-amber-500/20 to-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: Digital Black Card Header */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-amber-500/20 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/40">
                <Crown className="w-6 h-6 fill-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                    Royal VIP Member
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                </div>
                <h2 className="text-base sm:text-xl font-black text-white">
                  Active Tier: <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-500 bg-clip-text text-transparent">{currentPlan}</span>
                </h2>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                VIP Loyal Status
              </span>
              <span className="text-[10px] font-mono text-gray-400 mt-1">
                ID: ROYAL-VIP-{userProfile.userId || '7892'}
              </span>
            </div>
          </div>

          {/* VIP Privileges Active Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-4 border-b border-white/5 relative z-10">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400 font-medium">Download Speed</span>
              <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-400" /> 10 Files / Min
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400 font-medium">Ad Protection</span>
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Ad-Free
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400 font-medium">Resolution</span>
              <span className="text-xs font-black text-sky-400 flex items-center gap-1">
                <Film className="w-3.5 h-3.5" /> 4K Ultra HD
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400 font-medium">Daily Tokens</span>
              <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                <Gem className="w-3.5 h-3.5 fill-amber-300" /> Unlimited
              </span>
            </div>
          </div>

          {/* Bottom Card Row: Expiry Status & Loyalty Tier */}
          <div className="flex items-center justify-between pt-3.5 text-xs relative z-10">
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Membership Expiry: <strong className="text-amber-300 font-black">30 Days Active</strong>
              </span>
            </div>

            <span className="text-[11px] font-extrabold text-amber-400/90 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-400" /> Loyalty Tier: Sovereign Diamond
            </span>
          </div>
        </motion.div>
      )}

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
                transition={{ duration: 0.3, delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                className={`relative flex flex-col justify-between p-5 rounded-3xl transition-all duration-300 border ${
                  isActivePlan
                    ? 'border-2 border-amber-400 shadow-2xl shadow-amber-500/30 bg-amber-950/30 md:-translate-y-2'
                    : plan.isPopular
                    ? `border-2 ${tone.border} ${tone.glow} bg-gradient-to-b from-amber-950/20 via-[#0a0d16] to-[#07090e] md:-translate-y-2`
                    : `bg-[#0a0d16]/90 ${tone.border} hover:border-white/20 shadow-lg`
                }`}
              >
                {/* Popular / Active Ribbon Badge */}
                {plan.isPopular && !isActivePlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-slate-950" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                {isActivePlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Royal Pass</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                      {plan.isPopular && <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />}
                      <span>{plan.name}</span>
                    </h3>
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

                  {/* Signal Speed Meter */}
                  <div className="flex items-center justify-between mb-4 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/5">
                    <div className={isActivePlan ? 'text-amber-400' : tone.accentText}>
                      <SignalMeter level={tone.level} tone={isActivePlan ? TIERS.gold : tone} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-300">{plan.speedLabel}</span>
                  </div>

                  {/* Bullet features */}
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
                  className={`w-full py-3 rounded-2xl font-extrabold text-xs transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 ${
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

      {/* COLLAPSIBLE COMPARISON SECTION: "Compare Plan" Accordion */}
      <div className="rounded-3xl border border-white/10 bg-[#090b10]/95 overflow-hidden shadow-xl">
        <button
          onClick={() => {
            triggerHaptic('light');
            setShowCompareTable(!showCompareTable);
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">Compare Royal Privileges</h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <span>{showCompareTable ? 'Hide Table' : 'Show Table'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                showCompareTable ? 'rotate-180 text-amber-400' : ''
              }`}
            />
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
                    <th className="py-3 px-3">Privilege</th>
                    <th className="py-3 px-3">Trial Pass</th>
                    <th className="py-3 px-3 text-cyan-400">Daily VIP</th>
                    <th className="py-3 px-3 text-amber-400 font-bold">Royal Sovereign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  <tr>
                    <td className="py-3 px-3 font-semibold">HD 4K Streaming</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Unlimited</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Unlimited</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Download Bandwidth</td>
                    <td className="py-3 px-3 text-rose-400 font-semibold">Disabled</td>
                    <td className="py-3 px-3 text-cyan-400 font-medium">5 files / min</td>
                    <td className="py-3 px-3 text-amber-400 font-bold">10 files / min (Turbo)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Ad-Free Experience</td>
                    <td className="py-3 px-3"><X className="w-3.5 h-3.5 text-gray-600" /></td>
                    <td className="py-3 px-3"><Check className="w-3.5 h-3.5 text-emerald-400" /></td>
                    <td className="py-3 px-3 text-amber-400 font-bold flex items-center gap-1">100% Ad-Free <Check className="w-3.5 h-3.5" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Royal Crown Badge</td>
                    <td className="py-3 px-3"><X className="w-3.5 h-3.5 text-gray-600" /></td>
                    <td className="py-3 px-3"><X className="w-3.5 h-3.5 text-gray-600" /></td>
                    <td className="py-3 px-3 text-amber-400 font-bold flex items-center gap-1">Golden Crown <Check className="w-3.5 h-3.5" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Priority 24/7 Support</td>
                    <td className="py-3 px-3"><X className="w-3.5 h-3.5 text-gray-600" /></td>
                    <td className="py-3 px-3"><Check className="w-3.5 h-3.5 text-emerald-400" /></td>
                    <td className="py-3 px-3 text-amber-400 font-bold flex items-center gap-1">Royal Concierge <Check className="w-3.5 h-3.5" /></td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ROYAL GUARANTEE & SECURITY BADGES */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-wrap items-center justify-around gap-4 text-center text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="font-bold">Instant Telegram Activation</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">Secured via Telegram Stars & UPI</span>
        </div>
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-400" />
          <span className="font-bold">Royal Loyalty Guaranteed</span>
        </div>
      </div>

      {/* MODAL 1: Free referral modal */}
      <ModalShell
        isOpen={showFreeModal}
        onClose={() => setShowFreeModal(false)}
        title="Activate 1-Hour Free HD Access"
      >
        <div className="flex flex-col gap-4 text-xs text-gray-200">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-400 shrink-0" />
            <p className="leading-snug">
              Share your personal referral link with a friend. Copying the link will test the callback and immediately unlock 1-Hour Free Access!
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              readOnly
              value={userProfile.referralLink}
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
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
        title={`Activate ${selectedPlan?.name || 'Royal VIP'}`}
        className="bg-gradient-to-b from-[#161a29] via-[#0e121d] to-[#090b12] border border-amber-500/40 shadow-[0_0_60px_rgba(245,158,11,0.25)]"
      >
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
            <h3 className="text-sm font-bold text-white">Verifying Royal VIP Activation</h3>
            <p className="text-xs text-gray-400">Processing via secure payment gateway...</p>
          </div>
        ) : (
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
                <span className="text-xl font-black bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  {selectedPlan?.price}
                </span>
                <span className="block text-[9px] text-emerald-400 font-bold uppercase tracking-wide">
                  Instant Access
                </span>
              </div>
            </div>

            <p className="font-bold text-gray-300 tracking-wide text-xs">Choose Your Payment Method</p>

            <div className="grid grid-cols-1 gap-3">
              {/* Pay with UPI (Opens Dedicated Payment Page) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handlePayWithUpi}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0e1320] to-[#090d18] border border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center justify-between text-left transition-all duration-300 group cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-white group-hover:text-emerald-300 transition-colors">
                        Pay with UPI (QR Code)
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold uppercase tracking-wide border border-emerald-500/30">
                        Instant
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">GPay, PhonePe, Paytm, BHIM QR</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </motion.button>

              {/* Pay with Telegram Stars */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleConfirmPayment('Stars')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0e1320] to-[#090d18] border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center justify-between text-left transition-all duration-300 group cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30">
                    <Star className="w-5 h-5 fill-slate-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-white group-hover:text-amber-300 transition-colors">
                        Pay with Telegram Stars
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-extrabold uppercase tracking-wide border border-amber-500/30">
                        Official
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Instant one-tap Telegram currency</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </motion.button>
            </div>
          </div>
        )}
      </ModalShell>
    </div>
  );
};