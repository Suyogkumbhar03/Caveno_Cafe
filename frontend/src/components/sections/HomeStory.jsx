import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsapConfig';
import { MapPin, Globe } from 'lucide-react';

const HomeStory = () => {
  const containerRef = useRef(null);
  const bgTextRef = useRef(null);
  const imageRef = useRef(null);
  const cardRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    // Horizontal Parallax movement on giant background text "RITUAL"
    gsap.fromTo(
      bgTextRef.current,
      { xPercent: 15 },
      {
        xPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );

    // Image & Glass Badge Entrance
    gsap.fromTo(
      imageRef.current,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        },
      }
    );

    gsap.fromTo(
      cardRef.current,
      { y: 80, rotate: -6, opacity: 0 },
      {
        y: 0,
        rotate: -3,
        opacity: 1,
        duration: 1.4,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
        },
      }
    );

    // Staggered paragraph reveal
    gsap.fromTo(
      textRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 75%',
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="story"
      className="relative min-h-screen bg-caveno-black py-36 px-6 md:px-24 flex items-center overflow-hidden border-t border-white/[0.06]"
    >
      {/* Ambient Background Radial Glow */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[500px] h-[500px] bg-caveno-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Outlined Background Parallax Typography */}
      <div
        ref={bgTextRef}
        className="absolute top-1/2 -translate-y-1/2 left-0 font-cinzel text-[18vw] font-bold text-transparent select-none pointer-events-none whitespace-nowrap z-0 opacity-15"
        style={{
          WebkitTextStroke: '1.5px rgba(212, 175, 55, 0.4)',
        }}
      >
        R I T U A L
      </div>

      {/* Asymmetrical Magazine Layout Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Stacked Media & Tilted Polaroid Card */}
        <div className="lg:col-span-6 relative">
          <div
            ref={imageRef}
            data-cursor="ORIGIN"
            className="relative h-[480px] sm:h-[580px] rounded-2xl overflow-hidden glass-card shadow-2xl group border border-white/10"
          >
            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop"
              alt="Café Interior"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-caveno-black via-transparent to-transparent opacity-80" />
          </div>

          {/* Tilted Glass Polaroid Badge Overlap */}
          <div
            ref={cardRef}
            className="absolute -bottom-8 -right-4 sm:right-6 glass-card p-5 sm:p-6 rounded-xl max-w-xs shadow-2xl border border-caveno-gold/30 z-20 space-y-3"
          >
            <div className="flex items-center gap-2 text-caveno-gold">
              <Globe size={16} className="animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest font-semibold">
                Single Origin Micro-Lot
              </span>
            </div>
            <p className="font-cinzel text-sm text-caveno-cream font-medium leading-snug">
              09°01'N 38°44'E • ETHIOPIA YIRGACHEFFE
            </p>
            <div className="pt-1 flex justify-between items-center border-t border-white/10 text-[10px] font-mono text-caveno-muted">
              <span>Altitude: 2,200m</span>
              <span>Process: Washed</span>
            </div>
          </div>
        </div>

        {/* Right Editorial Typography Content */}
        <div ref={textRef} className="lg:col-span-6 space-y-8 pl-0 lg:pl-6">
          <div className="space-y-3">
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-caveno-gold font-light block">
              Editorial Volume I
            </span>
            <h2 className="font-cinzel text-4xl sm:text-5xl md:text-6xl text-caveno-cream leading-tight">
              More than coffee. <br />
              <span className="italic text-caveno-gold font-normal">It's a moment.</span>
            </h2>
          </div>

          <p className="font-sans text-sm md:text-base text-caveno-muted font-light leading-relaxed max-w-lg">
            CAVÉNO was conceived at the intersection of architectural minimalism and master roastery craft. We believe coffee is not merely a morning stimulant, but an immersive sensory narrative—an unhurried sanctuary carved from the noise of the metropolis.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div>
              <span className="font-cinzel text-2xl md:text-3xl text-caveno-gold font-bold block">
                100%
              </span>
              <span className="font-sans text-xs text-caveno-muted uppercase tracking-wider">
                Direct Trade Beans
              </span>
            </div>
            <div>
              <span className="font-cinzel text-2xl md:text-3xl text-caveno-gold font-bold block">
                24k
              </span>
              <span className="font-sans text-xs text-caveno-muted uppercase tracking-wider">
                Gold Flake Infusions
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeStory;
