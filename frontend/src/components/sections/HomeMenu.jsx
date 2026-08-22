import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsapConfig';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const spotlightItems = [
  {
    id: '01',
    name: 'Smoked Obsidian Espresso',
    category: 'Reserve Espresso',
    price: '$9.50',
    notes: 'Dark Chocolate • Smoked Oak • Berry Nectar',
    origin: 'Ethiopia Yirgacheffe G1',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '02',
    name: 'Velvet Gold Pour Over',
    category: 'Handcrafted Drip',
    price: '$14.00',
    notes: 'Jasmine • Bergamot • Honeycomb Essence',
    origin: 'Panama Geisha Valley',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '03',
    name: 'Amber Honey Tart',
    category: 'Patisserie',
    price: '$16.00',
    notes: 'Roasted Caramel • Cocoa Nibs • 24k Gold Flakes',
    origin: 'Valrhona Cocoa Blend',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '04',
    name: 'Truffle Cloud Cappuccino',
    category: 'Signature Craft',
    price: '$12.50',
    notes: 'Black Truffle Dust • Steamed Oat • Madagascar Vanilla',
    origin: 'Sumatra Mandheling Micro-lot',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop',
  },
];

const HomeMenu = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const previewImageRef = useRef(null);

  const activeItem = spotlightItems[activeIndex];

  // Cross-dissolve image morph animation on index change
  const handleItemHover = (index) => {
    if (index === activeIndex) return;

    gsap.fromTo(
      previewImageRef.current,
      { opacity: 0.3, scale: 1.08 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
    );
    setActiveIndex(index);
  };

  return (
    <section
      ref={containerRef}
      id="menu-preview"
      className="relative min-h-screen bg-caveno-dark py-36 px-6 md:px-24 border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-caveno-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-caveno-gold font-light block">
              Curated Taste Selection
            </span>
            <h2 className="font-cinzel text-4xl sm:text-6xl text-caveno-cream">
              Signature Spotlight
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-caveno-gold border-b border-caveno-gold/40 pb-1 hover:border-caveno-gold hover:text-caveno-amber transition duration-300 group"
          >
            Explore Master Menu
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Interactive Spotlight Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Hover List Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {spotlightItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => handleItemHover(index)}
                  data-cursor="TASTE"
                  className={`p-6 sm:p-8 rounded-xl transition-all duration-500 cursor-pointer border ${
                    isActive
                      ? 'glass-card border-caveno-gold/50 shadow-2xl scale-[1.02]'
                      : 'border-transparent hover:border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-caveno-gold tracking-widest">
                          {item.id}
                        </span>
                        <span className="font-mono text-[10px] text-caveno-muted uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-cinzel text-2xl sm:text-3xl text-caveno-cream font-medium">
                        {item.name}
                      </h3>
                    </div>

                    <span className="font-cinzel text-2xl text-caveno-gold font-semibold shrink-0">
                      {item.price}
                    </span>
                  </div>

                  {/* Flavor Notes Accordion Expand */}
                  {isActive && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-sans text-caveno-muted">
                      <Sparkles size={14} className="text-caveno-gold shrink-0" />
                      <span>{item.notes}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Sticky Dynamic Preview Frame */}
          <div className="lg:col-span-5 sticky top-36">
            <div
              data-cursor="DISCOVER"
              className="relative h-[480px] sm:h-[540px] rounded-2xl overflow-hidden glass-card p-4 border border-caveno-gold/30 shadow-2xl group"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <img
                  ref={previewImageRef}
                  src={activeItem.image}
                  alt={activeItem.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-caveno-black via-caveno-black/30 to-transparent" />

                {/* Overlaid Card Info */}
                <div className="absolute bottom-6 left-6 right-6 p-6 glass-card rounded-xl space-y-2 border border-white/10">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-caveno-gold">
                    Origin: {activeItem.origin}
                  </span>
                  <h4 className="font-cinzel text-lg text-caveno-cream">
                    {activeItem.name}
                  </h4>
                  <p className="font-sans text-xs text-caveno-muted font-light">
                    {activeItem.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeMenu;
