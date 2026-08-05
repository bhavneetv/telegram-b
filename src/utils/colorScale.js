/**
 * Generic 3-Tier Numeric Color Scale Engine
 * Returns status level, CSS color token, border color, and label
 */
export const getColorScale = (val) => {
  const num = typeof val === 'number' ? val : 0;
  if (num < 40) {
    return {
      tier: 'low',
      textColor: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      hex: '#EF4444',
      label: 'Low / Basic'
    };
  } else if (num < 80) {
    return {
      tier: 'medium',
      textColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      hex: '#F59E0B',
      label: 'Moderate / Active'
    };
  } else {
    return {
      tier: 'high',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      hex: '#10B981',
      label: 'High / Elite'
    };
  }
};

/**
 * Generates a deterministic gradient avatar background from a username string
 */
export const getAvatarGradient = (username = '') => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradients = [
    'from-blue-600 to-indigo-800',
    'from-purple-600 to-pink-800',
    'from-amber-500 to-orange-700',
    'from-emerald-600 to-teal-800',
    'from-rose-600 to-red-800',
    'from-cyan-600 to-blue-800'
  ];
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};
