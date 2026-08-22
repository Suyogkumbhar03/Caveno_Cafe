import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsapConfig';
import { motion } from 'framer-motion';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const guestOptions = ['2 Guests', '4 Guests', '6+ Private Table'];
const dateOptions = ['Tonight', 'Tomorrow', 'This Weekend'];

const HomeCTA = () => {
  const [selectedGuests, setSelectedGuests] = useState('2 Guests');
  const [selectedDate, setSelectedDate] = useState('Tonight');

  const containerRef = useRef(null);
  const cardRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="reservation-cta"
      className="relative py-36 px-6 md:px-24 bg-caveno-black overflow-hidden border-t border-white/[0.06]"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-caveno-gold/10 rounded-full blur-[160px] pointer-events-none" />

      <div
        ref={cardRef}
        className="max-w-5xl mx-auto rounded-3xl glass-card border border-caveno-gold/30 p-8 sm:p-14 md:p-20 text-center relative overflow-hidden shadow-2xl space-y-10"
      >
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-caveno-gold font-light block">
            Exclusive Reservations
          </span>
          <h2 className="font-cinzel text-4xl sm:text-6xl text-caveno-cream leading-tight">
            Reserve Your Experience
          </h2>
          <p className="font-sans text-sm md:text-base text-caveno-muted font-light leading-relaxed">
            Tables are strictly limited to ensure an unhurried, intimate sensory tasting. Select your preferences below to check real-time availability.
          </p>
        </div>

        {/* Interactive Quick-Picker Controls */}
        <div className="max-w-xl mx-auto space-y-6 pt-4">
          {/* Guests Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-caveno-gold uppercase tracking-wider">
              <Users size={14} />
              <span>Party Size</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {guestOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedGuests(option)}
                  className={`px-5 py-2.5 rounded-full text-xs font-sans tracking-wider transition-all duration-300 ${
                    selectedGuests === option
                      ? 'bg-caveno-gold text-caveno-black font-semibold shadow-lg shadow-caveno-gold/20 scale-105'
                      : 'glass-pill text-caveno-cream hover:border-caveno-gold/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-caveno-gold uppercase tracking-wider">
              <Calendar size={14} />
              <span>Preferred Date</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {dateOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedDate(option)}
                  className={`px-5 py-2.5 rounded-full text-xs font-sans tracking-wider transition-all duration-300 ${
                    selectedDate === option
                      ? 'bg-caveno-gold text-caveno-black font-semibold shadow-lg shadow-caveno-gold/20 scale-105'
                      : 'glass-pill text-caveno-cream hover:border-caveno-gold/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Action Trigger */}
        <div className="pt-6">
          <Link
            to={`/reservation?guests=${encodeURIComponent(selectedGuests)}&date=${encodeURIComponent(selectedDate)}`}
            className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-caveno-gold text-caveno-black font-sans text-xs uppercase tracking-[0.25em] font-semibold rounded-full hover:bg-caveno-amber transition duration-300 shadow-xl shadow-caveno-gold/20 group"
          >
            <span>Proceed to Reservation</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
