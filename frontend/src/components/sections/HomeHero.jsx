import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsapConfig';
import { Sparkles, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroVideoAsset from '../../assets/hero-coffee.mp4';

const HomeHero = ({ introFinished = true }) => {
  const containerRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const videoRef = useRef(null);
  const titleWordsRef = useRef([]);
  const subtitleRef = useRef(null);
  const badgeRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useGSAP(
    () => {
      if (!introFinished) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Animate video container scale smoothly from 1.15 to 1.0
      tl.fromTo(
        videoWrapperRef.current,
        { scale: 1.15, filter: 'brightness(0.5) contrast(1.15)' },
        { scale: 1.0, filter: 'brightness(0.75) contrast(1.05)', duration: 1.8 }
      );

      // 2. Staggered heading split-line text reveal
      tl.fromTo(
        titleWordsRef.current,
        { y: 120, rotate: 5, opacity: 0 },
        {
          y: 0,
          rotate: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
        },
        '-=1.4'
      );

      // 3. Subtitle & Badge fade in with soft amber blur
      tl.fromTo(
        [subtitleRef.current, badgeRef.current],
        { opacity: 0, y: 25, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.1 },
        '-=0.7'
      );

      // 4. CTA Buttons & Scroll Indicator entrance
      tl.fromTo(
        [ctaRef.current, scrollIndicatorRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
        '-=0.4'
      );
    },
    { scope: containerRef, dependencies: [introFinished] }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-caveno-black pt-20"
    >
      {/* Background High-Fashion Hero Video Layer */}
      <div
        ref={videoWrapperRef}
        className="absolute inset-0 z-0 overflow-hidden transform origin-center"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=85"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src={heroVideoAsset} type="video/mp4" />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-barista-pouring-coffee-in-a-glass-41557-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dual Luxury Dark Gradient Overlays for High Contrast Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-caveno-black/90 via-caveno-black/50 to-caveno-black/80 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-caveno-black via-transparent to-caveno-black/60 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10 pointer-events-none" />
      </div>

      {/* Hero Content Layer */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-16 text-center space-y-8 my-auto">
        {/* Floating Ambient Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-caveno-gold/30 shadow-lg shadow-caveno-gold/10"
        >
          <Sparkles size={13} className="text-caveno-gold animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-caveno-gold font-light">
            EST. 2026 • FRESHLY ROASTED COFFEE
          </span>
        </div>

        {/* Main Editorial Split Heading */}
        <div className="space-y-2 overflow-hidden py-2">
          <h1 className="font-cinzel text-6xl sm:text-8xl md:text-9xl text-caveno-cream font-bold tracking-tight uppercase leading-none">
            <span
              ref={(el) => (titleWordsRef.current[0] = el)}
              className="inline-block transform drop-shadow-2xl"
            >
              C A V É N O
            </span>
          </h1>

          <p className="overflow-hidden pt-3">
            <span
              ref={(el) => (titleWordsRef.current[1] = el)}
              className="font-sans font-extralight tracking-[0.25em] text-caveno-cream text-lg sm:text-2xl md:text-3xl uppercase inline-block"
            >
              Where Every Cup Tells a Story
            </span>
          </p>
        </div>

        {/* Subtitle Description */}
        <p
          ref={subtitleRef}
          className="max-w-2xl mx-auto font-sans font-light text-caveno-cream/90 text-sm sm:text-base leading-relaxed drop-shadow"
        >
          Discover handcrafted coffees, freshly baked pastries, and a warm, relaxing atmosphere designed for your everyday moments.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            to="/menu"
            data-cursor="MENU"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-caveno-gold text-caveno-black font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-caveno-amber transition duration-300 shadow-xl shadow-caveno-gold/20"
          >
            Explore Menu
          </Link>

          <Link
            to="/reservation"
            data-cursor="RESERVE"
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-pill border border-white/30 text-caveno-cream font-sans text-xs uppercase tracking-[0.2em] font-medium hover:border-caveno-gold/60 transition duration-300"
          >
            Reserve a Table
          </Link>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-caveno-gold font-mono text-[10px] uppercase tracking-widest"
      >
        <span className="opacity-80">Scroll to Explore</span>
        <ArrowDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
};

export default HomeHero;
