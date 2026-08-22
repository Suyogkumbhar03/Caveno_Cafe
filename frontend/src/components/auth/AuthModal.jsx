import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Sparkles, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [tab, setTab] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const { login, register, loading } = useUserAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let res;
    if (tab === 'signin') {
      res = await login(email, password);
    } else {
      res = await register(name, email, password, phone);
    }

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(res.message || 'Authentication failed');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-caveno-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md glass-card p-8 rounded-3xl border border-caveno-gold/30 shadow-2xl relative z-10 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-caveno-gold" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-caveno-gold">
                CAVÉNO CONNOISSEUR EXPERIENCE
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-caveno-muted hover:text-caveno-cream"
            >
              <X size={16} />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-white/10">
            <button
              type="button"
              onClick={() => {
                setTab('signin');
                setError('');
              }}
              className={`flex-1 py-3 text-xs uppercase tracking-wider font-sans border-b-2 transition ${
                tab === 'signin'
                  ? 'border-caveno-gold text-caveno-cream font-semibold'
                  : 'border-transparent text-caveno-muted hover:text-caveno-cream'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError('');
              }}
              className={`flex-1 py-3 text-xs uppercase tracking-wider font-sans border-b-2 transition ${
                tab === 'register'
                  ? 'border-caveno-gold text-caveno-cream font-semibold'
                  : 'border-transparent text-caveno-muted hover:text-caveno-cream'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-sans text-caveno-muted">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caveno-muted" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Lady / Lord Connoisseur"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans text-caveno-cream focus:outline-none focus:border-caveno-gold/60"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-sans text-caveno-muted">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caveno-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guest@domain.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans text-caveno-cream focus:outline-none focus:border-caveno-gold/60"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-sans text-caveno-muted">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caveno-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans text-caveno-cream focus:outline-none focus:border-caveno-gold/60"
                />
              </div>
            </div>

            {tab === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-sans text-caveno-muted">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caveno-muted" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans text-caveno-cream focus:outline-none focus:border-caveno-gold/60"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-caveno-gold text-caveno-black font-sans text-xs uppercase tracking-widest font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-caveno-amber transition duration-300 shadow-xl shadow-caveno-gold/20 mt-2"
            >
              <span>{loading ? 'Processing...' : tab === 'signin' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Staff Helper Link */}
          <div className="pt-3 border-t border-white/10 text-center font-mono text-[11px] text-caveno-muted">
            <span>Are you a staff member? </span>
            <Link
              to="/admin/login"
              onClick={onClose}
              className="text-caveno-gold hover:underline font-medium inline-flex items-center gap-1"
            >
              <ShieldCheck size={12} />
              <span>Access Admin Portal</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
