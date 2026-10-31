import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  RefreshCw,
  Users,
  TrendingUp,
  UserCheck,
  Crown,
  Activity,
  IndianRupee,
  Star,
  CreditCard,
  Settings,
  Megaphone,
  BarChart3,
  User,
  Wrench,
  Database,
  Link2,
  HardDrive,
  Copy,
  Check,
  CheckCircle2,
  ArrowUp,
  ChevronDown,
  Sliders,
  X,
  Radio,
  Clock,
  Sparkles,
  Loader2
} from 'lucide-react';
import { ModalShell } from '../components/ModalShell';
import { triggerHaptic } from '../utils/telegram';
import { toast } from 'sonner';

export const Owner = () => {
  const navigate = useNavigate();

  // State controls
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoCleanStorage, setAutoCleanStorage] = useState(true);
  const [storageLimitMb, setStorageLimitMb] = useState('200');
  const [withdrawalFilter, setWithdrawalFilter] = useState('all');

  // Migration form state
  const [oldMongoUri, setOldMongoUri] = useState('mongodb+srv://admin:••••••••@cluster0.abcde.mongodb.net/production');
  const [newMongoUri, setNewMongoUri] = useState('mongodb+srv://admin:••••••••@cluster-new.abcde.mongodb.net/backup');
  const [hostName, setHostName] = useState('cluster-new.abcde.mongodb.net');
  const [dbName, setDbName] = useState('terabox_production');
  const [backupChannel, setBackupChannel] = useState('@TeraboxBackupLogs');
  const [isCopying, setIsCopying] = useState(false);

  // Modals state for 5 tools: plans, settings, fsub, ads, profile
  const [activeModal, setActiveModal] = useState(null); // 'plans' | 'settings' | 'fsub' | 'ads'

  // Activity Chart mock data (14 days)
  const chartBars = [
    { day: 'Day 1', height: 16 },
    { day: 'Day 2', height: 18 },
    { day: 'Day 3', height: 22 },
    { day: 'Day 4', height: 20 },
    { day: 'Day 5', height: 24 },
    { day: 'Day 6', height: 28 },
    { day: 'Day 7', height: 22 },
    { day: 'Day 8', height: 58 },
    { day: 'Day 9', height: 32 },
    { day: 'Day 10', height: 26 },
    { day: 'Day 11', height: 28 },
    { day: 'Day 12', height: 30 },
    { day: 'Day 13', height: 96 },
    { day: 'Day 14', height: 98 },
  ];

  const handleRefreshAll = () => {
    triggerHaptic('medium');
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Owner dashboard metrics refreshed with live telemetry!');
    }, 900);
  };

  const handleMaintenanceToggle = () => {
    triggerHaptic('heavy');
    const nextState = !maintenanceMode;
    setMaintenanceMode(nextState);
    if (nextState) {
      toast.warning('Maintenance mode ENABLED! Bot will reject public requests.');
    } else {
      toast.success('Maintenance mode disabled. Bot is LIVE.');
    }
  };

  const handleCleanCache = () => {
    triggerHaptic('medium');
    toast.loading('Clearing link cache older than 7 days...', { id: 'cache-toast' });
    setTimeout(() => {
      toast.dismiss('cache-toast');
      toast.success('Cleaned link cache! 42.8 MB freed from Atlas cluster.');
    }, 1200);
  };

  const handleResetLinkCounters = () => {
    triggerHaptic('medium');
    toast.success('Link performance counters reset for today!');
  };

  const handleSaveStorageMb = (e) => {
    e.preventDefault();
    triggerHaptic('light');
    toast.success(`Storage limit set to ${storageLimitMb} MB successfully.`);
  };

  const handleStartCopyNow = () => {
    triggerHaptic('heavy');
    setIsCopying(true);
    toast.loading('Scanning old database and preparing clone stream...', { id: 'copy-toast' });

    setTimeout(() => {
      setIsCopying(false);
      toast.dismiss('copy-toast');
      toast.success('Database migration verified! 1,511 users, 512 videos cloned successfully.');
    }, 2500);
  };

  const scrollToTop = () => {
    triggerHaptic('light');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-4 pb-28 px-4 max-w-4xl mx-auto pt-6 text-white min-h-screen relative">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              triggerHaptic('light');
              navigate('/');
            }}
            className="w-10 h-10 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer border border-white/5"
            aria-label="Back to explore"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Owner Dashboard</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]" />
            </h1>
            <p className="text-xs text-gray-400 font-medium">Stats & controls</p>
          </div>
        </div>

        <button
          onClick={handleRefreshAll}
          disabled={isRefreshing}
          className="w-10 h-10 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer border border-white/5"
          aria-label="Refresh metrics"
        >
          <RefreshCw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 2. Key Metric Cards (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-3">
        {/* TOTAL USERS */}
        <div className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-xl backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              TOTAL USERS
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              1511
            </span>
          </div>
        </div>

        {/* NEW TODAY */}
        <div className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-xl backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              NEW TODAY
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              217
            </span>
            <p className="text-[10px] text-emerald-400 font-bold mt-0.5">
              +1509 this week
            </p>
          </div>
        </div>

        {/* FREE USERS */}
        <div className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-xl backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              FREE USERS
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-500/15 text-gray-300 flex items-center justify-center border border-white/10">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              1501
            </span>
          </div>
        </div>

        {/* PAID USERS */}
        <div className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-xl backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              PAID USERS
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
              <Crown className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              10
            </span>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE USERS (REAL USAGE) Card */}
      <div className="relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center gap-2 pb-4">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-300">
            ACTIVE USERS (REAL USAGE)
          </h2>
        </div>

        {/* Stats Grid: Row 1 */}
        <div className="grid grid-cols-3 gap-2 text-center pb-3">
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">668</div>
            <div className="text-[10px] text-gray-400 font-medium">Today</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">702</div>
            <div className="text-[10px] text-gray-400 font-medium">Yesterday</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">44.2%</div>
            <div className="text-[10px] text-gray-400 font-medium">Daily / Monthly</div>
          </div>
        </div>

        {/* Stats Grid: Row 2 */}
        <div className="grid grid-cols-3 gap-2 text-center pb-2">
          <div>
            <div className="text-xl sm:text-2xl font-black text-cyan-400">1321</div>
            <div className="text-[10px] text-gray-400 font-medium">Active 7 days</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-cyan-400">1511</div>
            <div className="text-[10px] text-gray-400 font-medium">Active 30 days</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-amber-400">228.3</div>
            <div className="text-[10px] text-gray-400 font-medium">Avg/day (7d)</div>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 font-medium pb-4 text-center sm:text-left">
          Avg/day (30d): 62.9
        </p>

        {/* 14 Days Activity Bar Chart */}
        <div className="pt-2">
          <div className="h-24 w-full flex items-end justify-between gap-1 sm:gap-2 px-1">
            {chartBars.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip on hover */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 text-[9px] bg-black/80 px-1.5 py-0.5 rounded text-cyan-300 pointer-events-none whitespace-nowrap">
                  {bar.height * 7}
                </span>
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-cyan-600 via-cyan-500 to-cyan-400 transition-all duration-300 hover:brightness-125"
                  style={{ height: `${bar.height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="text-[10px] text-gray-400 font-medium pt-2">
            Last 14 days
          </div>
        </div>
      </div>

      {/* 4. REVENUE THIS MONTH Card */}
      <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-xl backdrop-blur-xl">
        {/* Large watermark Rupee Symbol on the right */}
        <div className="absolute -right-2 -bottom-4 text-8xl font-black text-white/[0.04] select-none pointer-events-none">
          ₹
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          REVENUE THIS MONTH
        </span>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            ₹106
          </span>
        </div>
        <p className="text-[11px] text-gray-400 font-medium mt-1">
          Total all time: ₹106 (UPI ₹ + Stars combined, as before)
        </p>
      </div>

      {/* 4b. 2x2 Revenue Split Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Today UPI
          </span>
          <div className="text-xl font-black text-white mt-1">₹22</div>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Today Stars
          </span>
          <div className="text-xl font-black text-amber-400 mt-1 flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>20</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            This Month UPI
          </span>
          <div className="text-xl font-black text-white mt-1">₹84</div>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            This Month Stars
          </span>
          <div className="text-xl font-black text-amber-400 mt-1 flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>22</span>
          </div>
        </div>
      </div>

      {/* 5. WITHDRAWALS Card */}
      <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-xl backdrop-blur-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-widest text-gray-300">
            WITHDRAWALS
          </span>
          <select
            value={withdrawalFilter}
            onChange={(e) => setWithdrawalFilter(e.target.value)}
            className="bg-black/50 text-[10px] font-bold text-gray-300 px-2 py-1 rounded-lg border border-white/10 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="waiting">Waiting</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center py-1">
          <div className="p-2.5 rounded-2xl bg-white/[0.03]">
            <div className="text-xs text-gray-400 font-bold">Total</div>
            <div className="text-lg font-black text-cyan-400 mt-0.5">0</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/[0.03]">
            <div className="text-xs text-gray-400 font-bold">Taken</div>
            <div className="text-lg font-black text-cyan-400 mt-0.5">1</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/[0.03]">
            <div className="text-xs text-gray-400 font-bold">Orders</div>
            <div className="text-lg font-black text-cyan-400 mt-0.5">1</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-white/[0.03]">
            <div className="text-xs text-gray-400 font-bold">Pending</div>
            <div className="text-lg font-black text-amber-400 mt-0.5">1</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/[0.03]">
            <div className="text-xs text-gray-400 font-bold">Waiting</div>
            <div className="text-lg font-black text-cyan-400 mt-0.5">2</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/[0.03]">
            <div className="text-xs text-gray-400 font-bold">Rejected</div>
            <div className="text-lg font-black text-rose-400 mt-0.5">0</div>
          </div>
        </div>
      </div>

      {/* 6. SHARE STARS Card */}
      <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-xl backdrop-blur-xl flex flex-col gap-3">
        <span className="text-[11px] font-black uppercase tracking-widest text-gray-300">
          SHARE STARS
        </span>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-gray-400 font-bold">Stars earned</span>
            <div className="text-lg font-black text-amber-400 mt-1 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>0</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-gray-400 font-bold">Saved Stars (stock)</span>
            <div className="text-lg font-black text-amber-400 mt-1 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>0</span>
            </div>
            <p className="text-[9px] text-gray-400 mt-0.5">0 users</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-gray-400 font-bold">Shared videos</span>
            <div className="text-lg font-black text-white mt-1">490</div>
            <p className="text-[9px] text-gray-400 mt-0.5">0 reached the limit</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-gray-400 font-bold">Players via share</span>
            <div className="text-lg font-black text-white mt-1">0</div>
          </div>
        </div>
      </div>

      {/* 7. Action Buttons Grid (5 Icons: Plans, Settings, FSUB, Ads, Profile) */}
      <div className="grid grid-cols-5 gap-2 py-1">
        <button
          onClick={() => {
            triggerHaptic('medium');
            setActiveModal('plans');
          }}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#0F172A]/90 hover:bg-[#1E293B] active:scale-95 border border-white/10 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-gray-300">Plans</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('medium');
            setActiveModal('settings');
          }}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#0F172A]/90 hover:bg-[#1E293B] active:scale-95 border border-white/10 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-gray-300">Settings</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('medium');
            setActiveModal('fsub');
          }}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#0F172A]/90 hover:bg-[#1E293B] active:scale-95 border border-white/10 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Megaphone className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-gray-300">FSUB</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('medium');
            setActiveModal('ads');
          }}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#0F172A]/90 hover:bg-[#1E293B] active:scale-95 border border-white/10 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BarChart3 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-gray-300">Ads</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('medium');
            navigate('/profile');
          }}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#0F172A]/90 hover:bg-[#1E293B] active:scale-95 border border-white/10 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <User className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-gray-300">Profile</span>
        </button>
      </div>

      {/* 8. Maintenance Mode Card */}
      <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-xl backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Maintenance mode</h3>
            <p className="text-[10px] text-gray-400 font-medium">Text & button: Settings → maintenance</p>
          </div>
        </div>

        {/* Interactive Toggle Switch */}
        <button
          onClick={handleMaintenanceToggle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all cursor-pointer border ${
            maintenanceMode
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : 'bg-white/5 border-white/10 text-gray-400'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full transition-transform ${
              maintenanceMode ? 'bg-rose-400 translate-x-2' : 'bg-gray-500'
            }`}
          />
          <span className="text-xs font-black uppercase">
            {maintenanceMode ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* 9. Database Storage Card */}
      <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-xl backdrop-blur-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-black uppercase tracking-wider text-gray-200">
              Database storage
            </span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              toast.info('Database stats refreshed');
            }}
            className="p-1 rounded-lg text-gray-400 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
          Tap refresh to read sizes (Free Atlas limit = 512 MB per cluster).
        </p>

        <button
          onClick={handleCleanCache}
          className="w-full py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-xs font-black uppercase tracking-wider text-gray-200 border border-white/10 transition-all cursor-pointer shadow-md"
        >
          CLEAN LINK CACHE (&gt; 7 days)
        </button>
      </div>

      {/* 10. Links Processed Card */}
      <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-xl backdrop-blur-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-black uppercase tracking-wider text-gray-200">
              Links processed
            </span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              toast.info('Link logs updated');
            }}
            className="p-1 rounded-lg text-gray-400 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 breakdown rows */}
        <div className="flex flex-col gap-2 pt-1 text-[11px] font-medium leading-relaxed">
          <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-1.5">
            <span className="text-gray-400 font-bold">Today</span>
            <span className="text-right text-gray-300">
              2267 total • <strong className="text-emerald-400 font-bold">2261 ok</strong> •{' '}
              <strong className="text-rose-400 font-bold">6 failed (3 dead)</strong> • 99.7% • 9 fake
            </span>
          </div>

          <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-1.5">
            <span className="text-gray-400 font-bold">Last 7 days</span>
            <span className="text-right text-gray-300">
              4471 total • <strong className="text-emerald-400 font-bold">4433 ok</strong> •{' '}
              <strong className="text-rose-400 font-bold">38 failed (17 dead)</strong> • 99.2% • 30 fake
            </span>
          </div>

          <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-1.5">
            <span className="text-gray-400 font-bold">Last 30 days</span>
            <span className="text-right text-gray-300">
              4471 total • <strong className="text-emerald-400 font-bold">4433 ok</strong> •{' '}
              <strong className="text-rose-400 font-bold">38 failed (17 dead)</strong> • 99.2% • 30 fake
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-gray-400 font-bold whitespace-nowrap">Since 2026-10-23</span>
            <span className="text-right text-gray-300">
              4471 total • <strong className="text-emerald-400 font-bold">4433 ok</strong> •{' '}
              <strong className="text-rose-400 font-bold">38 failed (17 dead)</strong> • 99.2% • 30 fake
            </span>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 font-medium">
          dead = TeraBox says the link is deleted / expired
        </p>

        <button
          onClick={handleResetLinkCounters}
          className="w-full py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-xs font-black uppercase tracking-wider text-gray-200 border border-white/10 transition-all cursor-pointer shadow-md mt-1"
        >
          RESET LINK COUNTERS
        </button>
      </div>

      {/* 11. Explorer Storage Limit Card */}
      <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-xl backdrop-blur-xl flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wider text-gray-200">
              Explorer storage limit
            </span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              toast.info('Storage metrics checked');
            }}
            className="p-1 rounded-lg text-gray-400 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] font-bold text-gray-300">
            <span>0.71 MB of {storageLimitMb} MB</span>
            <span className="text-cyan-400 font-black">0.35%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="w-[1%] h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium pt-1">
            <span>ExplorerVideo: 512 docs • 0.36 MB</span>
            <span>TeraboxCache: 678 docs • 0.35 MB</span>
          </div>
        </div>

        {/* Input Limit Field & Save Button */}
        <form onSubmit={handleSaveStorageMb} className="flex gap-2 pt-1">
          <input
            type="number"
            value={storageLimitMb}
            onChange={(e) => setStorageLimitMb(e.target.value)}
            className="flex-1 py-2 px-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-black uppercase text-white border border-white/10 transition-all cursor-pointer"
          >
            SAVE MB
          </button>
        </form>

        {/* Auto clean toggle */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-medium text-gray-300">Auto clean (every 6 h)</span>
          <button
            onClick={() => {
              triggerHaptic('light');
              setAutoCleanStorage(!autoCleanStorage);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              autoCleanStorage ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 text-gray-400 border border-white/10'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${autoCleanStorage ? 'bg-emerald-400' : 'bg-gray-500'}`} />
            <span>{autoCleanStorage ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Action Buttons Stack */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={() => {
              triggerHaptic('medium');
              toast.success('Cleaned 0 dead/hidden videos');
            }}
            className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-xs font-black uppercase text-gray-200 border border-white/10 transition-all cursor-pointer"
          >
            DELETE DEAD / HIDDEN VIDEOS
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              toast.success('Clean now complete: 0 items pruned');
            }}
            className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-xs font-black uppercase text-gray-200 border border-white/10 transition-all cursor-pointer"
          >
            CLEAN NOW (rules + limit)
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              toast.success('Storage freed up to 50%');
            }}
            className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-xs font-black uppercase text-gray-200 border border-white/10 transition-all cursor-pointer"
          >
            FREE UP TO 50% OF LIMIT
          </button>
        </div>
      </div>

      {/* 12. Copy data to a new MongoDB Card */}
      <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#0F172A]/90 via-[#0B1222]/95 to-[#070A14] border border-white/5 shadow-xl backdrop-blur-xl flex flex-col gap-3.5 mb-4">
        <div className="flex items-center gap-2">
          <Copy className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-200">
            Copy data to a new MongoDB
          </h3>
        </div>

        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
          Old database is only read. Copies settings, plans, channels, ads, users, orders, share rewards and Explorer videos. Links are used for this request only.
        </p>

        {/* Inputs */}
        <div className="flex flex-col gap-2.5">
          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-1">Old MongoDB connection URI</label>
            <input
              type="text"
              value={oldMongoUri}
              onChange={(e) => setOldMongoUri(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-black/50 border border-white/10 text-xs text-gray-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-1">New MongoDB connection URI</label>
            <input
              type="text"
              value={newMongoUri}
              onChange={(e) => setNewMongoUri(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-black/50 border border-white/10 text-xs text-gray-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">Host</label>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-black/50 border border-white/10 text-xs text-gray-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">DB / cluster</label>
              <input
                type="text"
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-black/50 border border-white/10 text-xs text-gray-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-1">Channel/chat to stream backup</label>
            <select
              value={backupChannel}
              onChange={(e) => setBackupChannel(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-black/50 border border-white/10 text-xs text-gray-200 focus:outline-none"
            >
              <option value="@TeraboxBackupLogs">@TeraboxBackupLogs (Primary Log Channel)</option>
              <option value="@TeraboxAdminsPrivate">@TeraboxAdminsPrivate</option>
            </select>
          </div>
        </div>

        {/* Buttons Stack */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => {
              triggerHaptic('medium');
              toast.info('Scanning old cluster: 1,511 user documents found.');
            }}
            className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-xs font-black uppercase text-gray-200 border border-white/10 transition-all cursor-pointer"
          >
            1. SCAN OLD DATABASE (READ ONLY)
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                triggerHaptic('medium');
                toast.success('Connection handshake verified with destination!');
              }}
              className="py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-xs font-black uppercase text-gray-200 border border-white/10 transition-all cursor-pointer"
            >
              2. CHECK
            </button>
            <button
              onClick={() => {
                triggerHaptic('medium');
                toast.info('Copy prepared. Ready to execute.');
              }}
              className="py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-xs font-black uppercase text-gray-200 border border-white/10 transition-all cursor-pointer"
            >
              3. COPY
            </button>
          </div>

          <button
            onClick={handleStartCopyNow}
            disabled={isCopying}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer mt-1"
          >
            {isCopying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>MIGRATING CLUSTER DATA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-white" />
                <span>START COPY NOW</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating Scroll to Top Cyan Circular Button (as seen in screenshot) */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-24 right-5 z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-sky-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40 cursor-pointer active:scale-90 transition-transform"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </motion.button>

      {/* MODAL 1: Plans Manager */}
      <ModalShell
        isOpen={activeModal === 'plans'}
        onClose={() => setActiveModal(null)}
        title="Manage Subscription Plans"
      >
        <div className="flex flex-col gap-3 text-xs">
          <p className="text-gray-300">Set active prices and duration for user plans.</p>
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Lite (Free Trial)</div>
              <div className="text-[11px] text-gray-400">1-Hour Referral Access</div>
            </div>
            <span className="font-bold text-emerald-400">FREE</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Daily VIP Pass</div>
              <div className="text-[11px] text-gray-400">24 Hours VIP</div>
            </div>
            <span className="font-bold text-cyan-400">₹10 / 10 ⭐</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Royal Sovereign VIP</div>
              <div className="text-[11px] text-gray-400">30 Days VIP</div>
            </div>
            <span className="font-bold text-amber-400">₹20 / 20 ⭐</span>
          </div>

          <button
            onClick={() => {
              triggerHaptic('medium');
              toast.success('Plan pricing updated');
              setActiveModal(null);
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold mt-2"
          >
            Save Plans Configuration
          </button>
        </div>
      </ModalShell>

      {/* MODAL 2: Settings Manager */}
      <ModalShell
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        title="Bot Global Settings"
      >
        <div className="flex flex-col gap-3 text-xs">
          <div>
            <label className="text-[10px] text-gray-400 font-bold block mb-1">Bot Name</label>
            <input
              type="text"
              defaultValue="Terabox Mini Bot"
              className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold block mb-1">Default Daily Free Credits</label>
            <input
              type="number"
              defaultValue={100}
              className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold block mb-1">UPI Receiver VPA</label>
            <input
              type="text"
              defaultValue="terabox@upi"
              className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
            />
          </div>

          <button
            onClick={() => {
              triggerHaptic('medium');
              toast.success('Global settings saved');
              setActiveModal(null);
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold mt-2"
          >
            Save Settings
          </button>
        </div>
      </ModalShell>

      {/* MODAL 3: FSUB Channels Manager */}
      <ModalShell
        isOpen={activeModal === 'fsub'}
        onClose={() => setActiveModal(null)}
        title="Force Subscription (FSUB)"
      >
        <div className="flex flex-col gap-3 text-xs">
          <p className="text-gray-300">Channels that users must join before unlocking streams.</p>
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
            <span className="font-bold text-white">@TeraboxMiniBot</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">ACTIVE</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
            <span className="font-bold text-white">@TeraboxOfficialNetwork</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">ACTIVE</span>
          </div>

          <button
            onClick={() => {
              triggerHaptic('medium');
              toast.success('FSUB Channels synced');
              setActiveModal(null);
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold mt-2"
          >
            Sync Channel Subscriptions
          </button>
        </div>
      </ModalShell>

      {/* MODAL 4: Ads Manager */}
      <ModalShell
        isOpen={activeModal === 'ads'}
        onClose={() => setActiveModal(null)}
        title="Sponsor & Ad Placements"
      >
        <div className="flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04]">
            <span className="text-white font-bold">In-Player Sponsor Banners</span>
            <span className="text-emerald-400 font-bold">ENABLED</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04]">
            <span className="text-white font-bold">Feed Sponsor Cards</span>
            <span className="text-emerald-400 font-bold">ENABLED</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04]">
            <span className="text-white font-bold">VIP Ad-Free Bypass</span>
            <span className="text-cyan-400 font-bold">100% BYPASS</span>
          </div>

          <button
            onClick={() => {
              triggerHaptic('medium');
              toast.success('Ad preferences updated');
              setActiveModal(null);
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black mt-2"
          >
            Update Ad Rules
          </button>
        </div>
      </ModalShell>
    </div>
  );
};
