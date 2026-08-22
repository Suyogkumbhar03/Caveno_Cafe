import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUserAuth } from '../../context/UserAuthContext';
import { Link } from 'react-router-dom';
import CheckoutModal from './CheckoutModal';

const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    tax,
    total,
  } = useCart();

  const { user } = useUserAuth();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[9999] overflow-hidden">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-caveno-black/75 backdrop-blur-sm"
            />

            {/* Slide-out Panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="w-screen max-w-md bg-caveno-dark border-l border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative z-10"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={20} className="text-caveno-gold" />
                    <h3 className="font-cinzel text-xl text-caveno-cream font-medium">
                      Your Selection ({cartItems.reduce((a, b) => a + b.quantity, 0)})
                    </h3>
                  </div>

                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-caveno-muted hover:text-caveno-cream"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Items List Container */}
                <div className="flex-1 overflow-y-auto py-6 space-y-4 my-2">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-caveno-muted">
                      <div className="w-16 h-16 rounded-full glass-pill flex items-center justify-center text-caveno-gold/50">
                        <ShoppingBag size={28} />
                      </div>
                      <p className="font-cinzel text-base text-caveno-cream">
                        Your order is empty
                      </p>
                      <p className="font-sans text-xs max-w-xs">
                        Explore our Master Reserve menu to select single-origin roasts and artisanal pastries.
                      </p>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="p-4 rounded-xl glass-card border border-white/10 flex gap-4 items-center justify-between"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0"
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="font-cinzel text-sm text-caveno-cream truncate">
                            {item.name}
                          </h4>
                          <span className="font-cinzel text-xs text-caveno-gold font-medium block">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>

                          {/* Custom Option Tags */}
                          {item.options && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {Object.entries(item.options).map(([key, val]) => (
                                <span
                                  key={key}
                                  className="text-[9px] font-mono text-caveno-muted bg-white/5 px-1.5 py-0.5 rounded"
                                >
                                  {val}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Quantity Controls & Remove */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-caveno-muted hover:text-rose-400 transition"
                          >
                            <Trash2 size={14} />
                          </button>

                          <div className="flex items-center gap-2 glass-pill px-2 py-1 rounded-full text-xs">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, -1)}
                              className="text-caveno-muted hover:text-caveno-cream"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-mono text-[11px] text-caveno-cream w-3 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, 1)}
                              className="text-caveno-muted hover:text-caveno-cream"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Summary & Action */}
                {cartItems.length > 0 && (
                  <div className="border-t border-white/10 pt-5 space-y-4">
                    <div className="space-y-1.5 text-xs font-sans text-caveno-muted">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-mono text-caveno-cream">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Tax (8%)</span>
                        <span className="font-mono text-caveno-cream">${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-sm pt-2 border-t border-white/10 text-caveno-cream">
                        <span>Total Due</span>
                        <span className="font-mono text-caveno-gold text-base">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setIsCheckoutModalOpen(true)}
                        className="w-full py-4 bg-caveno-gold text-caveno-black font-sans text-xs uppercase tracking-widest font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-caveno-amber transition duration-300 shadow-xl shadow-caveno-gold/20"
                      >
                        <span>Proceed to Luxury Checkout</span>
                        <ArrowRight size={16} />
                      </button>

                      <Link
                        to="/reservation"
                        onClick={() => setIsCartOpen(false)}
                        className="w-full py-2.5 glass-pill text-caveno-cream font-sans text-[11px] uppercase tracking-wider text-center rounded-full hover:border-caveno-gold/40 transition"
                      >
                        Or Book Cupping Reservation
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </>
  );
};

export default CartDrawer;
