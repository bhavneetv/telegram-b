import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, Eye, HardDrive } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { formatViews, formatFileSize } from '../utils/formatters';
import { triggerHaptic } from '../utils/telegram';

export const ContentCard = ({ item, onSelectMedia }) => {
  const { favourites, toggleFavourite } = useAppState();
  const isFavourited = favourites.includes(item.id);

  const handleFavouriteClick = (e) => {
    e.stopPropagation();
    triggerHaptic('medium');
    toggleFavourite(item.id);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    triggerHaptic('light');
    if (navigator.share) {
      navigator
        .share({
          title: item.title,
          url: item.url
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(item.url);
    }
  };

  const handleCardClick = () => {
    triggerHaptic('light');
    if (onSelectMedia) {
      onSelectMedia(item);
    } else {
      window.open(item.url, '_blank');
    }
  };

  // Thumbnail Aspect Ratio: Portrait (2:3) vs Landscape (4:3)
  const isPortrait = item.orientation === 'portrait';
  const aspectClass = isPortrait ? 'aspect-[2/3]' : 'aspect-[4/3]';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className="group relative flex flex-col glass-panel rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-cyan-500/50 transition-all duration-300 shadow-2xl bg-[#0F172A]/90"
    >
      {/* Thumbnail Container (Category labels, type badges & duration tags removed) */}
      <div className={`relative ${aspectClass} w-full overflow-hidden bg-slate-900`}>
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-black/20 to-transparent opacity-90" />
      </div>

      {/* Content Info */}
      <div className="flex flex-col justify-between flex-1 p-3.5 gap-2">
        {/* Crisp White Title Text */}
        <h3 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-cyan-300 leading-snug line-clamp-2 transition-colors">
          {item.title}
        </h3>

        {/* Metadata Row: Views & File Size */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] sm:text-[11px] font-medium text-gray-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              {formatViews(item.views)} views
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1 text-gray-300 font-semibold">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              {formatFileSize(item.sizeMB)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 1.35 }}
              onClick={handleFavouriteClick}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isFavourited
                  ? 'bg-rose-500/20 text-rose-500'
                  : 'hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${isFavourited ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </motion.button>

            <button
              onClick={handleShareClick}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
