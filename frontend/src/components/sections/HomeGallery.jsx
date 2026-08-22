import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsapConfig';

const galleryItems = [
  {
    id: 1,
    title: 'The Dark Roast Studio',
    subtitle: 'Editorial Space',
    src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Pour Over Extraction',
    subtitle: 'Precision Brewing',
    src: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Artisanal Patisserie',
    subtitle: 'Baked Fresh Daily',
    src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Custom Copper Bar',
    subtitle: 'Atmospheric Craft',
    src: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Private Tasting Lounge',
    subtitle: 'Exclusive VIP Salon',
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
  },
];

const HomeGallery = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const imagesRef = useRef([]);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth - window.innerWidth;

    // Pin parent and translate container horizontally
    const scrollTween = gsap.to(track, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1.5,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        invalidateOnRefresh: true,
      },
    });

    // 3D Parallax: Translate inner images relative to outer card movement
    imagesRef.current.forEach((img) => {
      if (!img) return;
      gsap.fromTo(
        img,
        { xPercent: -15, scale: 1.15 },
        {
          xPercent: 15,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            scrub: 1.5,
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="gallery"
      className="relative h-screen bg-caveno-black overflow-hidden border-t border-white/[0.06]"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[700px] bg-caveno-gold/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Header */}
      <div className="absolute top-12 left-6 md:left-24 z-20 space-y-1 pointer-events-none">
        <span className="font-sans text-xs uppercase tracking-[0.35em] text-caveno-gold font-light">
          Sensory Impressions
        </span>
        <h2 className="font-cinzel text-3xl md:text-5xl text-caveno-cream">
          Atmospheric Gallery
        </h2>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={trackRef}
        className="h-full flex items-center gap-10 px-6 md:px-24 pt-24 w-max"
      >
        {galleryItems.map((item, index) => (
          <div
            key={item.id}
            data-cursor="VIEW"
            className="relative w-[75vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] h-[65vh] rounded-2xl overflow-hidden glass-card border border-white/10 group shadow-2xl shrink-0"
          >
            {/* Parallax Inner Image Container */}
            <div className="absolute inset-0 w-[130%] h-full -left-[15%] overflow-hidden">
              <img
                ref={(el) => (imagesRef.current[index] = el)}
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
            </div>

            {/* Dark Amber Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-caveno-black via-caveno-black/30 to-transparent p-8 flex flex-col justify-end z-10">
              <span className="font-mono text-xs text-caveno-gold uppercase tracking-widest">
                {item.subtitle}
              </span>
              <h3 className="font-cinzel text-2xl md:text-3xl text-caveno-cream font-medium">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeGallery;
