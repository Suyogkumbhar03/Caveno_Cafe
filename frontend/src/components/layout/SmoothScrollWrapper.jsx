import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from '../../lib/gsapConfig';

const SmoothScrollWrapper = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Instantiate Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis scroll to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Integrate Lenis with GSAP ticker loop
    const updateTick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTick);

    // Disable lag smoothing in ScrollTrigger
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateTick);
    };
  }, []);

  return (
    <div ref={containerRef} className="smooth-scroll-wrapper">
      {children}
    </div>
  );
};

export default SmoothScrollWrapper;
