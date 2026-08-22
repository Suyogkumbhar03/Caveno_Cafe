import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserAuth } from '../context/UserAuthContext';
import DigitalPassModal from '../components/ui/DigitalPassModal';
import LiveOrderTracker from '../components/ui/LiveOrderTracker';
import API_BASE_URL from '../config/api';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  QrCode,
  LogOut,
  ShoppingBag,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user, userToken, logout } = useUserAuth();
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedPass, setSelectedPass] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch User Reservations
        const resRes = await fetch(`${API_BASE_URL}/user/reservations`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (resRes.ok) {
          const resJson = await resRes.json();
          if (resJson.success) setReservations(resJson.data);
        }

        // Fetch User Orders
        const orderRes = await fetch(`${API_BASE_URL}/user/orders`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (orderRes.ok) {
          const orderJson = await orderRes.json();
          if (orderJson.success) setOrders(orderJson.data);
        }
      } catch (err) {
        console.error('[CAVÉNO User Dashboard Fetch]', err);
      }
    };

    if (userToken) {
      fetchUserData();
      const interval = setInterval(fetchUserData, 5000);
      return () => clearInterval(interval);
    }
  }, [userToken]);

  const activeBooking = reservations[0];
  const pastOrders = orders.filter((o) => ['Served', 'Completed', 'Cancelled'].includes(o.orderStatus));

  return (
    <div className="min-h-screen bg-caveno-black text-caveno-cream pt-32 pb-32 px-6 md:px-16 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-10 w-[700px] h-[700px] bg-caveno-gold/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        {/* Welcome Header */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-caveno-gold" />
              <span className="font-mono text-xs text-caveno-gold uppercase tracking-widest font-medium">
                CAVÉNO CONNOISSEUR CLUB
              </span>
            </div>
            <h1 className="font-cinzel text-3xl md:text-4xl text-caveno-cream font-medium">
              Welcome Back, {user?.name || 'Valued Member'}
            </h1>
            <p className="font-sans text-xs text-caveno-muted font-light">
              Member Tier: <span className="text-caveno-gold font-medium">Grand Reserve Connoisseur</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/reservation"
              className="px-5 py-3 rounded-full bg-caveno-gold text-caveno-black font-sans text-xs uppercase tracking-wider font-semibold hover:bg-caveno-amber transition shadow-lg shadow-caveno-gold/20"
            >
              Book New Cupping
            </Link>

            <button
              onClick={logout}
              className="px-4 py-3 rounded-full glass-pill text-xs uppercase tracking-wider text-caveno-muted hover:text-rose-400 border border-white/10 hover:border-rose-500/30 flex items-center gap-2 transition"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Real-Time Kitchen Tracker Widget */}
        <LiveOrderTracker />

        {/* Active Upcoming Booking Showcase */}
        <div className="space-y-4">
          <h2 className="font-cinzel text-2xl text-caveno-cream font-medium">Your Table Booking</h2>

          {activeBooking ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 rounded-3xl border border-caveno-gold/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-caveno-gold bg-caveno-gold/10 px-3 py-1 rounded-full border border-caveno-gold/30">
                    Ref: {activeBooking.bookingRef}
                  </span>
                  <span className="font-mono text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={13} /> {activeBooking.status || 'Confirmed'}
                  </span>
                </div>

                <h3 className="font-cinzel text-2xl text-caveno-cream">
                  {activeBooking.timeSlot}
                </h3>

                <div className="flex flex-wrap gap-4 text-xs font-sans text-caveno-muted">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-caveno-gold" /> {activeBooking.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-caveno-gold" /> Zone: <span className="capitalize text-caveno-cream">{activeBooking.zone?.replace('-', ' ')}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={14} className="text-caveno-gold" /> {activeBooking.guests}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPass(activeBooking);
                  setIsPassModalOpen(true);
                }}
                className="px-6 py-3.5 rounded-full bg-caveno-gold text-caveno-black font-sans text-xs uppercase tracking-widest font-semibold flex items-center gap-2.5 hover:bg-caveno-amber transition shadow-xl shadow-caveno-gold/20 shrink-0"
              >
                <QrCode size={16} />
                <span>View Booking Pass</span>
              </button>
            </motion.div>
          ) : (
            <div className="glass-card p-8 rounded-3xl border border-white/10 text-center space-y-4 py-12">
              <Calendar size={32} className="mx-auto text-caveno-gold/40" />
              <p className="font-cinzel text-lg text-caveno-cream">No upcoming table bookings</p>
              <p className="font-sans text-xs text-caveno-muted max-w-sm mx-auto font-light">
                Reserve your table for an unhurried, comfortable dining experience.
              </p>
              <Link
                to="/reservation"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-caveno-gold text-caveno-black text-xs uppercase tracking-wider font-semibold hover:bg-caveno-amber transition"
              >
                <span>Reserve Table</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Past Order History */}
        <div className="space-y-4">
          <h2 className="font-cinzel text-2xl text-caveno-cream font-medium">Past Orders</h2>

          <div className="glass-card p-6 rounded-3xl border border-white/10 overflow-x-auto">
            {pastOrders.length === 0 ? (
              <p className="text-xs font-sans text-caveno-muted text-center py-8">
                No past orders recorded under this account.
              </p>
            ) : (
              <table className="w-full text-left font-sans text-xs">
                <thead className="font-mono text-[11px] text-caveno-muted uppercase border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Selected Items</th>
                    <th className="py-3 px-4">Table / Zone</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pastOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-white/[0.02]">
                      <td className="py-4 px-4 font-mono text-caveno-muted">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 space-y-1">
                        {ord.items?.map((it, idx) => (
                          <div key={idx} className="text-caveno-cream">
                            {it.quantity}x {it.name}
                          </div>
                        ))}
                      </td>
                      <td className="py-4 px-4 text-caveno-muted">
                        {ord.tableNumber || ord.customerInfo?.tableNo || 'Barista Salon'}
                      </td>
                      <td className="py-4 px-4 font-mono text-caveno-gold">
                        ${ord.totalAmount?.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {ord.orderStatus || 'Served'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Digital Pass Modal */}
      <DigitalPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        passData={selectedPass}
      />
    </div>
  );
};

export default UserDashboard;
