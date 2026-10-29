import React from 'react';
import { motion } from 'framer-motion';

const INFINITY_PATH =
  'M 17 9 C 19.8 12.8 22.5 14.5 25.5 14.5 C 29 14.5 31.5 12 31.5 9 C 31.5 6 29 3.5 25.5 3.5 C 22.5 3.5 19.8 5.2 17 9 C 14.2 12.8 11.5 14.5 8.5 14.5 C 5 14.5 2.5 12 2.5 9 C 2.5 6 5 3.5 8.5 3.5 C 11.5 3.5 14.2 5.2 17 9 Z';

export const MovingInfinityIcon = ({
  className = 'w-6 h-3.5',
  theme = 'blue' // 'blue' | 'amber' | 'emerald'
}) => {
  const gradientId = `infFlowGrad-${theme}`;
  const glowFilterId = `infGlow-${theme}`;

  // Theme palettes
  const palettes = {
    blue: {
      stop1: '#38bdf8', // sky-400
      stop2: '#3b82f6', // blue-500
      stop3: '#818cf8', // indigo-400
      trackStroke: 'rgba(59, 130, 246, 0.28)',
      particleFill: '#ffffff',
      glowShadow: 'drop-shadow(0 0 5px rgba(56, 189, 248, 0.95))',
      glowColor: 'rgba(59, 130, 246, 0.8)'
    },
    amber: {
      stop1: '#fde047', // yellow-300
      stop2: '#f59e0b', // amber-500
      stop3: '#ea580c', // orange-600
      trackStroke: 'rgba(245, 158, 11, 0.3)',
      particleFill: '#ffffff',
      glowShadow: 'drop-shadow(0 0 5px rgba(253, 224, 71, 0.95))',
      glowColor: 'rgba(245, 158, 11, 0.8)'
    },
    emerald: {
      stop1: '#6ee7b7', // emerald-300
      stop2: '#10b981', // emerald-500
      stop3: '#06b6d4', // cyan-500
      trackStroke: 'rgba(16, 185, 129, 0.28)',
      particleFill: '#ffffff',
      glowShadow: 'drop-shadow(0 0 5px rgba(110, 231, 183, 0.95))',
      glowColor: 'rgba(16, 185, 129, 0.8)'
    }
  };

  const currentTheme = palettes[theme] || palettes.blue;

  return (
    <motion.div
      animate={{
        // Smooth Lemniscate / figure-8 physical sway trajectory
        x: [0, 2, 0, -2, 0],
        y: [0, -1, 0, 1, 0],
        rotate: [-3, 3, -3, 3, -3]
      }}
      transition={{
        duration: 3.2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ filter: currentTheme.glowShadow }}
    >
      <svg
        viewBox="0 0 34 18"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentTheme.stop1} />
            <stop offset="50%" stopColor={currentTheme.stop2} />
            <stop offset="100%" stopColor={currentTheme.stop3} />
          </linearGradient>

          <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Underlying Base Dim Track */}
        <path
          d={INFINITY_PATH}
          stroke={currentTheme.trackStroke}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. Flowing Animated Gradient Beam along the infinity loop */}
        <motion.path
          d={INFINITY_PATH}
          stroke={`url(#${gradientId})`}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="30 58"
          animate={{
            strokeDashoffset: [0, -88]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{ filter: `drop-shadow(0 0 5px ${currentTheme.glowColor})` }}
        />
      </svg>
    </motion.div>
  );
};

export default MovingInfinityIcon;
