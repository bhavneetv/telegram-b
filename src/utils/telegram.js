/**
 * Safe Telegram WebApp API Bridge with Browser Fallback
 */
export const getTelegramWebApp = () => {
  return window.Telegram?.WebApp || null;
};

export const initTelegramApp = () => {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
      tg.setHeaderColor?.('#0B0F19');
      tg.setBackgroundColor?.('#0B0F19');
    } catch (e) {
      console.warn("Telegram WebApp init error", e);
    }
  }
};

export const triggerHaptic = (type = 'light') => {
  const tg = getTelegramWebApp();
  if (tg?.HapticFeedback) {
    try {
      tg.HapticFeedback.impactOccurred(type);
    } catch (e) {
      // ignore
    }
  }
};
