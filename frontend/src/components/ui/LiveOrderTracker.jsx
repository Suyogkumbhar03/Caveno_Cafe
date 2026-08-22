import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, CheckCircle2, Clock, Flame, Utensils, RefreshCw, ShoppingBag, ChevronRight } from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';

const LiveOrderTracker = () => {
  const { user } = useUserAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchActiveOrders = async () => {
    try {
      const email = user?.email || localStorage.getItem('caveno_customer_email') || 'guest@domain.com';
      const encodedEmail = encodeURIComponent(email);

      let response = await fetch(`/api/orders/user/${encodedEmail}`);
      if (!response.ok) {
        response = await fetch(`http://localhost:5000/api/orders/user/${encodedEmail}`);
      }

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setOrders(json.data);
          setLastUpdated(new Date());
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.log('[LiveOrderTracker] API polling offline, using local fallback');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchActiveOrders();
    const interval = setInterval(fetchActiveOrders, 5000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 rounded-3xl glass-card border border-white/10 animate-pulse space-y-4">
        <div className="h-4 w-1/3 bg-white/10 rounded" />
        <div className="h-8 w-2/3 bg-white/10 rounded" />
      </div>
    );
  }

  // Filter active orders (Pending, Preparing, Ready) or display all recent orders if none are active
  const activeOrders = orders.filter((o) => o.orderStatus !== 'Served' && o.orderStatus !== 'Cancelled');
  const displayOrders = activeOrders.length > 0 ? activeOrders : orders.slice(0, 2);

  if (displayOrders.length === 0) return null;

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Preparing':
      case 'Ready':
        return 2;
      case 'Served':
        return 3;
      default:
        return 1;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h2 className="font-cinzel text-2xl text-caveno-cream font-medium">
            Active Tasting Orders ({displayOrders.length})
          </h2>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-caveno-muted bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <RefreshCw size={12} className="animate-spin text-caveno-gold" />
          <span>Synced: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Grid of Multi-Active Orders */}
      <div className="grid grid-cols-1 gap-6">
        {displayOrders.map((order) => {
          const currentStep = getStepIndex(order.orderStatus);
          const orderShortId = order._id ? order._id.slice(-6).toUpperCase() : 'ORD-8921';

          return (
            <motion.div
              key={order._id || orderShortId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card border border-caveno-gold/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-caveno-cream"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-caveno-gold/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Order Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={14} className="text-caveno-gold" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-caveno-gold font-bold">
                      Order #{orderShortId}
                    </span>
                  </div>
                  <h3 className="font-cinzel text-lg text-caveno-cream mt-0.5">
                    {order.tableNumber || 'Barista Salon Table 4'}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs text-caveno-gold font-bold block">
                    ${order.totalAmount?.toFixed(2) || '0.00'}
                  </span>
                  <span className="font-mono text-[10px] text-caveno-muted block">
                    {new Date(order.createdAt || Date.now()).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* 3-Step Progress Bar for this Order */}
              <div className="grid grid-cols-3 gap-2 relative">
                {/* Step 1: Placed */}
                <div className="flex flex-col items-center text-center space-y-2 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${
                      currentStep >= 1
                        ? 'bg-caveno-gold text-caveno-black border-caveno-gold font-bold shadow-lg shadow-caveno-gold/30'
                        : 'glass-pill border-white/10 text-caveno-muted'
                    }`}
                  >
                    <Clock size={18} />
                  </div>
                  <span className="font-sans text-[11px] font-medium tracking-wider uppercase">
                    Order Placed
                  </span>
                </div>

                {/* Step 2: Brewing */}
                <div className="flex flex-col items-center text-center space-y-2 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${
                      currentStep >= 2
                        ? 'bg-caveno-gold text-caveno-black border-caveno-gold font-bold shadow-lg shadow-caveno-gold/30 animate-pulse'
                        : 'glass-pill border-white/10 text-caveno-muted'
                    }`}
                  >
                    <Flame size={18} />
                  </div>
                  <span className="font-sans text-[11px] font-medium tracking-wider uppercase">
                    Barista Brewing
                  </span>
                </div>

                {/* Step 3: Served */}
                <div className="flex flex-col items-center text-center space-y-2 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${
                      currentStep >= 3
                        ? 'bg-emerald-500 text-caveno-black border-emerald-500 font-bold shadow-lg shadow-emerald-500/30'
                        : 'glass-pill border-white/10 text-caveno-muted'
                    }`}
                  >
                    <Utensils size={18} />
                  </div>
                  <span className="font-sans text-[11px] font-medium tracking-wider uppercase">
                    Served at Table
                  </span>
                </div>
              </div>

              {/* Status Callout Banner */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between font-sans text-xs">
                <div>
                  <span className="text-caveno-muted block font-mono text-[10px]">STATUS</span>
                  <span className="font-cinzel text-sm text-caveno-gold font-semibold uppercase tracking-wider">
                    {order.orderStatus === 'Pending'
                      ? '🟡 Order Placed'
                      : order.orderStatus === 'Preparing'
                      ? '🔵 Preparing Your Coffee'
                      : order.orderStatus === 'Ready'
                      ? '🟢 Order on the Way to Your Table'
                      : '✅ Order Completed'}
                  </span>
                </div>

                <span className="font-mono text-xs text-caveno-cream bg-white/10 px-3 py-1 rounded-full">
                  {order.zone || 'Barista Bar'}
                </span>
              </div>

              {/* Itemized Breakdown */}
              <div className="space-y-2 border-t border-white/10 pt-4 font-mono text-xs">
                <span className="text-caveno-muted text-[10px] uppercase tracking-wider block">
                  Items in this order ({order.items?.length || 0})
                </span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-caveno-cream">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-caveno-gold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveOrderTracker;
