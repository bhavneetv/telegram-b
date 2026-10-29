import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Share2,
  Copy,
  Check,
  Heart,
  Crown,
  Bug,
  FileText,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Clock,
  Infinity
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { ModalShell } from '../components/ModalShell';
import { JoinChannelModal } from '../components/JoinChannelModal';
import { MovingInfinityIcon } from '../components/MovingInfinityIcon';
import { DUMMY_CONTENT } from '../data/dummyContent';
import { triggerHaptic } from '../utils/telegram';
import { toast } from 'sonner';

export const Profile = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    isPremium,
    currentPlan,
    referralTimeLeft,
    favourites,
    deleteFavourite,
    clearAllFavourites,
    setIsFavouritesOnlyFilter
  } = useAppState();

  const [copied, setCopied] = useState(false);
  const [showFavModal, setShowFavModal] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [bugText, setBugText] = useState('');
  const [isSubmittingBug, setIsSubmittingBug] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleCopyLink = () => {
    triggerHaptic('medium');
    navigator.clipboard.writeText(userProfile.referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = () => {
    triggerHaptic('light');
    if (navigator.share) {
      navigator.share({
        title: 'Join Terabox MINI',
        text: 'Get 100/100 free media credits!',
        url: userProfile.referralLink
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleArrowFavClick = () => {
    triggerHaptic('medium');
    setIsFavouritesOnlyFilter(true);
    navigate('/');
  };

  const handleSubmitBug = (e) => {
    e.preventDefault();
    if (!bugText.trim()) return;
    triggerHaptic('medium');
    setIsSubmittingBug(true);

    setTimeout(() => {
      setIsSubmittingBug(false);
      setShowBugModal(false);
      setBugText('');
      toast.success('Bug report submitted. Thank you!');
    }, 1000);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isReferralPlan = currentPlan === "Lite (Free 1hr)";

  return (
    <div className="flex flex-col gap-4 pb-28 px-4 max-w-xl mx-auto pt-[53px] text-white">
      {/* 1. TOP HEADER PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center bg-[#0A0D15]/95 shadow-2xl relative overflow-hidden"
      >
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-2xl font-black text-slate-950 ring-4 ring-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.35)] uppercase">
            {userProfile.username.substring(0, 2)}
          </div>
          {isPremium && (
            <div className="absolute top-0 right-0 p-1.5 rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/50">
              <Crown className="w-4 h-4 fill-black" />
            </div>
          )}
        </div>

        <h1 className="text-xl font-black text-white tracking-tight">
          @{userProfile.username}
        </h1>

        <div className="mt-2">
          {isPremium ? (
            <span className="px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Crown className="w-3.5 h-3.5 fill-amber-400" />
              Golden VIP Member
            </span>
          ) : (
            <span className="px-3.5 py-1 rounded-full bg-white/10 text-gray-300 border border-white/15 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
              Free Plan Member
            </span>
          )}
        </div>
      </motion.div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-3 gap-3">
        {/* Card 1: REFERRALS */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-panel p-3.5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center bg-[#0A0D15]/90 shadow-md"
        >
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            REFERRALS
          </span>
          <span className="text-lg font-black text-amber-400">
            {userProfile.referrals}
          </span>
          <span className="text-[9px] font-medium text-gray-400 mt-0.5">
            Moderate / Active
          </span>
        </motion.div>

        {/* Card 2: PLAN */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => {
            triggerHaptic('light');
            navigate('/premium');
          }}
          className={`glass-panel p-3.5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-md ${
            isPremium
              ? 'border border-amber-500/60 bg-amber-950/30'
              : 'border border-white/10 bg-[#0A0D15]/90 hover:border-amber-500/40'
          }`}
        >
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            PLAN
          </span>
          <span className={`text-sm font-black ${isPremium ? 'text-amber-400' : 'text-gray-200'}`}>
            {currentPlan}
          </span>
        </motion.div>

        {/* Card 3: CREDITS */}
        <motion.div
          whileHover={{ y: -2 }}
          className={`glass-panel p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center shadow-md transition-all ${
            !isReferralPlan && !isPremium && userProfile.credits <= 20
              ? 'bg-[#180a0f]/90 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
              : 'border-white/10 bg-[#0A0D15]/90'
          }`}
        >
          <span
            className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
              !isReferralPlan && !isPremium && userProfile.credits <= 20 ? 'text-rose-400' : 'text-gray-400'
            }`}
          >
            CREDITS
          </span>
          {isReferralPlan ? (
            <>
              <span className="text-sm font-mono font-black text-emerald-400">
                {formatTimer(referralTimeLeft)}
              </span>
              <span className="text-[9px] font-medium text-gray-400 mt-0.5">1-Hr Free</span>
            </>
          ) : isPremium ? (
            <>
              <MovingInfinityIcon theme="amber" className="w-6 h-3.5 my-1" />
              <span className="text-[9px] font-medium text-gray-400 mt-0.5">Unlimited</span>
            </>
          ) : (
            <>
              <span
                className={`text-sm font-black ${
                  userProfile.credits <= 20
                    ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                    : userProfile.credits > 50
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {userProfile.credits}/100
              </span>
              <span
                className={`text-[9px] font-semibold mt-0.5 ${
                  userProfile.credits <= 20 ? 'text-rose-300 font-bold' : 'text-gray-400'
                }`}
              >
                {userProfile.credits <= 20 ? 'Low Balance' : 'Available'}
              </span>
            </>
          )}
        </motion.div>
      </div>

      {/* 3. YOUR REFERRAL LINK BOX */}
      <div className="glass-panel p-4 rounded-3xl border border-white/10 flex flex-col gap-3 bg-[#0A0D15]/90 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-white">Your Referral Link</span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            10 Credits / Ref
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={userProfile.referralLink}
            className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs font-mono text-gray-300 focus:outline-none"
          />

          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 active:scale-95 text-black font-black text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/30 cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleShareLink}
            className="p-2.5 rounded-2xl glass-panel text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all active:scale-90 cursor-pointer shrink-0"
            title="Share Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. SAVED FAVOURITES ROW (Arrow opens Explorer page with Favourites filter active) */}
      <div className="glass-panel p-3.5 rounded-3xl border border-white/10 bg-[#0A0D15]/90 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/30">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white">Saved Favourites</h3>
            <p className="text-[10px] text-gray-400">{favourites.length} items saved in library</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              setShowFavModal(true);
            }}
            className="px-4 py-1.5 rounded-2xl bg-white/10 text-gray-200 hover:text-white hover:bg-white/15 border border-white/10 text-xs font-bold transition-all cursor-pointer"
          >
            Manage
          </button>

          <button
            onClick={handleArrowFavClick}
            className="p-2 rounded-full bg-white/10 text-gray-300 border border-white/10 hover:text-white hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center"
            title="View Favourites in Explorer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. REPORT BUG & TERMS GRID */}
      <div className="grid grid-cols-2 gap-3">
        {/* Report Bug */}
        <button
          onClick={() => {
            triggerHaptic('light');
            setShowBugModal(true);
          }}
          className="glass-panel p-3.5 rounded-3xl border border-white/10 bg-[#0A0D15]/90 hover:bg-white/5 transition-all flex items-center gap-3 text-left cursor-pointer shadow-md"
        >
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Bug className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white">Report Bug</h4>
            <p className="text-[10px] text-gray-400">Send feedback</p>
          </div>
        </button>

        {/* Terms & Legal */}
        <button
          onClick={() => {
            triggerHaptic('light');
            setShowTermsModal(true);
          }}
          className="glass-panel p-3.5 rounded-3xl border border-white/10 bg-[#0A0D15]/90 hover:bg-white/5 transition-all flex items-center gap-3 text-left cursor-pointer shadow-md"
        >
          <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white">Terms & Legal</h4>
            <p className="text-[10px] text-gray-400">Privacy policy</p>
          </div>
        </button>
      </div>

      {/* 6. GO PREMIUM BANNER (Only shown for non-premium free users) */}
      {!isPremium && (
        <div className="glass-panel p-4 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-transparent flex items-center justify-between shadow-2xl shadow-amber-500/15">
          <div className="flex flex-col gap-1 pr-2">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-400 uppercase tracking-wider">
              <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>GO PREMIUM</span>
            </div>

            <h2 className="text-xs sm:text-sm font-black text-white leading-snug">
              Unlock 10× Fast Downloads & No Limits
            </h2>

            <p className="text-[10px] text-gray-400 font-medium">
              Starting at ₹10
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerHaptic('medium');
              navigate('/premium');
            }}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/40 cursor-pointer shrink-0"
          >
            Upgrade
          </motion.button>
        </div>
      )}

      {/* MODAL 1: Manage Favourites (THUMBNAIL-ONLY GRID DESIGN) */}
      <ModalShell
        isOpen={showFavModal}
        onClose={() => setShowFavModal(false)}
        title="Saved Favourites"
      >
        {favourites.length === 0 ? (
          <div className="text-center py-8 flex flex-col items-center gap-2">
            <Heart className="w-8 h-8 text-gray-600" />
            <p className="text-xs text-gray-400">No saved favourites yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs text-gray-400 font-medium">
                {favourites.length} {favourites.length === 1 ? 'item' : 'items'} saved
              </span>
              <button
                onClick={clearAllFavourites}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>

            {/* Pure Thumbnail Grid (Visual-first layout, no captions or text) */}
            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto no-scrollbar pr-0.5">
              {favourites.map((favId) => {
                const item = DUMMY_CONTENT.find((c) => c.id === favId);
                if (!item) return null;
                return (
                  <motion.div
                    key={favId}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      triggerHaptic('light');
                      setShowFavModal(false);
                      setSelectedMedia(item);
                    }}
                    className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-amber-400/60 transition-all duration-300 group shadow-lg bg-slate-900"
                  >
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

                    {/* Centered Play Overlay Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl shadow-black/60">
                        <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Delete Floating Trash Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic('light');
                        deleteFavourite(favId, item.title);
                      }}
                      title="Remove favourite"
                      className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/70 backdrop-blur-md text-gray-300 hover:text-rose-400 hover:bg-rose-500/25 border border-white/10 transition-all cursor-pointer z-10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </ModalShell>

      {/* MODAL 2: Report Bug Form */}
      <ModalShell
        isOpen={showBugModal}
        onClose={() => setShowBugModal(false)}
        title="Report a Bug / Issue"
      >
        <form onSubmit={handleSubmitBug} className="flex flex-col gap-3">
          <textarea
            rows={4}
            value={bugText}
            onChange={(e) => setBugText(e.target.value)}
            placeholder="Describe the issue you experienced..."
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
          />

          <button
            type="submit"
            disabled={isSubmittingBug || !bugText.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black text-xs hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            {isSubmittingBug ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </ModalShell>

      {/* MODAL 3: Terms of Service */}
      <ModalShell
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms of Service & Privacy"
      >
        <div className="flex flex-col gap-3 text-xs text-gray-300 leading-relaxed max-h-60 overflow-y-auto no-scrollbar pr-1">
          <p>
            By using <strong>Terabox MINI</strong>, you agree to comply with our community terms. Media files hosted via Terabox links are subject to third-party availability.
          </p>
          <p>
            Referral credits and free access passes are non-transferable.
          </p>
        </div>
      </ModalShell>

      {/* Join Channel Required Modal for Favourite Selection */}
      <JoinChannelModal
        isOpen={Boolean(selectedMedia)}
        onClose={() => setSelectedMedia(null)}
        item={selectedMedia}
      />
    </div>
  );
};
