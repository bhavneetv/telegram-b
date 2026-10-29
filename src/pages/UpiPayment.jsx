import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  RefreshCw,
  X,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Crown
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { triggerHaptic } from '../utils/telegram';
import { toast } from 'sonner';

export const UpiPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userProfile, activatePlan } = useAppState();

  const rawPlanName = searchParams.get('plan') || 'Royal Sovereign VIP';
  // Remove "Lite" from plan name as requested
  const planName = rawPlanName
    .replace(/^Lite\s*/i, '')
    .replace(/\(Lite\s*/i, '(')
    .trim() || 'Royal Sovereign VIP';

  const rawPrice = searchParams.get('price') || '₹20';
  // Strip any Stars reference to ensure UPI flow has zero mention of Stars
  const planPrice = rawPrice.split('/')[0].trim();

  // 10-digit Tera ID as requested
  const format10DigitId = (id) => {
    if (!id) return '8492018472';
    const digits = String(id).replace(/\D/g, '');
    if (digits.length >= 10) return digits.slice(-10);
    return (digits + '8492018472').slice(0, 10);
  };
  const tenDigitTeraId = format10DigitId(userProfile?.userId);

  // 5-minute countdown (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedTeraId, setCopiedTeraId] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRefresh = () => {
    triggerHaptic('medium');
    setIsRefreshing(true);
    setTimeout(() => {
      setTimeLeft(300);
      setIsRefreshing(false);
      toast.info('Payment Session Refreshed', {
        description: 'New 5-minute payment window initialized.'
      });
    }, 700);
  };

  const handleCancel = () => {
    triggerHaptic('light');
    navigate('/premium');
  };

  const handleCopyTeraId = () => {
    triggerHaptic('light');
    navigator.clipboard.writeText(tenDigitTeraId);
    setCopiedTeraId(true);
    toast.success('TeraID copied to clipboard');
    setTimeout(() => setCopiedTeraId(false), 2000);
  };

  const handleSimulateSuccess = () => {
    triggerHaptic('heavy');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      try {
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#3B82F6', '#60A5FA', '#10B981', '#FFFFFF']
        });
      } catch (e) {
        // ignore
      }
      activatePlan(planName);
      navigate('/premium');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex flex-col items-center justify-center px-4 py-8 relative selection:bg-blue-500/30">
      {/* Ambient background glow (dark obsidian with electric blue aura) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Payment Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#141824] via-[#0D101A] to-[#07090F] border border-blue-500/40 p-6 sm:p-7 shadow-[0_0_60px_rgba(59,130,246,0.22)] flex flex-col items-center text-center gap-4"
      >
        {/* Top Floating Badge */}
        <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[10px] font-black uppercase tracking-widest shadow-sm">
          <Sparkles className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
          <span>VIP UPI Gateway</span>
        </div>

        {/* 1. Complete Payment Heading */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Complete UPI Payment
          </h1>

          {/* 2. 10-Digit TeraID with Working Copy Button */}
          <div className="flex items-center gap-2 text-xs font-mono bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 mt-0.5 shadow-inner">
            <span className="text-gray-400 font-sans font-medium">TeraID:</span>
            <strong className="text-blue-300 font-bold tracking-wider">{tenDigitTeraId}</strong>
            <button
              type="button"
              onClick={handleCopyTeraId}
              className="p-1 rounded-md hover:bg-white/10 text-blue-400 hover:text-white transition-colors cursor-pointer"
              title="Copy TeraID"
            >
              {copiedTeraId ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* 3. Expires in a few min (Live Countdown with Progress) */}
          <div className="flex items-center gap-1.5 text-xs font-semibold mt-1">
            <Clock className={`w-3.5 h-3.5 ${timeLeft < 60 ? 'text-rose-400 animate-spin' : 'text-blue-400'}`} />
            <span className="text-gray-400">Expires in:</span>
            <span
              className={`font-mono font-black px-2 py-0.5 rounded-md ${
                timeLeft < 60
                  ? 'bg-rose-500/20 text-rose-300 animate-pulse border border-rose-500/30'
                  : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
              }`}
            >
              {formatTimer(timeLeft)}
            </span>
          </div>
        </div>

        {/* 4. Animated QR Code Section with Scanner Radar */}
        <div className="relative flex flex-col items-center justify-center my-1">
          {/* Animated Radar Pulse Rings */}
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
            className="absolute -inset-2.5 rounded-[34px] border-2 border-blue-400/30 pointer-events-none"
          />

          {/* Outer QR Frame */}
          <div className="relative p-3.5 bg-white rounded-3xl shadow-2xl border-4 border-blue-400/80 shadow-blue-500/30 overflow-hidden">
            {/* Animated Laser Scanning Beam */}
            <motion.div
              initial={{ top: '4%' }}
              animate={{ top: ['4%', '92%', '4%'] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
              className="absolute left-1 right-1 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_14px_rgba(59,130,246,1)] z-20 pointer-events-none"
            />

            {/* Crisp High-Res Vector QR Code */}
            <svg
              className="w-44 h-44 sm:w-48 sm:h-48 select-none"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="200" height="200" fill="white" />
              {/* Corner 1: Top-Left Finder */}
              <rect x="15" y="15" width="46" height="46" rx="6" fill="#0A0E1A" />
              <rect x="23" y="23" width="30" height="30" rx="3" fill="white" />
              <rect x="29" y="29" width="18" height="18" rx="2" fill="#0A0E1A" />

              {/* Corner 2: Top-Right Finder */}
              <rect x="139" y="15" width="46" height="46" rx="6" fill="#0A0E1A" />
              <rect x="147" y="23" width="30" height="30" rx="3" fill="white" />
              <rect x="153" y="29" width="18" height="18" rx="2" fill="#0A0E1A" />

              {/* Corner 3: Bottom-Left Finder */}
              <rect x="15" y="139" width="46" height="46" rx="6" fill="#0A0E1A" />
              <rect x="23" y="147" width="30" height="30" rx="3" fill="white" />
              <rect x="29" y="153" width="18" height="18" rx="2" fill="#0A0E1A" />

              {/* Data Matrix Dots Pattern */}
              <g fill="#0A0E1A">
                <rect x="70" y="25" width="8" height="8" rx="1.5" />
                <rect x="86" y="25" width="8" height="8" rx="1.5" />
                <rect x="102" y="25" width="8" height="8" rx="1.5" />
                <rect x="118" y="25" width="8" height="8" rx="1.5" />

                <rect x="70" y="41" width="8" height="8" rx="1.5" />
                <rect x="102" y="41" width="8" height="8" rx="1.5" />

                <rect x="25" y="70" width="8" height="8" rx="1.5" />
                <rect x="41" y="70" width="8" height="8" rx="1.5" />
                <rect x="57" y="70" width="8" height="8" rx="1.5" />
                <rect x="73" y="70" width="8" height="8" rx="1.5" />
                <rect x="121" y="70" width="8" height="8" rx="1.5" />
                <rect x="137" y="70" width="8" height="8" rx="1.5" />
                <rect x="153" y="70" width="8" height="8" rx="1.5" />
                <rect x="169" y="70" width="8" height="8" rx="1.5" />

                <rect x="25" y="86" width="8" height="8" rx="1.5" />
                <rect x="57" y="86" width="8" height="8" rx="1.5" />
                <rect x="137" y="86" width="8" height="8" rx="1.5" />
                <rect x="169" y="86" width="8" height="8" rx="1.5" />

                <rect x="25" y="102" width="8" height="8" rx="1.5" />
                <rect x="41" y="102" width="8" height="8" rx="1.5" />
                <rect x="57" y="102" width="8" height="8" rx="1.5" />
                <rect x="137" y="102" width="8" height="8" rx="1.5" />
                <rect x="153" y="102" width="8" height="8" rx="1.5" />

                <rect x="70" y="121" width="8" height="8" rx="1.5" />
                <rect x="86" y="121" width="8" height="8" rx="1.5" />
                <rect x="102" y="121" width="8" height="8" rx="1.5" />
                <rect x="118" y="121" width="8" height="8" rx="1.5" />
                <rect x="134" y="121" width="8" height="8" rx="1.5" />

                <rect x="70" y="137" width="8" height="8" rx="1.5" />
                <rect x="102" y="137" width="8" height="8" rx="1.5" />
                <rect x="134" y="137" width="8" height="8" rx="1.5" />
                <rect x="150" y="137" width="8" height="8" rx="1.5" />
                <rect x="166" y="137" width="8" height="8" rx="1.5" />

                <rect x="70" y="153" width="8" height="8" rx="1.5" />
                <rect x="86" y="153" width="8" height="8" rx="1.5" />
                <rect x="118" y="153" width="8" height="8" rx="1.5" />
                <rect x="150" y="153" width="8" height="8" rx="1.5" />
                <rect x="166" y="153" width="8" height="8" rx="1.5" />

                <rect x="70" y="169" width="8" height="8" rx="1.5" />
                <rect x="102" y="169" width="8" height="8" rx="1.5" />
                <rect x="118" y="169" width="8" height="8" rx="1.5" />
                <rect x="134" y="169" width="8" height="8" rx="1.5" />
              </g>

              {/* Central UPI Badge */}
              <circle cx="100" cy="100" r="19" fill="#070A12" />
              <circle cx="100" cy="100" r="17" fill="#3B82F6" />
              <path
                d="M93 104L97 96H104L98 104H93ZM97 104L101 96H107L101 104H97Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>

          {/* Real Icons for PhonePe, GPay, Paytm, BHIM */}
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            {/* Real PhonePe Official Vector Icon */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#5F259F]/20 border border-[#5F259F]/50 shadow-sm">
              <img src="/phonepe.svg" alt="PhonePe" className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-bold text-white tracking-tight">PhonePe</span>
            </div>

            {/* Real Google Pay (GPay) Official Vector Icon */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 border border-white/20 shadow-sm">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC04" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span className="text-[10px] font-bold text-white tracking-tight">GPay</span>
            </div>

            {/* Real Paytm Official Vector Badge */}
            <div className="flex items-center px-2.5 py-1 rounded-xl bg-white shadow-sm">
              <span className="text-[11px] font-black tracking-tight leading-none text-[#002970]">
                Pay<span className="text-[#00BAF2]">tm</span>
              </span>
            </div>

            {/* Real BHIM UPI Official Vector Icon */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F37021]/20 border border-[#F37021]/50 shadow-sm">
              <svg className="h-3.5 w-auto shrink-0" viewBox="0 0 120 40" fill="none">
                <path d="M12 34L26 6H38L24 34H12Z" fill="#097F5B"/>
                <path d="M26 34L40 6H52L38 34H26Z" fill="#F37021"/>
                <text x="54" y="28" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">BHIM</text>
              </svg>
            </div>
          </div>
        </div>

        {/* 5. Amount to Pay Box - Centered Amount & Plan Name in place of UPI ID */}
        <div className="w-full flex flex-col items-center justify-center py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/10 shadow-inner">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest text-center">
            Total Amount to Pay
          </span>

          {/* Amount text centered in middle */}
          <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent my-1 text-center drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            {planPrice}
          </div>

          {/* Plan Name in place of UPI ID (UPI ID text completely removed as requested) */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold mt-1 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300">
            <Crown className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-white font-bold">{planName}</span>
          </div>
        </div>

        {/* 6. Refresh Button & Cancel Button */}
        <div className="w-full flex items-center gap-2.5 pt-1">
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-white/8 hover:bg-white/15 text-white font-bold text-xs border border-white/10 hover:border-blue-400/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </motion.button>

          {/* Cancel Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCancel}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold text-xs border border-rose-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <X className="w-3.5 h-3.5 text-rose-400" />
            <span>Cancel</span>
          </motion.button>
        </div>

        {/* 7. Action Button: I Have Paid (VIP) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSimulateSuccess}
          disabled={isVerifying}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:brightness-110 transition-all cursor-pointer mt-1"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Verifying Payment...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>I Have Paid (VIP)</span>
            </>
          )}
        </motion.button>

        {/* Security Footer */}
        <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Encrypted & Instant Telegram VIP Delivery</span>
        </div>
      </motion.div>
    </div>
  );
};

export default UpiPayment;
