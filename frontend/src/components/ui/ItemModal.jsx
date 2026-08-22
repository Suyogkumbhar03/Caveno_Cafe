import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const grindOptions = ['Whole Bean', 'Espresso', 'Aeropress', 'French Press'];
const milkOptions = ['None', 'Oat Milk', 'Almond Milk', 'Whole Milk'];
const sweetnessOptions = ['Unsweetened', 'Light Honey', '24k Gold Honey'];

const ItemModal = ({ item, isOpen, onClose }) => {
  const { addToCart } = useCart();

  const [grind, setGrind] = useState('Espresso');
  const [milk, setMilk] = useState('Oat Milk');
  const [sweetness, setSweetness] = useState('Unsweetened');
  const [quantity, setQuantity] = useState(1);
  const [addedRipple, setAddedRipple] = useState(false);

  if (!item) return null;

  const handleAdd = () => {
    const isBeverage = item.category !== 'Artisanal Pastries';
    const customOptions = isBeverage
      ? { Grind: grind, Milk: milk, Sweetness: sweetness }
      : { Style: 'Warm Bakery Serve' };

    addToCart(item, customOptions, quantity);
    setAddedRipple(true);

    setTimeout(() => {
      setAddedRipple(false);
      onClose();
    }, 400);
  };

  const isBeverage = item.category !== 'Artisanal Pastries';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-caveno-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl rounded-3xl glass-card border border-white/10 overflow-hidden shadow-2xl my-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full glass-pill flex items-center justify-center text-caveno-muted hover:text-caveno-cream hover:border-caveno-gold/50 transition duration-300"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Product Cover Image */}
              <div className="md:col-span-5 relative h-56 md:h-auto min-h-[220px]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-caveno-black via-transparent to-transparent opacity-60 md:hidden" />
              </div>

              {/* Product Customizer Detail */}
              <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-caveno-gold">
                    {item.origin || item.category}
                  </span>
                  <h3 className="font-cinzel text-2xl text-caveno-cream font-medium">
                    {item.name}
                  </h3>
                  <span className="font-cinzel text-xl text-caveno-gold font-semibold block mt-1">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <p className="font-sans text-xs text-caveno-muted font-light leading-relaxed">
                  {item.description}
                </p>

                {/* Flavor Notes Tags */}
                {item.flavorNotes && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.flavorNotes.map((note, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full text-[10px] font-sans bg-caveno-gold/10 text-caveno-gold border border-caveno-gold/20"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                )}

                {/* Custom Options Selectors for Beverages */}
                {isBeverage && (
                  <div className="space-y-4 pt-2 border-t border-white/10">
                    {/* Grind Type */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-caveno-muted">
                        Grind Profile
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {grindOptions.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setGrind(opt)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition ${
                              grind === opt
                                ? 'bg-caveno-gold text-caveno-black font-semibold'
                                : 'glass-pill text-caveno-cream hover:border-caveno-gold/40'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Milk Alternative */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-caveno-muted">
                        Steamed Milk Choice
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {milkOptions.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setMilk(opt)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition ${
                              milk === opt
                                ? 'bg-caveno-gold text-caveno-black font-semibold'
                                : 'glass-pill text-caveno-cream hover:border-caveno-gold/40'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity & Add Action Row */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 glass-pill px-3 py-1.5 rounded-full">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="text-caveno-muted hover:text-caveno-cream"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-mono text-xs text-caveno-cream w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="text-caveno-muted hover:text-caveno-cream"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    className={`flex-grow py-3 px-6 rounded-full font-sans text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition duration-300 ${
                      addedRipple
                        ? 'bg-emerald-500 text-white scale-95'
                        : 'bg-caveno-gold text-caveno-black hover:bg-caveno-amber shadow-lg shadow-caveno-gold/20'
                    }`}
                  >
                    <ShoppingBag size={14} />
                    <span>{addedRipple ? 'Added to Order!' : `Add • $${(item.price * quantity).toFixed(2)}`}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ItemModal;
