import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '../../context/AdminAuthContext';
import MenuModal from '../../components/admin/MenuModal';
import {
  LayoutDashboard,
  CalendarCheck,
  ShoppingBag,
  Coffee,
  LogOut,
  Sparkles,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Layers,
  Filter,
  Flame,
  Utensils,
  Bell,
  RefreshCw,
} from 'lucide-react';

const AdminDashboard = () => {
  const { adminUser, adminToken, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Live Telemetry Clock
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Analytics Stats State
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalReservations: 0,
    totalOrders: 0,
    totalMenuItems: 0,
    pendingOrders: 0,
    seatedReservations: 0,
  });

  // Reservations State
  const [reservations, setReservations] = useState([]);
  const [resZoneFilter, setResZoneFilter] = useState('All');
  const [resStatusFilter, setResStatusFilter] = useState('All');
  const [resSearch, setResSearch] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [prevPendingCount, setPrevPendingCount] = useState(0);

  // Menu State
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Dashboard Stats & Initial Data
  const fetchData = async () => {
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        if (statsJson.success) setStats(statsJson.data);
      }

      // 2. Fetch Reservations
      const query = new URLSearchParams();
      if (resZoneFilter !== 'All') query.append('zone', resZoneFilter);
      if (resStatusFilter !== 'All') query.append('status', resStatusFilter);
      if (resSearch) query.append('search', resSearch);

      const resRes = await fetch(`http://localhost:5000/api/admin/reservations?${query.toString()}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (resRes.ok) {
        const resJson = await resRes.json();
        if (resJson.success) setReservations(resJson.data);
      }

      // 3. Fetch Orders
      let orderRes = await fetch('/api/orders');
      if (!orderRes.ok) {
        orderRes = await fetch('http://localhost:5000/api/orders');
      }
      if (orderRes.ok) {
        const orderJson = await orderRes.json();
        if (orderJson.success && orderJson.data) {
          const freshOrders = orderJson.data;
          const pendingCount = freshOrders.filter(o => o.orderStatus === 'Pending').length;
          
          if (pendingCount > prevPendingCount && prevPendingCount !== 0) {
            setNewOrderAlert(true);
            setTimeout(() => setNewOrderAlert(false), 5000);
          }
          setPrevPendingCount(pendingCount);
          setOrders(freshOrders);
        }
      }

      // 4. Fetch Menu Items
      const menuRes = await fetch('http://localhost:5000/api/menu');
      if (menuRes.ok) {
        const menuJson = await menuRes.json();
        if (menuJson.success) setMenuItems(menuJson.data);
      }
    } catch (err) {
      console.error('[CAVÉNO Admin Fetch Error]', err);
    }
  };

  useEffect(() => {
    fetchData();
    const pollInterval = setInterval(fetchData, 5000);
    return () => clearInterval(pollInterval);
  }, [resZoneFilter, resStatusFilter, resSearch, activeTab]);

  // Update Reservation Status
  const handleUpdateResStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/reservations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Order Status (Pending -> Preparing -> Served)
  const handleUpdateOrderStatus = async (id, orderStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus }),
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Menu Item
  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Delete this menu item from Master Reserve collection?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-caveno-black text-caveno-cream pt-24 pb-24 px-4 sm:px-8 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-caveno-gold/5 rounded-full blur-[180px] pointer-events-none" />

      {/* New Incoming Order Audio/Visual Banner Alert */}
      <AnimatePresence>
        {newOrderAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[99999] bg-amber-500 text-caveno-black font-sans px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-semibold text-xs animate-bounce"
          >
            <Bell size={20} className="animate-spin" />
            <span>🔔 NEW ORDER ARRIVED! Check Incoming Orders Column.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full glass-pill border border-caveno-gold/40 flex items-center justify-center text-caveno-gold shrink-0">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-caveno-gold">
                  CAVÉNO MANAGEMENT ATELIER
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="font-cinzel text-2xl sm:text-3xl text-caveno-cream font-medium">
                Administrator Telemetry
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end font-mono text-xs">
              <span className="text-caveno-muted">LIVE TIME</span>
              <span className="text-caveno-gold font-medium">{currentTime}</span>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-full glass-pill text-xs uppercase tracking-wider text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 transition"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'overview', label: 'Overview Analytics', icon: LayoutDashboard },
            { id: 'reservations', label: 'Reservations Manager', icon: CalendarCheck },
            { id: 'orders', label: 'Live Orders Board', icon: ShoppingBag },
            { id: 'menu', label: 'Master Reserve Menu', icon: Coffee },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-full font-sans text-xs uppercase tracking-wider flex items-center gap-2.5 transition ${
                  isActive
                    ? 'bg-caveno-gold text-caveno-black font-semibold shadow-lg shadow-caveno-gold/20 scale-105'
                    : 'glass-pill text-caveno-cream hover:border-caveno-gold/40'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW ANALYTICS */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-caveno-gold">
                  <span className="font-mono text-xs uppercase tracking-wider text-caveno-muted">
                    Total Revenue
                  </span>
                  <DollarSign size={20} />
                </div>
                <div className="font-cinzel text-3xl font-bold text-caveno-cream">
                  ${stats.totalRevenue.toFixed(2)}
                </div>
                <span className="font-mono text-[10px] text-emerald-400">
                  +14.2% vs last flight cycle
                </span>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-caveno-gold">
                  <span className="font-mono text-xs uppercase tracking-wider text-caveno-muted">
                    Total Bookings
                  </span>
                  <CalendarCheck size={20} />
                </div>
                <div className="font-cinzel text-3xl font-bold text-caveno-cream">
                  {stats.totalReservations}
                </div>
                <span className="font-mono text-[10px] text-caveno-gold">
                  {stats.seatedReservations} Currently Seated
                </span>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-caveno-gold">
                  <span className="font-mono text-xs uppercase tracking-wider text-caveno-muted">
                    Total Orders
                  </span>
                  <ShoppingBag size={20} />
                </div>
                <div className="font-cinzel text-3xl font-bold text-caveno-cream">
                  {stats.totalOrders}
                </div>
                <span className="font-mono text-[10px] text-amber-400">
                  {stats.pendingOrders} Active in Brewing
                </span>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-caveno-gold">
                  <span className="font-mono text-xs uppercase tracking-wider text-caveno-muted">
                    Master Menu Items
                  </span>
                  <Coffee size={20} />
                </div>
                <div className="font-cinzel text-3xl font-bold text-caveno-cream">
                  {stats.totalMenuItems}
                </div>
                <span className="font-mono text-[10px] text-caveno-muted">
                  8 Single Origin Lots Active
                </span>
              </div>
            </div>

            {/* Recent Reservations Activity Feed */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="font-cinzel text-xl text-caveno-cream">Recent Booking Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="font-mono text-[11px] text-caveno-muted uppercase border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Ref Code</th>
                      <th className="py-3 px-4">Guest Name</th>
                      <th className="py-3 px-4">Party</th>
                      <th className="py-3 px-4">Zone</th>
                      <th className="py-3 px-4">Flight Time</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reservations.slice(0, 5).map((r) => (
                      <tr key={r._id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-mono text-caveno-gold">{r.bookingRef}</td>
                        <td className="py-3 px-4 text-caveno-cream font-medium">{r.name}</td>
                        <td className="py-3 px-4 text-caveno-muted">{r.guests}</td>
                        <td className="py-3 px-4 text-caveno-muted capitalize">{r.zone.replace('-', ' ')}</td>
                        <td className="py-3 px-4 text-caveno-muted">{r.timeSlot}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono ${
                              r.status === 'Confirmed'
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                : r.status === 'Seated'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                : r.status === 'Completed'
                                ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                                : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: RESERVATIONS MANAGEMENT TABLE */}
        {activeTab === 'reservations' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filter Bar */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-caveno-muted" />
                <input
                  type="text"
                  placeholder="Search by name or ref code..."
                  value={resSearch}
                  onChange={(e) => setResSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 font-sans text-xs text-caveno-cream focus:outline-none focus:border-caveno-gold/60"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 text-xs font-mono text-caveno-muted">
                  <Filter size={14} />
                  <span>Zone:</span>
                </div>
                <select
                  value={resZoneFilter}
                  onChange={(e) => setResZoneFilter(e.target.value)}
                  className="bg-caveno-dark border border-white/10 rounded-xl px-3 py-2 text-xs text-caveno-cream focus:outline-none"
                >
                  <option value="All">All Zones</option>
                  <option value="barista-bar">Barista Bar</option>
                  <option value="velvet-lounge">Velvet Lounge</option>
                  <option value="roastery-terrace">Roastery Terrace</option>
                </select>

                <div className="flex items-center gap-2 text-xs font-mono text-caveno-muted ml-2">
                  <span>Status:</span>
                </div>
                <select
                  value={resStatusFilter}
                  onChange={(e) => setResStatusFilter(e.target.value)}
                  className="bg-caveno-dark border border-white/10 rounded-xl px-3 py-2 text-xs text-caveno-cream focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Seated">Seated</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="font-mono text-[11px] text-caveno-muted uppercase border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-4">Ref Code</th>
                    <th className="py-3.5 px-4">Guest Details</th>
                    <th className="py-3.5 px-4">Party & Date</th>
                    <th className="py-3.5 px-4">Zone & Time</th>
                    <th className="py-3.5 px-4">Occasion & Dietary</th>
                    <th className="py-3.5 px-4">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-caveno-muted">
                        No cupping reservations found.
                      </td>
                    </tr>
                  ) : (
                    reservations.map((r) => (
                      <tr key={r._id} className="hover:bg-white/[0.02]">
                        <td className="py-4 px-4 font-mono text-caveno-gold font-medium">{r.bookingRef}</td>
                        <td className="py-4 px-4 space-y-0.5">
                          <div className="text-caveno-cream font-medium">{r.name}</div>
                          <div className="text-[10px] text-caveno-muted font-mono">{r.email}</div>
                        </td>
                        <td className="py-4 px-4 space-y-0.5">
                          <div className="text-caveno-cream">{r.guests}</div>
                          <div className="text-[10px] text-caveno-muted font-mono">{r.date}</div>
                        </td>
                        <td className="py-4 px-4 space-y-0.5">
                          <div className="text-caveno-cream capitalize">{r.zone.replace('-', ' ')}</div>
                          <div className="text-[10px] text-caveno-gold">{r.timeSlot}</div>
                        </td>
                        <td className="py-4 px-4 space-y-0.5 max-w-xs">
                          <div className="text-caveno-cream">{r.occasion || 'Standard Cupping'}</div>
                          {r.dietary && (
                            <div className="text-[10px] text-amber-300/80 truncate">{r.dietary}</div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1.5">
                            {['Confirmed', 'Seated', 'Completed', 'Cancelled'].map((st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateResStatus(r._id, st)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition ${
                                  r.status === st
                                    ? 'bg-caveno-gold text-caveno-black font-semibold'
                                    : 'glass-pill text-caveno-muted hover:text-caveno-cream'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 3: LIVE KITCHEN & WAITER KANBAN BOARD */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Live Board Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-white/10">
              <div>
                <h3 className="font-cinzel text-xl text-caveno-cream">Live Barista & Kitchen Kanban</h3>
                <p className="font-sans text-xs text-caveno-muted font-light">
                  Orders auto-sync every 5 seconds. Advance orders from Pending ➔ Preparing ➔ Served in real-time.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-caveno-gold bg-caveno-gold/10 px-3 py-1.5 rounded-full border border-caveno-gold/30 flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin" />
                  Auto-Polling 5s Active
                </span>
              </div>
            </div>

            {/* 3-Column Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1: Incoming / Pending */}
              <div className="glass-card p-6 rounded-3xl border border-amber-500/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-amber-400" />
                    <h4 className="font-cinzel text-base text-caveno-cream font-medium">
                      🟡 Incoming / Pending
                    </h4>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {orders.filter(o => o.orderStatus === 'Pending').length}
                  </span>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {orders.filter(o => o.orderStatus === 'Pending').length === 0 ? (
                    <p className="text-xs text-caveno-muted font-light py-12 text-center">
                      No incoming pending orders.
                    </p>
                  ) : (
                    orders
                      .filter(o => o.orderStatus === 'Pending')
                      .map((ord) => (
                        <div
                          key={ord._id}
                          className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-amber-500/40 transition"
                        >
                          <div className="flex items-center justify-between font-mono text-xs">
                            <span className="text-caveno-gold font-semibold">
                              #{ord._id.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-caveno-cream bg-white/10 px-2 py-0.5 rounded text-[10px]">
                              {ord.tableNumber || ord.customerInfo?.tableNo || 'Table 4'}
                            </span>
                          </div>

                          <div className="font-sans text-xs">
                            <span className="text-caveno-cream font-medium block">
                              Guest: {ord.customerInfo?.name || 'Guest Connoisseur'}
                            </span>
                            <span className="text-[10px] text-caveno-muted font-mono">
                              {new Date(ord.createdAt).toLocaleTimeString()}
                            </span>
                          </div>

                          {/* Itemized list */}
                          <div className="space-y-1 border-t border-white/10 pt-2 text-xs font-mono">
                            {ord.items?.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-caveno-cream">
                                <span>
                                  {it.quantity}x {it.name}
                                </span>
                                <span className="text-[10px] text-caveno-muted">
                                  {it.grind || 'Espresso'}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                            <span className="font-mono text-xs text-caveno-gold font-bold">
                              ${ord.totalAmount?.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleUpdateOrderStatus(ord._id, 'Preparing')}
                              className="px-4 py-2 rounded-full bg-amber-500 text-caveno-black text-xs font-semibold uppercase tracking-wider hover:bg-amber-400 transition flex items-center gap-1.5 shadow-md"
                            >
                              <Flame size={14} />
                              <span>Start Brewing</span>
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Column 2: Brewing / Kitchen (Preparing) */}
              <div className="glass-card p-6 rounded-3xl border border-blue-500/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Flame size={18} className="text-blue-400 animate-pulse" />
                    <h4 className="font-cinzel text-base text-caveno-cream font-medium">
                      🔵 Brewing / Preparing
                    </h4>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {orders.filter(o => o.orderStatus === 'Preparing' || o.orderStatus === 'Ready').length}
                  </span>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {orders.filter(o => o.orderStatus === 'Preparing' || o.orderStatus === 'Ready').length === 0 ? (
                    <p className="text-xs text-caveno-muted font-light py-12 text-center">
                      No orders currently being brewed.
                    </p>
                  ) : (
                    orders
                      .filter(o => o.orderStatus === 'Preparing' || o.orderStatus === 'Ready')
                      .map((ord) => (
                        <div
                          key={ord._id}
                          className="p-4 rounded-2xl bg-white/5 border border-blue-500/20 space-y-3"
                        >
                          <div className="flex items-center justify-between font-mono text-xs">
                            <span className="text-blue-300 font-semibold">
                              #{ord._id.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-caveno-cream bg-white/10 px-2 py-0.5 rounded text-[10px]">
                              {ord.tableNumber || ord.customerInfo?.tableNo || 'Table 4'}
                            </span>
                          </div>

                          <div className="font-sans text-xs">
                            <span className="text-caveno-cream font-medium block">
                              Guest: {ord.customerInfo?.name || 'Guest Connoisseur'}
                            </span>
                          </div>

                          <div className="space-y-1 border-t border-white/10 pt-2 text-xs font-mono">
                            {ord.items?.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-caveno-cream">
                                <span>
                                  {it.quantity}x {it.name}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                            <span className="font-mono text-xs text-caveno-gold font-bold">
                              ${ord.totalAmount?.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleUpdateOrderStatus(ord._id, 'Served')}
                              className="px-4 py-2 rounded-full bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider hover:bg-blue-400 transition flex items-center gap-1.5 shadow-md"
                            >
                              <Utensils size={14} />
                              <span>Mark as Served</span>
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Column 3: Served & Completed */}
              <div className="glass-card p-6 rounded-3xl border border-emerald-500/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-400" />
                    <h4 className="font-cinzel text-base text-caveno-cream font-medium">
                      🟢 Ready & Served
                    </h4>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {orders.filter(o => o.orderStatus === 'Served').length}
                  </span>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {orders.filter(o => o.orderStatus === 'Served').length === 0 ? (
                    <p className="text-xs text-caveno-muted font-light py-12 text-center">
                      No completed served orders yet.
                    </p>
                  ) : (
                    orders
                      .filter(o => o.orderStatus === 'Served')
                      .map((ord) => (
                        <div
                          key={ord._id}
                          className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 opacity-85"
                        >
                          <div className="flex items-center justify-between font-mono text-xs text-emerald-400">
                            <span>#{ord._id.slice(-6).toUpperCase()}</span>
                            <span>Delivered to {ord.tableNumber || 'Table 4'}</span>
                          </div>

                          <div className="font-sans text-xs text-caveno-cream font-medium">
                            {ord.customerInfo?.name || 'Guest Connoisseur'}
                          </div>

                          <div className="flex justify-between border-t border-white/10 pt-2 font-mono text-xs">
                            <span className="text-caveno-muted">
                              {ord.items?.length} items
                            </span>
                            <span className="text-caveno-gold font-semibold">
                              ${ord.totalAmount?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: MASTER RESERVE MENU CRUD */}
        {activeTab === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center glass-card p-6 rounded-3xl border border-white/10">
              <div>
                <h3 className="font-cinzel text-xl text-caveno-cream">Master Reserve Collection</h3>
                <p className="font-sans text-xs text-caveno-muted font-light">
                  Manage single-origin roasts, prices, and chef special highlights in real-time.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedMenuItem(null);
                  setIsMenuModalOpen(true);
                }}
                className="px-5 py-3 rounded-full bg-caveno-gold text-caveno-black font-sans text-xs uppercase tracking-wider font-semibold flex items-center gap-2 hover:bg-caveno-amber transition shadow-lg shadow-caveno-gold/20"
              >
                <Plus size={16} />
                <span>Add New Roast / Pastry</span>
              </button>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  className="glass-card p-5 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-caveno-gold/30 transition group"
                >
                  <div className="space-y-3">
                    <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 right-3 bg-caveno-black/80 backdrop-blur-md border border-caveno-gold/30 px-3 py-1 rounded-full font-mono text-xs text-caveno-gold">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] text-caveno-gold uppercase tracking-widest block">
                        {item.category}
                      </span>
                      <h4 className="font-cinzel text-lg text-caveno-cream font-medium">
                        {item.name}
                      </h4>
                      <p className="font-sans text-xs text-caveno-muted line-clamp-2 mt-1 font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-caveno-muted">
                      {item.origin || 'Master Roast'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedMenuItem(item);
                          setIsMenuModalOpen(true);
                        }}
                        className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-caveno-gold hover:bg-caveno-gold hover:text-caveno-black transition"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => handleDeleteMenuItem(item._id)}
                        className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Menu Item Add/Edit Modal */}
      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        item={selectedMenuItem}
        onSave={() => fetchData()}
        token={adminToken}
      />
    </div>
  );
};

export default AdminDashboard;
