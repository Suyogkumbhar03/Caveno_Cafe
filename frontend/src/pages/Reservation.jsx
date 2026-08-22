import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FloorPlanPicker from '../components/ui/FloorPlanPicker';
import ReservationModal from '../components/ui/ReservationModal';
import { ShieldCheck, Sparkles, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';

const partyOptions = ['1 Guest', '2 Guests', '3 Guests', '4 Guests', '5 Guests', '6+ Private Salon'];

const timeSlots = [
  { id: '16:00', label: '16:00 — High Tea Flight' },
  { id: '18:30', label: '18:30 — Sunset Cupping' },
  { id: '20:30', label: '20:30 — Night Roast Flight' },
  { id: '22:00', label: '22:00 — After Hours Reserve' },
];

const occasions = ['Anniversary', 'Birthday', 'Business Tasting', 'Date Night', 'Private Cupping'];

const Reservation = () => {
  const [searchParams] = useSearchParams();
  const { user } = useUserAuth();

  // Wizard state
  const [step, setStep] = useState(1);

  // Form State
  const [guests, setGuests] = useState(searchParams.get('guests') || '2 Guests');
  const [date, setDate] = useState(
    searchParams.get('date') === 'Tonight'
      ? '2026-08-22'
      : searchParams.get('date') === 'Tomorrow'
      ? '2026-08-23'
      : '2026-08-24'
  );
  const [timeSlot, setTimeSlot] = useState('18:30 — Sunset Cupping');
  const [zone, setZone] = useState('velvet-lounge');

  // Contact State (prefilled if user logged in)
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [dietary, setDietary] = useState('');
  const [occasion, setOccasion] = useState('Date Night');

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || '');
      if (!email) setEmail(user.email || '');
    }
  }, [user]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      // Final Submit to Backend API
      setIsSubmitting(true);
      const payload = {
        name: name || 'Guest Connoisseur',
        email,
        phone,
        guests,
        date,
        timeSlot,
        zone,
        dietary,
        occasion,
      };

      try {
        const response = await fetch('http://localhost:5000/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            setSubmittedData({
              ...payload,
              refCode: json.data.bookingRef,
            });
            setIsSubmitting(false);
            setIsModalOpen(true);
            return;
          }
        }
      } catch (err) {
        console.log('[CAVÉNO Reservation API] Server offline, using fallback reference generator');
      }

      // Offline fallback
      const fallbackRef = `CVN-${Math.floor(1000 + Math.random() * 9000)}-X`;
      setSubmittedData({
        ...payload,
        refCode: fallbackRef,
      });
      setIsSubmitting(false);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-caveno-black text-caveno-cream pt-32 pb-36 px-6 md:px-16 relative overflow-hidden">
      {/* Ambient Radial Background Glow */}
      <div className="absolute top-1/3 left-10 w-[700px] h-[700px] bg-caveno-gold/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header Title Banner */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-caveno-gold font-light block">
            Exclusive Cupping Reservations
          </span>
          <h1 className="font-cinzel text-5xl sm:text-7xl text-caveno-cream font-medium tracking-wide">
            Reserve Your Sanctuary
          </h1>
          <p className="font-sans text-sm md:text-base text-caveno-muted font-light leading-relaxed">
            Seating at CAVÉNO is strictly limited to 18 tables per flight cycle to ensure unhurried, intimate sensory exploration.
          </p>
        </div>

        {/* Split Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Experience Showcase */}
          <div className="lg:col-span-5 space-y-8 glass-card p-8 sm:p-10 rounded-3xl border border-white/10">
            <div className="space-y-3 border-b border-white/10 pb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-caveno-gold">
                The 7-Course Flight Ritual
              </span>
              <h3 className="font-cinzel text-2xl text-caveno-cream">
                What to Expect
              </h3>
              <p className="font-sans text-xs text-caveno-muted font-light leading-relaxed">
                Your reservation includes a guided cupping journey through 3 rare single-origin micro-lots, paired with artisanal French pâtisserie and cold nitrogen palate cleansers.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4 font-sans text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-caveno-gold shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="font-cinzel text-sm text-caveno-cream font-medium">
                    Guaranteed Private Table
                  </h4>
                  <p className="text-caveno-muted font-light">
                    No wait times. Your reserved zone is held exclusively for 90 minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-caveno-gold shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="font-cinzel text-sm text-caveno-cream font-medium">
                    Master Sommelier Guide
                  </h4>
                  <p className="text-caveno-muted font-light">
                    Personalized aroma breakdown and origin story narration for each flight.
                  </p>
                </div>
              </div>
            </div>

            {/* Dress Code & Salon Guidelines */}
            <div className="pt-6 border-t border-white/10 space-y-2 font-mono text-[11px] text-caveno-muted">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-caveno-gold" />
                Dress Code: Smart Casual / Editorial Attire
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-caveno-gold" />
                Cancellation Policy: Flexible up to 4 hours prior
              </p>
            </div>
          </div>

          {/* Right Column: 3-Step Wizard Booking Engine */}
          <div className="lg:col-span-7 glass-card p-8 sm:p-12 rounded-3xl border border-caveno-gold/30 shadow-2xl relative">
            {/* Step Progress Breadcrumb */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-3">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`flex items-center gap-2 ${
                      step >= s ? 'text-caveno-gold' : 'text-caveno-muted'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-semibold border transition ${
                        step === s
                          ? 'bg-caveno-gold text-caveno-black border-caveno-gold'
                          : step > s
                          ? 'bg-caveno-gold/20 text-caveno-gold border-caveno-gold'
                          : 'glass-pill border-white/10'
                      }`}
                    >
                      {step > s ? <CheckCircle size={14} /> : s}
                    </div>
                    <span className="font-sans text-xs uppercase tracking-wider hidden sm:inline">
                      {s === 1 ? 'Date & Party' : s === 2 ? 'Zone Map' : 'Details'}
                    </span>
                    {s < 3 && <span className="text-white/20 px-1">—</span>}
                  </div>
                ))}
              </div>

              <span className="font-mono text-xs text-caveno-gold">Step {step} of 3</span>
            </div>

            {/* Multi-Step Wizard Forms */}
            <form onSubmit={handleNextStep}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Party Size Selector */}
                    <div className="space-y-3">
                      <label className="font-mono text-xs text-caveno-gold uppercase tracking-wider block">
                        1. Select Guest Party Size
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {partyOptions.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setGuests(opt)}
                            className={`px-4 py-2.5 rounded-full font-sans text-xs tracking-wider transition ${
                              guests === opt
                                ? 'bg-caveno-gold text-caveno-black font-semibold shadow-lg shadow-caveno-gold/20 scale-105'
                                : 'glass-pill text-caveno-cream hover:border-caveno-gold/40'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date Picker Input */}
                    <div className="space-y-3">
                      <label className="font-mono text-xs text-caveno-gold uppercase tracking-wider block">
                        2. Select Reservation Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-caveno-cream focus:outline-none focus:border-caveno-gold/60 transition"
                        required
                      />
                    </div>

                    {/* Time Slot Chips */}
                    <div className="space-y-3">
                      <label className="font-mono text-xs text-caveno-gold uppercase tracking-wider block">
                        3. Select Tasting Flight Time
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setTimeSlot(slot.label)}
                            className={`p-3.5 rounded-xl font-sans text-xs tracking-wider transition text-left border ${
                              timeSlot === slot.label
                                ? 'glass-card border-caveno-gold text-caveno-cream font-semibold gold-glow'
                                : 'glass-pill border-white/10 text-caveno-muted hover:border-white/20'
                            }`}
                          >
                            {slot.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <FloorPlanPicker selectedZone={zone} onSelectZone={setZone} />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <span className="font-mono text-xs text-caveno-gold uppercase tracking-wider block">
                      Contact Information & Guest Notes
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-sans text-xs text-caveno-muted">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Lord / Lady Connoisseur"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-sans text-xs text-caveno-cream focus:outline-none focus:border-caveno-gold/60 transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-sans text-xs text-caveno-muted">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="guest@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-sans text-xs text-caveno-cream focus:outline-none focus:border-caveno-gold/60 transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-sans text-xs text-caveno-muted">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-sans text-xs text-caveno-cream focus:outline-none focus:border-caveno-gold/60 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-sans text-xs text-caveno-muted">Special Occasion</label>
                      <div className="flex flex-wrap gap-2">
                        {occasions.map((occ) => (
                          <button
                            key={occ}
                            type="button"
                            onClick={() => setOccasion(occ)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition ${
                              occasion === occ
                                ? 'bg-caveno-gold text-caveno-black font-semibold'
                                : 'glass-pill text-caveno-cream hover:border-caveno-gold/40'
                            }`}
                          >
                            {occ}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-sans text-xs text-caveno-muted">Dietary Allergies / Preferences</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Dairy intolerance, vegan pâtisserie request..."
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-sans text-xs text-caveno-cream focus:outline-none focus:border-caveno-gold/60 transition"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Wizard Control Buttons */}
              <div className="pt-8 border-t border-white/10 flex items-center justify-between gap-4 mt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="px-5 py-3 rounded-full glass-pill text-caveno-cream text-xs uppercase tracking-wider flex items-center gap-2 hover:border-caveno-gold/40 transition"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-full bg-caveno-gold text-caveno-black font-sans text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-caveno-amber transition duration-300 shadow-xl shadow-caveno-gold/20 ml-auto"
                >
                  <span>{step === 3 ? (isSubmitting ? 'Confirming Pass...' : 'Confirm Reservation') : 'Continue'}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Digital Pass Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reservationData={submittedData}
      />
    </div>
  );
};

export default Reservation;
