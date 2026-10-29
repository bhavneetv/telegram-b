import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Compass, Crown } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';
import { useAppState } from '../context/AppStateContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isPremium } = useAppState();

  const [compact, setCompact] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Compact morph allowed on Explorer '/'
  const isCompactablePage = location.pathname === '/';

  useEffect(() => {
    if (!isCompactablePage) {
      setCompact(false);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (delta > 15 && currentScrollY > 120) {
        setCompact(true);
      } else if (delta < -8 || currentScrollY <= 30) {
        setCompact(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isCompactablePage]);

  // Completely hide Navbar on Video Player and Payment pages
  if (location.pathname.startsWith('/player/') || location.pathname.startsWith('/payment')) {
    return null;
  }

  // Tab order: Profile, Explore, Premium
  const navItems = [
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/', label: 'Explore', icon: Compass },
    { path: '/premium', label: 'Premium', icon: Crown, isSpecial: true },
  ];

  const handleTabClick = (path) => {
    triggerHaptic('light');
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] flex justify-center pb-[calc(var(--sab)+12px)] pt-2 pointer-events-none">
      <motion.nav
        layout
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 26,
          mass: 0.7
        }}
        className={`pointer-events-auto flex items-center justify-around gap-1.5 px-3 glass-panel rounded-full shadow-2xl transition-all duration-300 ${
          isPremium
            ? 'border-amber-500/60 shadow-amber-500/30 bg-[#0A0D15]/95 backdrop-blur-xl'
            : 'border-white/10 bg-[#0A0D15]/90 backdrop-blur-xl'
        } ${compact ? 'py-1.5 px-3' : 'py-2 px-4'}`}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleTabClick(item.path)}
              className={`relative flex items-center gap-2 rounded-full transition-all duration-300 cursor-pointer ${
                compact ? 'px-3 py-1.5' : 'px-4 py-2'
              } ${
                isActive
                  ? item.isSpecial
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold shadow-lg shadow-amber-500/30'
                    : 'bg-white/15 text-white border border-white/20 shadow-lg font-bold'
                  : item.isSpecial
                  ? 'text-amber-400 hover:text-amber-300 font-semibold'
                  : 'text-gray-400 hover:text-white font-medium'
              }`}
            >
              {/* Special Animated Glow Ring for Premium Tab */}
              {item.isSpecial && !isActive && (
                <span className="absolute inset-0 rounded-full bg-amber-500/10 animate-pulse pointer-events-none" />
              )}

              {/* Crisp Stroke Icon rendering (No solid black fills) */}
              <Icon
                className={`transition-transform duration-300 ${
                  compact ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'
                } ${
                  isActive
                    ? item.isSpecial
                      ? 'stroke-[2.5] text-black fill-none'
                      : 'stroke-[2.5] text-white fill-none'
                    : item.isSpecial
                    ? 'stroke-[2] text-amber-400 fill-none'
                    : 'stroke-[2] text-gray-400 fill-none'
                }`}
              />

              {/* Label */}
              <AnimatePresence initial={false}>
                {(!compact || isActive) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-xs whitespace-nowrap overflow-hidden ${
                      isActive ? 'font-bold' : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
};
