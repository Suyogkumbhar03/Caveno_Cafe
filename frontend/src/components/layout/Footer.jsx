import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-caveno-black text-caveno-cream border-t border-white/[0.08] pt-20 pb-12 px-6 md:px-24 overflow-hidden select-none">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-caveno-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="font-cinzel text-3xl tracking-[0.25em] text-caveno-cream font-bold block">
              CAVÉNO
            </Link>

            <p className="font-sans text-xs text-caveno-muted font-light leading-relaxed max-w-sm">
              An ultra-premium roastery & tasting room dedicated to shade-grown micro-lots and editorial luxury experiences.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-caveno-gold font-medium block">
              Navigation
            </span>
            <ul className="space-y-2.5 font-sans text-xs text-caveno-muted">
              <li>
                <Link to="/" className="hover:text-caveno-gold transition duration-300">
                  Home Experience
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-caveno-gold transition duration-300">
                  Craft Menu
                </Link>
              </li>
              <li>
                <a href="#story" className="hover:text-caveno-gold transition duration-300">
                  Our Ritual & Story
                </a>
              </li>
              <li>
                <Link to="/reservation" className="hover:text-caveno-gold transition duration-300">
                  Private Reservation
                </Link>
              </li>
            </ul>
          </div>

          {/* Salon Coordinates Column */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-caveno-gold font-medium block">
              Tasting Salon
            </span>
            <div className="space-y-2 font-sans text-xs text-caveno-muted font-light leading-relaxed">
              <p className="flex items-center gap-2">
                <Compass size={14} className="text-caveno-gold shrink-0" />
                <span>Sanctuary Avenue • Master Tasting Salon</span>
              </p>
              <p>Daily Tastings: 08:00 — 22:00</p>
              <p className="pt-2 text-caveno-cream font-mono text-[11px]">
                reservations@caveno-luxury.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Micro Copyright Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[10px] text-caveno-muted">
          <span>© 2026 CAVÉNO LUXURY ROASTERY. ALL RIGHTS RESERVED.</span>

          <div className="flex items-center gap-6">
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 hover:text-caveno-gold transition tracking-wider text-caveno-gold/70"
            >
              <ShieldCheck size={12} />
              <span>STAFF ACCESS</span>
            </Link>
            <span className="tracking-widest">DESIGNED FOR CONNOISSEURS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
