import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Calendar, Clock, MapPin, Users, QrCode, CheckCircle } from 'lucide-react';

const DigitalPassModal = ({ isOpen, onClose, passData }) => {
  if (!isOpen || !passData) return null;

  const { bookingRef, name, date, timeSlot, zone, guests, status } = passData;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-caveno-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-sm glass-card border border-caveno-gold/40 rounded-3xl p-6 relative z-10 shadow-2xl space-y-6 text-caveno-cream overflow-hidden"
        >
          {/* Card Top Gold Foil Strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-caveno-gold via-amber-200 to-caveno-gold" />

          {/* Pass Header */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-caveno-gold" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-caveno-gold">
                CAVÉNO DIGITAL PASS
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full glass-pill flex items-center justify-center text-caveno-muted hover:text-caveno-cream"
            >
              <X size={14} />
            </button>
          </div>

          {/* Member Name & Status */}
          <div className="space-y-1 text-center border-b border-white/10 pb-4">
            <div className="font-cinzel text-xl font-medium text-caveno-cream">{name}</div>
            <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-caveno-gold">
              <CheckCircle size={12} />
              <span>Status: {status || 'Confirmed Pass'}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 font-sans text-xs">
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-caveno-muted flex items-center gap-1">
                <Calendar size={11} className="text-caveno-gold" /> Date
              </div>
              <div className="font-medium text-caveno-cream">{date}</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-caveno-muted flex items-center gap-1">
                <Clock size={11} className="text-caveno-gold" /> Time Flight
              </div>
              <div className="font-medium text-caveno-cream">{timeSlot}</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-caveno-muted flex items-center gap-1">
                <MapPin size={11} className="text-caveno-gold" /> Salon Zone
              </div>
              <div className="font-medium text-caveno-cream capitalize">{zone?.replace('-', ' ')}</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-caveno-muted flex items-center gap-1">
                <Users size={11} className="text-caveno-gold" /> Party
              </div>
              <div className="font-medium text-caveno-cream">{guests}</div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center space-y-3">
            <div className="inline-flex p-3 bg-caveno-cream rounded-xl text-caveno-black shadow-inner">
              <QrCode size={90} />
            </div>
            <div className="font-mono text-xs text-caveno-gold tracking-widest font-semibold">
              {bookingRef}
            </div>
            <p className="text-[10px] font-sans text-caveno-muted">
              Present this pass at the Master Concierge entry.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DigitalPassModal;
