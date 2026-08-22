import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, Mail, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message || 'Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-caveno-black text-caveno-cream flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-caveno-gold/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass-card p-8 sm:p-10 rounded-3xl border border-caveno-gold/30 shadow-2xl relative z-10 space-y-8"
      >
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full glass-pill border border-caveno-gold/40 text-caveno-gold mb-2">
            <Sparkles size={20} />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-caveno-gold block font-light">
            CAVÉNO MANAGEMENT ATELIER
          </span>
          <h1 className="font-cinzel text-3xl text-caveno-cream font-medium tracking-wider uppercase">
            ADMIN LOGIN
          </h1>
          <p className="font-sans text-xs text-caveno-muted font-light">
            Sign in with authorized administrator credentials to access real-time seating & order telemetry.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="font-sans text-xs text-caveno-muted">Admin Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-caveno-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 font-sans text-xs text-caveno-cream focus:outline-none focus:border-caveno-gold/60 transition"
                placeholder="admin@caveno.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-sans text-xs text-caveno-muted">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-caveno-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 font-sans text-xs text-caveno-cream focus:outline-none focus:border-caveno-gold/60 transition"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-caveno-gold text-caveno-black font-sans text-xs uppercase tracking-widest font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-caveno-amber transition duration-300 shadow-xl shadow-caveno-gold/20 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'ADMIN LOGIN'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
