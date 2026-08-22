import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck, Info } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';
import { useCart } from '../context/CartContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const authContext = useUserAuth() || {};
  const login = authContext.login;

  const cartContext = useCart() || {};
  const setIsCartOpen = cartContext.setIsCartOpen;

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || location.state?.from || location.state?.redirectTo || '/dashboard';
  const redirectMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!login) {
        setError('Authentication service unavailable.');
        return;
      }
      const res = await login(email, password);
      if (res && res.success) {
        if (location.state?.openCart && setIsCartOpen) {
          setIsCartOpen(true);
        }
        navigate(from);
      } else {
        setError(res?.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-caveno-black text-caveno-cream flex items-center justify-center px-6 relative overflow-hidden z-10 font-sans">
      {/* Ambient Floating Golden Light Mesh */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [-15, 15, -15],
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-caveno-gold/10 rounded-full blur-[190px] pointer-events-none"
      />

      {/* Steam / Dark Blurred Coffee Aesthetic Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-caveno-gold/5 via-transparent to-caveno-black/90 pointer-events-none" />

      {/* Main Glassmorphic Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md glass-card p-8 sm:p-10 rounded-3xl border border-caveno-gold/30 shadow-2xl relative z-10 space-y-8 backdrop-blur-xl"
      >
        {/* Top Navigation: Return to CAVÉNO */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill border border-white/10 text-xs font-sans text-caveno-muted hover:text-caveno-gold hover:border-caveno-gold/40 transition-all duration-300"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300 text-caveno-gold" />
            <span>Return to CAVÉNO</span>
          </Link>

          <span className="font-mono text-[10px] text-caveno-gold/80 uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck size={13} /> SECURE
          </span>
        </div>

        {/* Branding Header */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full glass-pill border border-caveno-gold/40 text-caveno-gold mb-1">
            <Sparkles size={20} />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-caveno-gold block font-light">
            CAVÉNO MEMBER PORTAL
          </span>
          <h1 className="font-cinzel text-3xl text-caveno-cream font-medium tracking-wider uppercase">
            SIGN IN
          </h1>
          <p className="font-sans text-xs text-caveno-muted font-light leading-relaxed">
            Enter your email & password to access live reservations, order history, and exclusive member perks.
          </p>
        </div>

        {/* Redirect Info Banner */}
        {redirectMessage && (
          <div className="p-3.5 rounded-xl bg-caveno-gold/15 border border-caveno-gold/40 text-caveno-gold text-xs font-sans flex items-center gap-2.5 shadow-lg">
            <Info size={16} className="shrink-0 text-caveno-gold" />
            <span>{redirectMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-center gap-2.5">
            <span className="shrink-0 text-rose-400">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="font-sans text-xs text-caveno-muted">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-caveno-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 font-sans text-xs text-caveno-cream placeholder-caveno-muted/40 focus:outline-none focus:ring-1 focus:ring-caveno-gold/50 focus:border-caveno-gold focus:bg-white/[0.08] transition duration-300"
                placeholder="connoisseur@caveno.com"
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
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 font-sans text-xs text-caveno-cream placeholder-caveno-muted/40 focus:outline-none focus:ring-1 focus:ring-caveno-gold/50 focus:border-caveno-gold focus:bg-white/[0.08] transition duration-300"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-caveno-gold text-caveno-black font-sans text-xs uppercase tracking-widest font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-caveno-amber transition duration-300 shadow-xl shadow-caveno-gold/20 mt-3 group"
          >
            <span>{loading ? 'Authenticating...' : 'SIGN IN TO CAVÉNO'}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="text-center font-mono text-[11px] text-caveno-muted pt-2 border-t border-white/10">
          Staff or Management?{' '}
          <Link to="/admin/login" className="text-caveno-gold hover:underline">
            Admin Portal Access
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
