import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';

import { AppStateProvider, useAppState } from './context/AppStateContext';
import { initTelegramApp } from './utils/telegram';
import { Navbar } from './components/Navbar';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { CreditDeductionPopup } from './components/CreditDeductionPopup';

import { Explorer } from './pages/Explorer';
import { Profile } from './pages/Profile';
import { Premium } from './pages/Premium';
import { VideoPlayer } from './pages/VideoPlayer';

// Popup Container Inner Wrapper
const CreditPopupWrapper = () => {
  const { showCreditPopup, setShowCreditPopup } = useAppState();
  return (
    <CreditDeductionPopup
      isVisible={showCreditPopup}
      onClose={() => setShowCreditPopup(false)}
    />
  );
};

// Clean, reliable route animation container
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-full min-h-screen"
    >
      <Routes location={location}>
        <Route path="/" element={<Explorer />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/player/:id" element={<VideoPlayer />} />
      </Routes>
    </motion.div>
  );
};

export function App() {
  useEffect(() => {
    initTelegramApp();
  }, []);

  return (
    <AppStateProvider>
      <Toaster
        closeButton
        position="top-center"
        richColors
        theme="dark"
        toastOptions={{ style: { marginTop: '80px' } }}
      />
      <CreditPopupWrapper />

      {/* Main App Layout */}
      <BrowserRouter>
        <div className="min-h-screen bg-[#070A12] text-white flex flex-col relative selection:bg-cyan-500/30">
          <AnimatedRoutes />
          <ScrollToTopButton />
          <Navbar />
        </div>
      </BrowserRouter>
    </AppStateProvider>
  );
}

export default App;
