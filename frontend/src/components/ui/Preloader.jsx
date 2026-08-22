import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsapConfig';

const stageWords = ['SOURCING', 'ROASTING', 'EXTRACTING', 'EXPERIENCE'];

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);
  const stageWordRef = useRef(null);
  const flashLogoRef = useRef(null);
  const centerContentRef = useRef(null);

  const [count, setCount] = useState(0);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    // 1. Counter tween from 0 to 100
    const counterObj = { val: 0 };
    tl.to(counterObj, {
      val: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        const val = Math.floor(counterObj.val);
        setCount(val);
        // Swap stage words as progress advances
        const wordIndex = Math.min(
          stageWords.length - 1,
          Math.floor((val / 100) * stageWords.length)
        );
        if (stageWordRef.current) {
          stageWordRef.current.textContent = stageWords[wordIndex];
        }
      },
    });

    // 2. Animate progress bar width
    tl.to(progressBarRef.current, { width: '100%', duration: 1.5, ease: 'power2.inOut' }, 0);

    // 3. Fade out counter and stage content
    tl.to(centerContentRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: 'power2.in',
    });

    // 4. Flash CAVÉNO logo with expanding letter spacing
    tl.fromTo(
      flashLogoRef.current,
      { opacity: 0, scale: 0.8, letterSpacing: '0.2em' },
      {
        opacity: 1,
        scale: 1,
        letterSpacing: '0.8em',
        duration: 0.5,
        ease: 'power3.out',
      }
    );

    tl.to(flashLogoRef.current, {
      opacity: 0,
      scale: 1.15,
      letterSpacing: '1.2em',
      duration: 0.4,
      ease: 'power3.in',
    });

    // 5. Dual Shutters slide open horizontally
    tl.to(
      leftPanelRef.current,
      { xPercent: -100, duration: 1.2, ease: 'power4.inOut' },
      '-=0.1'
    );
    tl.to(
      rightPanelRef.current,
      { xPercent: 100, duration: 1.2, ease: 'power4.inOut' },
      '<'
    );

    // 6. Hide main preloader container
    tl.set(containerRef.current, { display: 'none' });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none select-none"
    >
      {/* Left Shutter Curtain */}
      <div
        ref={leftPanelRef}
        className="absolute top-0 left-0 w-1/2 h-full bg-caveno-black border-r border-caveno-gold/20 pointer-events-auto z-10"
      />

      {/* Right Shutter Curtain */}
      <div
        ref={rightPanelRef}
        className="absolute top-0 right-0 w-1/2 h-full bg-caveno-black border-l border-caveno-gold/20 pointer-events-auto z-10"
      />

      {/* Stage Center Stage Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 sm:p-16 text-caveno-cream pointer-events-auto">
        {/* Top Header Monogram */}
        <div className="flex justify-between items-center font-mono text-xs text-caveno-gold uppercase tracking-[0.3em]">
          <span>CAVÉNO / TASTING SALON</span>
          <span>EST. 2026</span>
        </div>

        {/* Center Stage Counter */}
        <div ref={centerContentRef} className="space-y-6 text-center my-auto max-w-md mx-auto w-full">
          <span
            ref={stageWordRef}
            className="font-mono text-xs text-caveno-gold uppercase tracking-[0.4em] block font-semibold"
          >
            SOURCING
          </span>

          <div
            ref={counterRef}
            className="font-cinzel text-7xl sm:text-9xl font-bold text-caveno-cream tracking-tight"
          >
            {count.toString().padStart(2, '0')}
          </div>

          {/* Thin Gold Progress Bar */}
          <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-caveno-gold w-0 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.9)]"
            />
          </div>
        </div>

        {/* Flashing Gold Logo overlay */}
        <div
          ref={flashLogoRef}
          className="absolute inset-0 flex items-center justify-center font-cinzel text-4xl sm:text-6xl text-caveno-gold font-bold pointer-events-none opacity-0"
        >
          CAVÉNO
        </div>

        {/* Bottom Subtitle */}
        <div className="flex justify-between items-center font-mono text-[10px] text-caveno-muted uppercase tracking-widest">
          <span>09°01'N 38°44'E • ETHIOPIA</span>
          <span>HIGH FASHION ROASTERY</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
