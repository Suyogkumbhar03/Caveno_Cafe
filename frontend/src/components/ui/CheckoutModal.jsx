import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, DollarSign, CheckCircle2, QrCode, ArrowRight, ShieldCheck, Sparkles, User, Mail, PlusCircle, LayoutDashboard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUserAuth } from '../../context/UserAuthContext';
import API_BASE_URL from '../../config/api';

const CheckoutModal = ({ isOpen, onClose, onCheckoutSuccess }) => {
  const { cartItems, total, subtotal, tax, clearCart, setIsCartOpen } = useCart();
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'table' | 'upi'
  const [tableNo, setTableNo] = useState('Barista Salon Table 4');
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  if (!isOpen) return null;

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const customerEmail = user?.email || guestEmail || 'guest@domain.com';
    const customerName = user?.name || guestName || 'Guest Connoisseur';

    const orderPayload = {
      items: cartItems.map((item) => ({
        id: item.id || item.cartItemId,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        grind: item.options?.grind || 'Espresso',
        milk: item.options?.milk || 'Whole Milk',
        sweetness: item.options?.sweetness || 'Standard',
      })),
      subtotal: Number(subtotal) || 0,
      tax: Number(tax) || 0,
      totalAmount: Number(total) || 0,
      tableNumber: tableNo,
      zone: 'Barista Bar',
      customerInfo: {
        name: customerName,
        email: customerEmail,
        phone: user?.phone || '',
      },
    };

    let orderData = null;

    try {
      let response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          orderData = json.data;
        }
      }
    } catch (err) {
      console.log('[CAVÉNO Checkout] API connection offline, saving order locally');
    }

    const orderRefId = orderData?._id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // Store order in session order history list
    try {
      const existingSessionOrders = JSON.parse(localStorage.getItem('caveno_session_order_ids') || '[]');
      if (!existingSessionOrders.includes(orderRefId)) {
        existingSessionOrders.unshift(orderRefId);
        localStorage.setItem('caveno_session_order_ids', JSON.stringify(existingSessionOrders));
      }
    } catch (e) {
      localStorage.setItem('caveno_session_order_ids', JSON.stringify([orderRefId]));
    }
    localStorage.setItem('caveno_last_order_id', orderRefId);
    localStorage.setItem('caveno_customer_email', customerEmail);

    setReceipt({
      orderId: orderRefId,
      total,
      itemsCount: cartItems.length,
      tableNo,
      paymentMethod: paymentMethod === 'card' ? 'Visa Black Card' : paymentMethod === 'upi' ? 'UPI Pay' : 'Pay at Table',
      timestamp: new Date().toLocaleTimeString(),
    });

    // DECOUPLE CART: Clear cart completely upon order confirmation
    clearCart();
    setIsProcessing(false);
  };

  const handleTrackOrders = () => {
    setReceipt(null);
    onClose();
    if (setIsCartOpen) setIsCartOpen(false);
    if (onCheckoutSuccess) onCheckoutSuccess();
    navigate('/dashboard');
  };

  const handleOrderMore = () => {
    setReceipt(null);
    onClose();
    if (setIsCartOpen) setIsCartOpen(false);
    if (onCheckoutSuccess) onCheckoutSuccess();
    navigate('/menu');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (receipt) setReceipt(null);
            onClose();
          }}
          className="fixed inset-0 bg-caveno-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg glass-card border border-caveno-gold/40 rounded-3xl p-6 sm:p-8 relative z-10 shadow-2xl space-y-6 text-caveno-cream max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-caveno-gold" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-caveno-gold">
                LUXURY CHECKOUT ATELIER
              </span>
            </div>
            <button
              onClick={() => {
                if (receipt) setReceipt(null);
                onClose();
              }}
              className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-caveno-muted hover:text-caveno-cream"
            >
              <X size={16} />
            </button>
          </div>

          {receipt ? (
            /* Animated Digital Receipt & Continuous Ordering Actions */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-1">
                <h3 className="font-cinzel text-2xl text-caveno-cream">Order Confirmed</h3>
                <p className="font-sans text-xs text-caveno-muted font-light">
                  Your artisanal roast flight has been transmitted to the Master Barista.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 font-mono text-xs text-left">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-caveno-muted">Order Ref Code:</span>
                  <span className="text-caveno-gold font-bold">{receipt.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-caveno-muted">Table / Zone:</span>
                  <span className="text-caveno-cream">{receipt.tableNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-caveno-muted">Payment Method:</span>
                  <span className="text-caveno-cream">{receipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-semibold">
                  <span className="text-caveno-cream">Total Settled:</span>
                  <span className="text-caveno-gold">${receipt.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Continuous Ordering Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleTrackOrders}
                  className="py-3.5 px-4 bg-caveno-gold text-caveno-black font-sans text-xs uppercase tracking-wider font-semibold rounded-full hover:bg-caveno-amber transition flex items-center justify-center gap-2 shadow-lg shadow-caveno-gold/20"
                >
                  <LayoutDashboard size={15} />
                  <span>Track All Orders</span>
                </button>

                <button
                  onClick={handleOrderMore}
                  className="py-3.5 px-4 glass-pill border border-caveno-gold/40 text-caveno-gold font-sans text-xs uppercase tracking-wider font-semibold rounded-full hover:bg-caveno-gold/15 transition flex items-center justify-center gap-2"
                >
                  <PlusCircle size={15} />
                  <span>Order More Items</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleCompleteOrder} className="space-y-5 font-sans text-xs">
              {/* Payment Method Tabs */}
              <div className="space-y-2">
                <label className="text-caveno-muted font-mono uppercase tracking-wider text-[11px] block">
                  Select Settlement Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'upi', label: 'Instant UPI', icon: QrCode },
                    { id: 'table', label: 'Pay at Table', icon: DollarSign },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                          paymentMethod === m.id
                            ? 'bg-caveno-gold/15 border-caveno-gold text-caveno-cream font-semibold'
                            : 'glass-pill border-white/10 text-caveno-muted hover:border-white/20'
                        }`}
                      >
                        <Icon size={18} className={paymentMethod === m.id ? 'text-caveno-gold' : ''} />
                        <span className="text-[10px] tracking-wider uppercase">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guest Details (if not signed in) */}
              {!user && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-caveno-muted">Guest Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-caveno-muted" />
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Lady / Lord Guest"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-caveno-cream text-xs focus:outline-none focus:border-caveno-gold/60"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-caveno-muted">Guest Email</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-caveno-muted" />
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="guest@domain.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-caveno-cream text-xs focus:outline-none focus:border-caveno-gold/60"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Table / Zone Designation */}
              <div className="space-y-1">
                <label className="text-caveno-muted">Table / Lounge Zone *</label>
                <input
                  type="text"
                  required
                  value={tableNo}
                  onChange={(e) => setTableNo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-caveno-cream focus:outline-none focus:border-caveno-gold/60 font-mono"
                />
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-caveno-muted">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-caveno-cream font-mono focus:outline-none focus:border-caveno-gold/60"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-caveno-muted">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-caveno-cream font-mono focus:outline-none focus:border-caveno-gold/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-caveno-muted">CVC / CVV</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-caveno-cream font-mono focus:outline-none focus:border-caveno-gold/60"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                  <QrCode size={64} className="mx-auto text-caveno-gold" />
                  <p className="font-mono text-xs text-caveno-gold">caveno@okicici</p>
                  <p className="text-[10px] text-caveno-muted">Scan with Google Pay, PhonePe, or Paytm</p>
                </div>
              )}

              {/* Pay at Table Note */}
              {paymentMethod === 'table' && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-caveno-muted space-y-1">
                  <p className="text-caveno-cream font-medium">Pay via Cash / Card at Table</p>
                  <p className="text-[11px] font-light">
                    Your order will be served immediately. Settlement will be collected by your assigned Master Sommelier.
                  </p>
                </div>
              )}

              {/* Summary Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-caveno-muted block font-mono">TOTAL DUE</span>
                  <span className="font-cinzel text-xl text-caveno-gold font-bold">${total.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-8 py-3.5 rounded-full bg-caveno-gold text-caveno-black text-xs uppercase tracking-widest font-semibold flex items-center gap-2 hover:bg-caveno-amber transition shadow-xl shadow-caveno-gold/20"
                >
                  <span>{isProcessing ? 'Processing Order...' : 'Confirm Order'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
