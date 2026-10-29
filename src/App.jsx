import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';

import { AppStateProvider, useAppState } from './context/AppStateContext';
import { initTelegramApp } from './utils/telegram';
import { Navbar } from './components/Navbar';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { CreditDeductionPopup } from './components/CreditDeductionPopup';
import { SplashScreen } from './components/SplashScreen';
import { SubscriptionSuccessModal } from './components/SubscriptionSuccessModal';

import { Explorer } from './pages/Explorer';
import { Profile } from './pages/Profile';
import { Premium } from './pages/Premium';
import { VideoPlayer } from './pages/VideoPlayer';
import { UpiPayment } from './pages/UpiPayment';

// Popup Container Inner Wrapper
const CreditPopupWrapper = () => {
  const { showCreditPopup, setShowCreditPopup } = useAppState();
  const location = useLocation();

  // If on player page, credit cut animation is shown directly inside the Mini Player header!
  if (location.pathname.startsWith('/player/')) {
    return null;
  }

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
        <Route path="/payment/upi" element={<UpiPayment />} />
      </Routes>
    </motion.div>
  );
};

// Resilient Error Boundary for graceful crash handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070A12] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-400 max-w-sm mb-6 font-mono text-xs">
            {this.state.error?.message || "An unexpected glitch occurred. Don't worry, your data and credits are safe."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    initTelegramApp();
  }, []);

  return (
    <ErrorBoundary>
      <AppStateProvider>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        <Toaster
          closeButton
          position="top-center"
          richColors
          theme="dark"
          toastOptions={{ style: { marginTop: '80px' } }}
        />
        {/* Main App Layout */}
        <BrowserRouter>
          <CreditPopupWrapper />
          <SubscriptionSuccessModal />
          <div className="min-h-screen bg-[#070A12] text-white flex flex-col relative selection:bg-cyan-500/30">
            <AnimatedRoutes />
            <ScrollToTopButton />
            <Navbar />
          </div>
        </BrowserRouter>
      </AppStateProvider>
    </ErrorBoundary>
  );
}

export default App;
