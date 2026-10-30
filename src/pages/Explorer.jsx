import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  Heart,
  Crown,
  Sparkles,
  FilterX,
  Loader2,
  ArrowDown,
  Film,
  Zap,
  Infinity,
  AlertTriangle,
  Rocket,
  Shield,
  RotateCcw,
  Link2Off,
  AlertOctagon,
  ArrowRight,
  Clock,
  X
} from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { ContentCard } from '../components/ContentCard';
import { AdCard } from '../components/AdCard';
import { JoinChannelModal } from '../components/JoinChannelModal';
import { MovingInfinityIcon } from '../components/MovingInfinityIcon';
import { DUMMY_CONTENT } from '../data/dummyContent';
import { useAppState } from '../context/AppStateContext';
import { triggerHaptic } from '../utils/telegram';
import { toast } from 'sonner';

const TERABOX_DOMAINS = [
  'terabox.com',
  '1024tera.com',
  'teraboxapp.com',
  'terabox.app',
  'terasharelink.com',
  'freeterabox.com',
  'mirrobox.com',
  'nephobox.com',
  '4funbox.com',
  'momerybox.com',
  'tibibox.com'
];

export const Explorer = () => {
  const navigate = useNavigate();
  const {
    favourites,
    isPremium,
    currentPlan,
    referralTimeLeft,
    searchQuery,
    setSearchQuery,
    isFavouritesOnlyFilter,
    setIsFavouritesOnlyFilter,
    userProfile,
    setUserProfile
  } = useAppState();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [contentList, setContentList] = useState(DUMMY_CONTENT);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Link status for search validation: null | { type: 'not_terabox' | 'wrong_link' | 'limit_reached' | 'failed', url: string, message: string }
  const [linkStatus, setLinkStatus] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Dynamic Live Stream Radar Rotating Headlines
  const headlinePhrases = [
    {
      icon: Zap,
      prefix: 'Stream & Play',
      highlight: 'Ultra HD 4K Cloud Media',
      tag: 'FAST CLOUD'
    },
    {
      icon: Rocket,
      prefix: 'Blazing Fast',
      highlight: 'Direct High-Speed Downloads',
      tag: 'MAX TURBO'
    },
    {
      icon: Shield,
      prefix: 'Private & Secure',
      highlight: 'Telegram Cloud Vault',
      tag: 'ENCRYPTED'
    },
    {
      icon: Crown,
      prefix: 'VIP Experience',
      highlight: 'Zero Buffering & Instant Play',
      tag: 'ROYAL VIP'
    }
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % headlinePhrases.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [headlinePhrases.length]);

  // Pull-To-Refresh State
  const pullDistanceRef = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (window.scrollY === 0 && touchStartY.current > 0) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - touchStartY.current);
      if (distance > 0 && distance < 120) {
        setPullDistance(distance);
        pullDistanceRef.current = distance;
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 70) {
      handleRefresh();
    }
    setPullDistance(0);
    pullDistanceRef.current = 0;
    touchStartY.current = 0;
  };

  const handleRefresh = () => {
    triggerHaptic('medium');
    setIsRefreshing(true);
    setTimeout(() => {
      const shuffled = [...DUMMY_CONTENT].sort(() => 0.5 - Math.random());
      setContentList(shuffled);
      setIsRefreshing(false);
      toast.success('Feed refreshed');
    }, 1200);
  };

  // Search & Link Validation Logic
  const handleSearchExecute = (query) => {
    if (!query || !query.trim()) {
      setSearchQuery('');
      setLinkStatus(null);
      return;
    }

    const trimmed = query.trim();

    // Check if query is a URL or link
    const isUrl =
      /^https?:\/\//i.test(trimmed) ||
      /^www\./i.test(trimmed) ||
      TERABOX_DOMAINS.some((d) => trimmed.toLowerCase().includes(d)) ||
      (/\.[a-z]{2,}(\/|\?|$)/i.test(trimmed) && trimmed.includes('/'));

    if (isUrl) {
      // 1. Check if the link belongs to TeraBox
      let hostname = '';
      try {
        const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
        hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '');
      } catch (e) {
        hostname = '';
      }

      const isTerabox = TERABOX_DOMAINS.some(
        (domain) => hostname === domain || hostname.endsWith('.' + domain) || trimmed.toLowerCase().includes(domain)
      );

      // A) Does not belong to TeraBox
      if (!isTerabox) {
        triggerHaptic('heavy');
        toast.error("Unsupported Link: Not a TeraBox URL", {
          description: "This link does not belong to TeraBox! Please paste a valid TeraBox share link.",
          duration: 4500
        });
        setLinkStatus({
          type: 'not_terabox',
          url: trimmed,
          message: "This link does not belong to TeraBox. Only TeraBox share URLs (e.g., terabox.com/s/...) can be resolved."
        });
        setIsSearching(false);
        return;
      }

      // B) Limit reached (User has 0 credits or URL has 'limit')
      if ((!isPremium && userProfile?.credits <= 0) || trimmed.toLowerCase().includes('limit')) {
        triggerHaptic('heavy');
        toast.warning("Daily Resolving Limit Reached!", {
          description: "You have reached your daily resolving limit. Upgrade to VIP to enjoy unlimited high-speed streams!",
          duration: 5000,
          action: {
            label: "Upgrade to VIP",
            onClick: () => navigate('/premium')
          }
        });
        setLinkStatus({
          type: 'limit_reached',
          url: trimmed,
          message: "Daily Resolving Limit Reached! Free tier has reached today's limit. Upgrade to Royal VIP for infinite resolutions with zero wait time."
        });
        setIsSearching(false);
        return;
      }

      // C) Wrong / Malformed link
      const isMalformed =
        trimmed.toLowerCase().includes('wrong') ||
        trimmed.toLowerCase().includes('invalid') ||
        trimmed.toLowerCase().includes('broken') ||
        (!trimmed.includes('/s/') && !trimmed.includes('surl=') && !trimmed.includes('/sharing/'));

      if (isMalformed) {
        triggerHaptic('heavy');
        toast.error("Wrong Link Found!", {
          description: "The share URL is malformed or invalid. Please check your link and try again.",
          duration: 4500
        });
        setLinkStatus({
          type: 'wrong_link',
          url: trimmed,
          message: "Wrong link found! The TeraBox URL is malformed, expired, or missing the share key. Please check your link and paste again."
        });
        setIsSearching(false);
        return;
      }

      // D) Valid TeraBox link that fails to resolve (e.g. contains 'fail' or simulation)
      if (trimmed.toLowerCase().includes('fail') || trimmed.toLowerCase().includes('error')) {
        setIsSearching(true);
        setTimeout(() => {
          setIsSearching(false);
          triggerHaptic('heavy');
          toast.error("Link Resolution Failed", {
            description: "TeraBox cloud nodes timed out while fetching media. Click Try Again to retry.",
            duration: 6000,
            action: {
              label: "Try Again",
              onClick: () => handleRetryResolve(trimmed)
            }
          });
          setLinkStatus({
            type: 'failed',
            url: trimmed,
            message: "Link resolution failed due to cloud node timeout. Your link is valid, but the server didn't respond."
          });
        }, 1000);
        return;
      }

      // E) Valid link succeeds!
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
        triggerHaptic('medium');
        setLinkStatus(null);

        // Deduct 1 credit if not premium
        if (!isPremium && userProfile?.credits > 0 && typeof setUserProfile === 'function') {
          setUserProfile((prev) => ({
            ...prev,
            credits: Math.max(0, (prev.credits || 100) - 1)
          }));
        }

        const shareCode = trimmed.split('/').pop()?.slice(0, 14) || 'Cloud Media';
        const newItem = {
          id: `resolved-${Date.now()}`,
          title: `TeraBox 4K Media: ${shareCode}`,
          category: 'Cloud',
          thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60',
          duration: '02:14:30',
          quality: '4K HDR',
          views: '1.4k',
          size: '2.8 GB',
          likes: 95,
          isResolved: true
        };

        setContentList((prev) => [newItem, ...prev]);
        setSearchQuery('');

        toast.success("TeraBox Link Resolved!", {
          description: "1 item added to feed. Ready to stream in 4K HDR.",
          duration: 4000,
          action: {
            label: "Watch Now",
            onClick: () => setSelectedMedia(newItem)
          }
        });
      }, 1200);
      return;
    }

    // Normal keyword search
    setLinkStatus(null);
    setSearchQuery(trimmed);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 600);
  };

  // Retry resolution for failed valid links
  const handleRetryResolve = (url) => {
    triggerHaptic('medium');
    setIsRetrying(true);
    toast.loading("Retrying link resolution...", { id: 'retry-resolve-toast' });

    setTimeout(() => {
      setIsRetrying(false);
      toast.dismiss('retry-resolve-toast');
      setLinkStatus(null);

      if (!isPremium && userProfile?.credits > 0 && typeof setUserProfile === 'function') {
        setUserProfile((prev) => ({
          ...prev,
          credits: Math.max(0, (prev.credits || 100) - 1)
        }));
      }

      const shareCode = (url || '').split('/').pop()?.replace(/fail/gi, 'stream')?.slice(0, 14) || 'Stream 4K';
      const resolvedItem = {
        id: `retry-resolved-${Date.now()}`,
        title: `TeraBox Media (Resolved): ${shareCode} 4K`,
        category: 'Cloud',
        thumbnail: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=60',
        duration: '01:58:12',
        quality: '4K HDR',
        views: '3.6k',
        size: '3.2 GB',
        likes: 148,
        isResolved: true
      };

      setContentList((prev) => [resolvedItem, ...prev]);
      setSearchQuery('');

      toast.success("Link Resolved Successfully on Retry!", {
        description: "Ready to stream in 4K HDR",
        duration: 4000,
        action: {
          label: "Watch Now",
          onClick: () => setSelectedMedia(resolvedItem)
        }
      });
    }, 1200);
  };

  const filteredContent = contentList.filter((item) => {
    if (isFavouritesOnlyFilter && !favourites.includes(item.id)) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const gridKey = `feed-${isFavouritesOnlyFilter}-${searchQuery}`;
  const isReferralPlan = currentPlan === "Lite (Free 1hr)";
  const ratio = referralTimeLeft / 3600;

  const getTimerBorderStyles = () => {
    if (ratio > 0.5) {
      return {
        border: 'border-2 border-emerald-500',
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/15 shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]'
      };
    } else if (ratio >= 0.2) {
      return {
        border: 'border-2 border-amber-500',
        text: 'text-amber-400',
        bg: 'bg-amber-500/15 shadow-[0_0_15px_-3px_rgba(245,158,11,0.4)]'
      };
    } else {
      return {
        border: 'border-2 border-rose-500',
        text: 'text-rose-400',
        bg: 'bg-rose-500/15 shadow-[0_0_15px_-3px_rgba(244,63,94,0.4)] animate-pulse'
      };
    }
  };

  const timerStyle = getTimerBorderStyles();

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex flex-col gap-3.5 pb-24 px-4 max-w-6xl mx-auto pt-7 sm:pt-9 relative overflow-x-hidden"
    >
      {/* Pull To Refresh Indicator */}
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isRefreshing ? 48 : Math.min(pullDistance, 48), opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-center text-cyan-400 text-xs font-bold overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 shadow-[0_0_20px_-6px_rgba(34,211,238,0.5)]">
              {isRefreshing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Refreshing feed</span>
                </>
              ) : (
                <>
                  <ArrowDown
                    className="w-4 h-4 text-cyan-400 transition-transform duration-150"
                    style={{ transform: `rotate(${Math.min(pullDistance * 2.5, 180)}deg)` }}
                  />
                  <span>{pullDistance > 70 ? 'Release to refresh' : 'Pull down to refresh'}</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered Modern Unified Logo */}
      <div className="flex items-center justify-center pt-2 pb-1 text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-sky-950/30 to-indigo-950/40 backdrop-blur-xl shadow-lg">
          <span className="text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]">
            Terabox
          </span>
          <span className="px-2.5 py-0.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 text-white text-[10.5px] font-black uppercase tracking-widest shadow-[0_0_16px_rgba(56,189,248,0.6)] flex items-center gap-1.5">
            {isPremium && <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />}
            <span>MINI</span>
          </span>
        </div>
      </div>

      {/* Brand New Cinema Spotlight Hero (Completely New Modern Look) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1C36]/90 via-[#0A1224]/95 to-[#060B16] p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(34,211,238,0.15)] backdrop-blur-3xl group">
        {/* Holographic Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.9)] pointer-events-none" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-24 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left: Dynamic Live Headline with Glowing Icon */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/30 via-blue-600/30 to-indigo-600/30 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(6,182,212,0.4)] text-cyan-300">
              {(() => {
                const CurrentIcon = headlinePhrases[phraseIdx]?.icon || Sparkles;
                return <CurrentIcon className="w-6 h-6 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />;
              })()}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,1)]" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  HYPER-SPEED CLOUD CDN
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[9px] font-black">
                  60 FPS
                </span>
              </div>
              <AnimatePresence mode="wait">
                {(() => {
                  const current = headlinePhrases[phraseIdx];
                  return (
                    <motion.div
                      key={phraseIdx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="flex items-center gap-1.5 flex-wrap"
                    >
                      <span className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                        {current.prefix}
                      </span>
                      <span className="text-sm sm:text-base font-black bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                        {current.highlight}
                      </span>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Live Stream Stat Equalizer Pod */}
          <div className="flex items-center gap-3 self-start sm:self-center bg-black/40 px-3.5 py-2 rounded-2xl shadow-inner shrink-0">
            <div className="flex items-end gap-1 h-5">
              <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-3" />
              <span className="w-1 bg-blue-500 rounded-full animate-bounce h-5" style={{ animationDelay: '0.15s' }} />
              <span className="w-1 bg-sky-300 rounded-full animate-bounce h-2.5" style={{ animationDelay: '0.3s' }} />
              <span className="w-1 bg-indigo-400 rounded-full animate-bounce h-4" style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10.5px] font-black text-cyan-300 tracking-wider">4K ULTRA HDR</span>
              <span className="text-[8.5px] font-bold text-gray-400 uppercase tracking-widest">ZERO BUFFERING</span>
            </div>
          </div>
        </div>

        {/* Feature Pills Strip */}
        <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-white/[0.08]">
          <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/[0.04] text-center">
            <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[10.5px] font-extrabold text-gray-200">Instant Play</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/[0.04] text-center">
            <Rocket className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-[10.5px] font-extrabold text-gray-200">Max Turbo</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/[0.04] text-center">
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[10.5px] font-extrabold text-gray-200">100% Ad-Free</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearchExecute}
        isSearching={isSearching}
      />

      {/* Dynamic Search Link Status Alert Banner */}
      <AnimatePresence>
        {linkStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className={`relative overflow-hidden rounded-2xl p-3.5 border backdrop-blur-xl shadow-lg flex flex-col gap-2.5 ${
              linkStatus.type === 'not_terabox'
                ? 'bg-amber-950/35 border-amber-500/50 text-amber-200 shadow-amber-500/10'
                : linkStatus.type === 'wrong_link'
                ? 'bg-rose-950/35 border-rose-500/50 text-rose-200 shadow-rose-500/10'
                : linkStatus.type === 'limit_reached'
                ? 'bg-purple-950/35 border-purple-500/50 text-purple-200 shadow-purple-500/10'
                : 'bg-orange-950/35 border-orange-500/50 text-orange-200 shadow-orange-500/10'
            }`}
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-xl bg-black/40 border border-white/10 shrink-0 mt-0.5">
                  {linkStatus.type === 'not_terabox' && <Link2Off className="w-4 h-4 text-amber-400" />}
                  {linkStatus.type === 'wrong_link' && <AlertOctagon className="w-4 h-4 text-rose-400" />}
                  {linkStatus.type === 'limit_reached' && <Clock className="w-4 h-4 text-purple-400" />}
                  {linkStatus.type === 'failed' && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-black tracking-wide uppercase">
                    {linkStatus.type === 'not_terabox' && 'Unsupported Link'}
                    {linkStatus.type === 'wrong_link' && 'Wrong Link Found'}
                    {linkStatus.type === 'limit_reached' && 'Daily Resolving Limit Reached'}
                    {linkStatus.type === 'failed' && 'Link Resolution Failed'}
                  </span>
                  <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                    {linkStatus.message}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setLinkStatus(null)}
                className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Action Buttons for Link Banner */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/10 justify-end">
              {linkStatus.type === 'failed' && (
                <button
                  onClick={() => handleRetryResolve(linkStatus.url)}
                  disabled={isRetrying}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                  <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
                </button>
              )}

              {linkStatus.type === 'limit_reached' && (
                <button
                  onClick={() => {
                    triggerHaptic('medium');
                    navigate('/premium');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Upgrade to VIP</span>
                </button>
              )}

              <button
                onClick={() => setLinkStatus(null)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Low Credits Alert Banner: "Watch Unlimited with Premium" */}
      {!isPremium && (userProfile?.credits <= 20) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-blue-500/15 border border-amber-400/40 shadow-[0_4px_25px_rgba(245,158,11,0.18)] backdrop-blur-xl"
        >
          {/* Specular top glow */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <Crown className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    {userProfile?.credits === 0 ? 'Out of Credits' : `Low Credit Alert (${userProfile?.credits || 0}/100)`}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    VIP Deal
                  </span>
                </div>
                <p className="text-xs text-gray-200 font-medium mt-0.5">
                  Skip daily waiting limits & buffer-free 4K streaming.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                triggerHaptic('medium');
                navigate('/premium');
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>Watch Unlimited with Premium</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Separated Media Count & Credits Row - Distinct Cards */}
      <div className="flex items-center justify-between gap-2.5 pt-1.5">
        {/* Total Media Pill */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0A0D15]/90 border border-white/10 text-xs font-semibold text-gray-300 shadow-md backdrop-blur-md">
          <Film className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>
            Total Media: <strong className="text-white font-bold">{filteredContent.length}</strong> items
          </span>
        </div>

        {/* Dynamic Credits Pill (Green first -> Yellow -> Red, or Animated Moving Infinity for Unlimited) */}
        {isReferralPlan ? (
          <div className={`relative px-3.5 py-2 rounded-2xl text-xs font-black transition-all ${timerStyle.border} ${timerStyle.bg} ${timerStyle.text} flex items-center gap-2 shadow-md backdrop-blur-md`}>
            <MovingInfinityIcon theme="emerald" className="w-5 h-3" />
            <span>Credits</span>
          </div>
        ) : (isPremium || userProfile?.credits === 'unlimited' || userProfile?.credits === Infinity) ? (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-500/15 text-blue-300 border border-blue-500/40 text-xs font-black shadow-[0_0_20px_rgba(59,130,246,0.35)] backdrop-blur-md">
            <MovingInfinityIcon theme="blue" className="w-6 h-3.5" />
            <span>Unlimited Credits</span>
          </div>
        ) : (
          (() => {
            const credits = userProfile?.credits ?? 0;
            const isRed = credits <= 20;
            const isYellow = credits > 20 && credits <= 50;
            // Green is credits > 50
            return (
              <div
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black shadow-md backdrop-blur-md transition-all ${
                  isRed
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
                    : isYellow
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                }`}
              >
                {isRed ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                ) : isYellow ? (
                  <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                ) : (
                  <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 shrink-0" />
                )}
                <span>{credits}/100 Credits</span>
              </div>
            );
          })()
        )}
      </div>

      {/* Favourites & Refresh Bar */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              setIsFavouritesOnlyFilter(!isFavouritesOnlyFilter);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
              isFavouritesOnlyFilter
                ? 'bg-rose-500/15 text-rose-400 border-rose-500/50 shadow-[0_0_16px_-4px_rgba(244,63,94,0.5)]'
                : 'glass-panel text-gray-300 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 transition-colors ${isFavouritesOnlyFilter ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Favourites</span>
            <span
              className={`ml-0.5 min-w-[18px] px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none flex items-center justify-center ${
                isFavouritesOnlyFilter ? 'bg-rose-500/25 text-rose-300' : 'bg-white/10 text-gray-300'
              }`}
            >
              {favourites.length}
            </span>
          </button>

          {/* Redesigned Modern Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh feed"
            className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border cursor-pointer select-none overflow-hidden ${
              isRefreshing
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.45)]'
                : 'glass-panel text-gray-300 hover:text-white border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_16px_rgba(6,182,212,0.3)] bg-gradient-to-r from-slate-900/90 to-slate-800/80 hover:from-cyan-950/40 hover:to-slate-900/90'
            }`}
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent pointer-events-none" />
            <RefreshCw
              className={`w-3.5 h-3.5 transition-transform duration-500 ${
                isRefreshing ? 'animate-spin text-cyan-400' : 'group-hover:rotate-180 text-cyan-400'
              }`}
            />
            <span className="text-[11px] font-extrabold tracking-wide">
              {isRefreshing ? 'Syncing...' : 'Refresh'}
            </span>
          </motion.button>
        </div>

        <AnimatePresence>
          {isFavouritesOnlyFilter && (
            <motion.button
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              onClick={() => setIsFavouritesOnlyFilter(false)}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer shrink-0"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Show all</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Content Grid */}
      {isSearching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="glass-panel rounded-3xl p-3 flex flex-col gap-2 animate-pulse border border-white/5"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="aspect-[4/3] w-full rounded-2xl shimmer-bg" />
              <div className="h-4 w-3/4 rounded shimmer-bg" />
              <div className="h-3 w-1/2 rounded shimmer-bg" />
            </div>
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-3xl my-8 border border-white/10"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mb-4">
            <Sparkles className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-200">Nothing here yet</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            {searchQuery
              ? `Nothing matches "${searchQuery}". Try a different search term.`
              : 'Nothing saved in favourites yet.'}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={gridKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-2"
          >
            {filteredContent.map((item, index) => {
              const isAdPosition = (index + 1) % 6 === 0;

              if (isAdPosition || item.sponsored) {
                return <AdCard key={`ad-${item.id}`} item={item} />;
              }

              return (
                <ContentCard
                  key={item.id}
                  item={item}
                  index={index}
                  onSelectMedia={setSelectedMedia}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}

      {/* End-Of-Feed Infinite Scroll Loader */}
      {!isSearching && filteredContent.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-xs font-semibold text-gray-400 border-t border-white/5 mt-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Loading more</span>
          </div>
        </div>
      )}

      {/* Join Channel Required Modal */}
      <JoinChannelModal
        isOpen={Boolean(selectedMedia)}
        onClose={() => setSelectedMedia(null)}
        item={selectedMedia}
      />
    </div>
  );
};