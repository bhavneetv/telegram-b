import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

export const AdCard = ({ item, isCompact = false }) => {
  const handleAdClick = () => {
    triggerHaptic('medium');
    window.open(item?.url || 'https://terabox.com', '_blank');
  };

  const isPortrait = item?.orientation === 'portrait';
  const aspectClass = isPortrait ? 'aspect-[2/3]' : 'aspect-[4/3]';

  if (isCompact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleAdClick}
        className="group relative flex items-center gap-3 p-2.5 bg-gradient-to-r from-amber-950/50 via-yellow-900/20 to-[#0F172A] rounded-2xl overflow-hidden cursor-pointer border border-amber-500/40 hover:border-amber-400 shadow-xl shadow-amber-500/10 transition-all"
      >
        {/* Small Thumbnail */}
        <div className="w-20 h-14 rounded-xl overflow-hidden bg-amber-950/50 shrink-0 relative">
          <img
            src={item?.thumbnail}
            alt={item?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-amber-500 text-black text-[8px] font-black uppercase">
            AD
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center flex-1 gap-0.5 overflow-hidden">
          <div className="flex items-center gap-1 text-[9px] font-extrabold text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-2.5 h-2.5 fill-amber-400" />
            <span>Sponsored Partner</span>
          </div>
          <h4 className="text-xs font-bold text-white line-clamp-1 leading-snug group-hover:text-amber-200">
            {item?.title}
          </h4>
        </div>

        <button className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-extrabold text-[11px] flex items-center gap-1 shrink-0 group-hover:bg-yellow-400 cursor-pointer">
          <span>Claim</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={handleAdClick}
      className="group relative flex flex-col bg-gradient-to-br from-amber-950/40 via-yellow-900/20 to-[#0F172A] rounded-3xl overflow-hidden cursor-pointer border border-amber-500/40 hover:border-amber-400 shadow-2xl shadow-amber-500/10 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className={`relative ${aspectClass} w-full overflow-hidden bg-amber-950/50`}>
        <img
          src={item?.thumbnail}
          alt={item?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-black/40 to-transparent" />

        {/* Ad Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-black font-extrabold text-[11px] uppercase tracking-wider shadow-lg shadow-amber-500/40">
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          SPONSORED
        </div>
      </div>

      {/* Ad Info */}
      <div className="flex flex-col justify-between flex-1 p-4 gap-3">
        <h3 className="text-sm font-extrabold text-white line-clamp-2 leading-snug">
          {item?.title}
        </h3>

        <div className="flex items-center justify-between pt-2 border-t border-amber-500/20">
          <span className="text-[11px] font-bold text-amber-400">Promoted Partner</span>
          <button className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-yellow-300">
            <span>Claim</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
