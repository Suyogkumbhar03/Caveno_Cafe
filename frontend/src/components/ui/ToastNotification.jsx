import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Info, X } from 'lucide-react';

const ToastNotification = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[9998] max-w-sm glass-card border border-caveno-gold/40 p-4 rounded-2xl shadow-2xl gold-glow flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-full bg-caveno-gold/10 text-caveno-gold border border-caveno-gold/30 flex items-center justify-center shrink-0">
          <Sparkles size={16} />
        </div>

        <div className="flex-1 min-w-0">
          <h5 className="font-cinzel text-xs text-caveno-cream font-medium">
            {toast.title || 'CAVÉNO Notice'}
          </h5>
          <p className="font-sans text-[11px] text-caveno-muted font-light truncate">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-caveno-muted hover:text-caveno-cream transition p-1"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ToastNotification;
