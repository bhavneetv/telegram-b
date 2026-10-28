import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  QrCode,
  RefreshCw,
  X,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  Zap,
  Crown
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { triggerHaptic } from '../utils/telegram';
import { toast } from 'sonner';

export const UpiPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userProfile, activatePlan } = useAppState();

  const planName = searchParams.get('plan') || 'Royal Sovereign VIP';
  const planPrice = searchParams.get('price') || '₹20';

  // TeraID format
  const teraId = userProfile?.userId ? `TERA-${userProfile.userId}` : 'TERA-88392';
  const upiId = 'terabox.vip@axl';

  // 5-minute countdown (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

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
      toast.success('Payment QR & Session Refreshed', {
        description: 'New 5-minute payment window initialized.'
      });
    }, 800);
  };

  const handleCancel = () => {
    triggerHaptic('light');
    navigate('/premium');
  };

  const handleCopyUpi = () => {
    triggerHaptic('light');
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    toast.success('UPI ID copied to clipboard');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSimulateSuccess = () => {
    triggerHaptic('heavy');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.55 },
          colors: ['#F59E0B', '#FFD700', '#22D3EE', '#FFFFFF']
        });
      } catch (e) {
        // ignore
      }
      activatePlan(planName);
      toast.success(`🎉 Payment Successful!`, {
        description: `${planName} has been activated for ${teraId}.`,
        duration: 4000
      });
      navigate('/premium');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex flex-col items-center justify-center px-4 py-8 relative selection:bg-amber-500/30">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-b from-amber-500/15 via-cyan-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Main Payment Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#141824] via-[#0E121D] to-[#0A0D15] border border-amber-500/40 p-6 sm:p-7 shadow-[0_0_60px_rgba(245,158,11,0.22)] flex flex-col items-center text-center gap-4"
      >
        {/* Top Floating Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
          <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Terabox VIP Gateway</span>
        </div>

        {/* 1. Complete Payment Heading */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Complete Payment
          </h1>

          {/* 2. TeraID */}
          <div className="flex items-center gap-2 text-xs text-gray-300 font-mono bg-white/5 px-3 py-1 rounded-xl border border-white/10 mt-0.5">
            <span className="text-gray-400">TeraID:</span>
            <strong className="text-cyan-300 font-bold tracking-wider">{teraId}</strong>
          </div>

          {/* 3. Expires in a few min (Live Countdown) */}
          <div className="flex items-center gap-1.5 text-xs font-semibold mt-1">
            <Clock className={`w-3.5 h-3.5 ${timeLeft < 60 ? 'text-rose-400 animate-spin' : 'text-amber-400'}`} />
            <span className="text-gray-400">Expires in a few min:</span>
            <span className={`font-mono font-black px-2 py-0.5 rounded-md ${
              timeLeft < 60
                ? 'bg-rose-500/20 text-rose-300 animate-pulse border border-rose-500/30'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}>
              {formatTimer(timeLeft)}
            </span>
          </div>
        </div>

        {/* 4. QR Code Displayer in Middle */}
        <div className="relative flex flex-col items-center justify-center my-1">
          {/* Outer QR Frame with Glowing Corners */}
          <div className="relative p-3.5 bg-white rounded-3xl shadow-2xl border-4 border-amber-400/80 shadow-amber-500/30 overflow-hidden">
            {/* Animated Laser Scanning Beam */}
            <motion.div
              initial={{ top: '0%' }}
              animate={{ top: ['0%', '95%', '0%'] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_12px_rgba(6,182,212,1)] z-20 pointer-events-none"
            />

            {/* Crisp High-Res Vector QR Code Representation */}
            <svg
              className="w-48 h-48 sm:w-52 sm:h-52 select-none"
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
                {/* Horizontal & vertical alignment tracks */}
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

              {/* Central Terabox / UPI Badge */}
              <circle cx="100" cy="100" r="19" fill="#070A12" />
              <circle cx="100" cy="100" r="17" fill="#F59E0B" />
              <path
                d="M93 104L97 96H104L98 104H93ZM97 104L101 96H107L101 104H97Z"
                fill="#0A0E1A"
              />
            </svg>
          </div>

          <p className="text-[10px] text-gray-400 font-medium mt-2 flex items-center gap-1.5">
            <span>Scan with any UPI App</span>
            <span className="text-gray-600">•</span>
            <span className="text-amber-400 font-bold">GPay / PhonePe / Paytm / BHIM</span>
          </p>
        </div>

        {/* 5. Below Amount */}
        <div className="w-full flex flex-col items-center py-2 px-4 rounded-2xl bg-white/[0.04] border border-white/10">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Total Amount to Pay
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              {planPrice}
            </span>
            <span className="text-xs font-bold text-gray-400">({planName})</span>
          </div>

          {/* Copyable UPI ID snippet */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
            <span>UPI ID: <strong className="text-white font-mono">{upiId}</strong></span>
            <button
              onClick={handleCopyUpi}
              className="p-1 rounded-md hover:bg-white/10 text-cyan-400 transition-colors cursor-pointer"
              title="Copy UPI ID"
            >
              {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* 6. Below: Refresh Button & Cancel Button */}
        <div className="w-full flex items-center gap-2.5 pt-1">
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-white/8 hover:bg-white/15 text-white font-bold text-xs border border-white/10 hover:border-cyan-400/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
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

        {/* Complete / Verify Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSimulateSuccess}
          disabled={isVerifying}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 hover:brightness-110 transition-all cursor-pointer mt-1"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>Verifying Payment...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>I Have Paid • Activate VIP</span>
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
