import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Share2, Eye, HardDrive } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { formatViews, formatFileSize } from '../utils/formatters';
import { triggerHaptic } from '../utils/telegram';

export const ContentCard = ({ item, index = 0, onSelectMedia }) => {
  const { favourites, toggleFavourite } = useAppState();
  const isFavourited = favourites.includes(item.id);
  const cardRef = useRef(null);

  // Bullet scrolling animation:
  // When scrolling: container moves from center to left, and below one goes from right to center
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start']
  });

  const isEven = index % 2 === 0;

  // 3D Scrolling Wheel physics:
  // Cards curve along a 3D cylindrical wheel as they scroll into & out of the viewport
  const wheelRotateX = useTransform(scrollYProgress, [0, 0.45, 0.75, 1], [14, 0, -10, -18]);
  const wheelRotateZ = useTransform(
    scrollYProgress,
    [0, 0.45, 0.75, 1],
    isEven ? [-3.5, 0, 2.5, 4] : [3.5, 0, -2.5, -4]
  );
  const wheelScale = useTransform(scrollYProgress, [0, 0.45, 0.75, 1], [0.93, 1, 0.98, 0.92]);
  const wheelOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.75, 1, 1, 0.7]);

  const containerX = useTransform(
    scrollYProgress,
    [0, 0.45, 0.75, 1],
    isEven ? [15, 0, -18, -28] : [35, 18, 0, -12]
  );

  const titleX = useTransform(
    scrollYProgress,
    [0, 0.45, 0.75, 1],
    isEven ? [10, 0, -10, -16] : [20, 10, 0, -8]
  );

  const handleFavouriteClick = (e) => {
    e.stopPropagation();
    triggerHaptic('medium');
    toggleFavourite(item.id, item.title);
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
      ref={cardRef}
      style={{
        transformPerspective: 1200,
        rotateX: wheelRotateX,
        rotateZ: wheelRotateZ,
        scale: wheelScale,
        opacity: wheelOpacity,
        x: containerX
      }}
      whileHover={{ y: -4, scale: 1.02, rotateZ: 0, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className="group relative flex flex-col glass-panel rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-blue-500/40 transition-all duration-300 shadow-2xl bg-[#0A0D15]/90"
    >
      {/* Premium Thumbnail Container (Blur effect completely removed for ultra-sharp clarity) */}
      <div className={`relative ${aspectClass} w-full overflow-hidden bg-slate-900/80 rounded-t-3xl`}>
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Multi-layer Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D15] via-[#0A0D15]/30 to-transparent opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

        {/* Hover Glow Ring (fades in on hover) */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/40 rounded-t-3xl transition-all duration-500 pointer-events-none group-hover:shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]" />

        {/* Play Button Overlay (video items) */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl shadow-black/60">
              <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="flex flex-col justify-between flex-1 p-3.5 gap-2 overflow-hidden">
        {/* Bullet Title Scrolling Motion with Electric Blue Accent on Hover */}
        <motion.h3
          style={{ x: titleX }}
          className="text-xs sm:text-sm font-extrabold text-white group-hover:text-blue-300 leading-snug line-clamp-2 transition-colors"
        >
          {item.title}
        </motion.h3>

        {/* Metadata Row: Views & File Size */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] sm:text-[11px] font-medium text-gray-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {formatViews(item.views)} views
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1 text-blue-300/90 font-bold">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              {formatFileSize(item.sizeMB)}
            </span>
          </div>

          {/* Redesigned Like & Share Action Dock */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-xl border border-white/10 backdrop-blur-md">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleFavouriteClick}
              title={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
              className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
                isFavourited
                  ? 'bg-rose-500/25 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)] border border-rose-500/40'
                  : 'text-gray-400 hover:text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isFavourited ? 'fill-rose-500 text-rose-400 scale-110' : ''
                }`}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleShareClick}
              title="Share link"
              className="p-1.5 rounded-lg text-gray-300 hover:text-blue-400 hover:bg-blue-500/15 border border-transparent hover:border-blue-500/30 transition-all duration-200 cursor-pointer flex items-center justify-center"
            >
              <Share2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
