import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Heart, Crown, Sparkles, FilterX, Loader2, ArrowDown, Film, Zap, Infinity, AlertTriangle } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { ContentCard } from '../components/ContentCard';
import { AdCard } from '../components/AdCard';
import { JoinChannelModal } from '../components/JoinChannelModal';
import { DUMMY_CONTENT } from '../data/dummyContent';
import { useAppState } from '../context/AppStateContext';
import { triggerHaptic } from '../utils/telegram';
import { toast } from 'sonner';

export const Explorer = () => {
  const {
    favourites,
    isPremium,
    currentPlan,
    referralTimeLeft,
    searchQuery,
    setSearchQuery,
    isFavouritesOnlyFilter,
    setIsFavouritesOnlyFilter,
    userProfile
  } = useAppState();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [contentList, setContentList] = useState(DUMMY_CONTENT);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Typewriter Headline Above Search Bar (Modern High-Impact Phrases)
  const headlinePhrases = [
    { prefix: '⚡ Stream & Play ', highlight: 'Ultra HD 4K Cloud Media' },
    { prefix: '🚀 Blazing Fast ', highlight: 'Direct High-Speed Downloads' },
    { prefix: '🔒 Private & Secure ', highlight: 'Telegram Cloud Vault' },
    { prefix: '✨ VIP Experience ', highlight: 'Zero Buffer & Instant Access' }
  ];
  const [prefixText, setPrefixText] = useState('');
  const [highlightText, setHighlightText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeletingHeadline, setIsDeletingHeadline] = useState(false);

  useEffect(() => {
    const current = headlinePhrases[phraseIdx];
    const fullText = current.prefix + current.highlight;
    const speed = isDeletingHeadline ? 30 : 60;

    const timer = setTimeout(() => {
      if (!isDeletingHeadline) {
        const nextLen = prefixText.length + highlightText.length + 1;
        if (nextLen <= current.prefix.length) {
          setPrefixText(current.prefix.substring(0, nextLen));
        } else {
          setPrefixText(current.prefix);
          setHighlightText(current.highlight.substring(0, nextLen - current.prefix.length));
        }

        if (nextLen >= fullText.length) {
          setTimeout(() => setIsDeletingHeadline(true), 2000);
        }
      } else {
        const totalLen = prefixText.length + highlightText.length - 1;
        if (totalLen < 0) {
          setIsDeletingHeadline(false);
          setPrefixText('');
          setHighlightText('');
          setPhraseIdx((prev) => (prev + 1) % headlinePhrases.length);
        } else if (totalLen >= current.prefix.length) {
          setHighlightText(current.highlight.substring(0, totalLen - current.prefix.length));
        } else {
          setHighlightText('');
          setPrefixText(current.prefix.substring(0, totalLen));
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [prefixText, highlightText, isDeletingHeadline, phraseIdx]);

  // Pull-To-Refresh State
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
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 70) {
      handleRefresh();
    }
    setPullDistance(0);
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

  const handleSearchExecute = (query) => {
    setSearchQuery(query);
    if (query) {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
      }, 1000);
    }
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
      className="flex flex-col gap-3.5 pb-24 px-4 max-w-6xl mx-auto pt-[53px] relative"
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

      {/* Centered Title ("Terabox" Title + Tilted Crown Positioned ABOVE "MINI" Badge) */}
      <div className="flex items-center justify-center relative py-1 text-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-white">
            Terabox
          </span>

          <div className="relative flex flex-col items-center">
            {/* Tilted Crown ABOVE "MINI" text if Premium */}
            {isPremium && (
              <Crown className="w-4 h-4 fill-amber-400 text-amber-400 -rotate-12 absolute -top-3.5 shadow-amber-500/50 drop-shadow-md animate-bounce" />
            )}
            <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase tracking-widest shadow-sm mt-0.5">
              MINI
            </span>
          </div>
        </div>
      </div>

      {/* Futuristic Cyber Typewriter Marquee Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-[#0c1424]/95 via-[#0e1933]/90 to-[#0c1424]/95 p-3 shadow-xl shadow-cyan-950/40 backdrop-blur-xl">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        {/* Top Header Row of Ticker */}
        <div className="flex items-center justify-between pb-1.5 border-b border-white/5 text-[9px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-cyan-300 font-bold">Cloud Stream Radar</span>
          </div>

          <div className="flex items-center gap-1 text-[8px] font-extrabold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>4K HDR Ready</span>
          </div>
        </div>

        {/* Dynamic Typewriter Text Area */}
        <div className="flex items-center pt-2 min-h-[34px] sm:min-h-[38px] overflow-hidden">
          <div className="flex items-center flex-wrap gap-x-1.5 leading-snug">
            <span className="text-white font-extrabold text-xs sm:text-sm tracking-tight drop-shadow-sm">
              {prefixText}
            </span>
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-black text-xs sm:text-sm tracking-tight drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
              {highlightText}
            </span>
            {/* Blinking Cyber Cursor */}
            <span className="inline-block w-1 h-4 sm:h-4.5 rounded-full bg-gradient-to-b from-cyan-400 to-amber-400 shadow-[0_0_8px_rgba(34,211,238,0.9)] ml-0.5 align-middle animate-pulse" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearchExecute}
        isSearching={isSearching}
      />

      {/* Separated Media Count & Credits Row - Distinct Cards */}
      <div className="flex items-center justify-between gap-2.5 pt-1.5">
        {/* Total Media Pill */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0F172A]/90 border border-white/10 text-xs font-semibold text-gray-300 shadow-md backdrop-blur-md">
          <Film className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            Total Media: <strong className="text-white font-bold">{filteredContent.length}</strong> items
          </span>
        </div>

        {/* Dynamic Credits Pill */}
        {isReferralPlan ? (
          <div className={`relative px-3.5 py-2 rounded-2xl text-xs font-black transition-all ${timerStyle.border} ${timerStyle.bg} ${timerStyle.text} flex items-center gap-1.5 shadow-md backdrop-blur-md`}>
            <Infinity className="w-4 h-4 stroke-[2.5]" />
            <span>Credits</span>
          </div>
        ) : isPremium ? (
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/40 text-xs font-black shadow-md backdrop-blur-md">
            <Infinity className="w-4 h-4 stroke-[2.5]" />
            <span>Unlimited Credits</span>
          </div>
        ) : (
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black shadow-md backdrop-blur-md transition-all ${
              (userProfile?.credits ?? 0) <= 20
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            {(userProfile?.credits ?? 0) <= 20 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Zap className="w-3.5 h-3.5 fill-cyan-400" />
            )}
            <span>{(userProfile?.credits ?? 0)}/100 Credits</span>
          </div>
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