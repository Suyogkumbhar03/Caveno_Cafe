import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CustomCursor from '../ui/CustomCursor';
import Preloader from '../ui/Preloader';
import ToastNotification from '../ui/ToastNotification';
import SmoothScrollWrapper from './SmoothScrollWrapper';
import { CartProvider } from '../../context/CartContext';
import CartDrawer from '../ui/CartDrawer';
import useScrollReset from '../../hooks/useScrollReset';

const LayoutContent = () => {
  // Execute scroll reset on route change
  useScrollReset();
  const [toast, setToast] = useState(null);

  // Intro preloader state check via sessionStorage
  const [hasVisitedSession, setHasVisitedSession] = useState(() => {
    return !!sessionStorage.getItem('caveno_intro_played');
  });

  const [introFinished, setIntroFinished] = useState(() => {
    return !!sessionStorage.getItem('caveno_intro_played');
  });

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('caveno_intro_played', 'true');
    setHasVisitedSession(true);
    setIntroFinished(true);
  };

  return (
    <SmoothScrollWrapper>
      <div className="relative min-h-screen bg-caveno-black text-caveno-cream selection:bg-caveno-gold/30 selection:text-caveno-cream font-sans overflow-x-hidden">
        {/* Luxury Entrance Preloader - Only runs on first session visit */}
        {!hasVisitedSession && (
          <Preloader onComplete={handlePreloaderComplete} />
        )}

        {/* Custom Dynamic Spring Physics Cursor */}
        <CustomCursor />

        {/* Global Film Grain SVG Overlay */}
        <div className="fixed inset-0 pointer-events-none bg-noise z-[9990] opacity-60" />

        {/* Fixed Header Navbar */}
        <Header />

        {/* Slide-out Cart Drawer */}
        <CartDrawer />

        {/* Interactive Toast Alert */}
        <ToastNotification toast={toast} onClose={() => setToast(null)} />

        {/* Page Content Outlet */}
        <div className="relative z-10">
          <Outlet context={{ introFinished }} />
        </div>

        {/* Luxury Editorial Footer */}
        <Footer />
      </div>
    </SmoothScrollWrapper>
  );
};

const RootLayout = () => {
  return <LayoutContent />;
};

export default RootLayout;
