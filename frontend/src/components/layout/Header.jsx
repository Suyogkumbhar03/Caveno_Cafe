import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, X, ShoppingBag, User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUserAuth } from '../../context/UserAuthContext';
import AuthModal from '../auth/AuthModal';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const location = useLocation();
  const { cartCount, setIsCartOpen, badgeBounce } = useCart();
  const { user, isAuthenticated, logout } = useUserAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Story', path: '/#story' },
    { name: 'Reservation', path: '/reservation' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[9990] transition-all duration-500 ${
        isScrolled
          ? 'bg-caveno-black/75 backdrop-blur-xl border-b border-white/[0.08] py-4 shadow-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left Luxury Logo */}
        <Link
          to="/"
          className="font-cinzel text-2xl md:text-3xl tracking-[0.25em] text-caveno-cream font-bold group"
        >
          CAV<span className="text-caveno-gold group-hover:text-caveno-amber transition">É</span>NO
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300 relative py-1 ${
                  isActive ? 'text-caveno-gold font-semibold' : 'text-caveno-muted hover:text-caveno-cream'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-caveno-gold rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Auth Profile & Shopping Cart */}
        <div className="flex items-center gap-4">
          {/* User Auth Profile Trigger */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill border border-caveno-gold/40 text-caveno-cream hover:border-caveno-gold transition text-xs font-sans"
              >
                <div className="w-6 h-6 rounded-full bg-caveno-gold text-caveno-black font-bold font-mono flex items-center justify-center text-[10px]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <span className="hidden sm:inline font-medium text-caveno-gold">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-caveno-dark border border-white/10 rounded-2xl p-3 shadow-2xl space-y-1 z-50 text-xs font-sans">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <span className="font-mono text-[10px] text-caveno-gold uppercase tracking-wider block">Customer Account</span>
                    <span className="font-sans font-medium text-caveno-cream truncate block">{user?.name || 'Valued Guest'}</span>
                    <span className="font-mono text-[10px] text-caveno-muted truncate block">{user?.email}</span>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-caveno-cream hover:bg-white/5 transition"
                  >
                    <LayoutDashboard size={14} className="text-caveno-gold" />
                    <span>My Dashboard & Orders</span>
                  </Link>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-300 hover:bg-rose-500/10 transition text-left border-t border-white/10 mt-1 pt-2"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 rounded-full glass-pill border border-caveno-gold/40 text-caveno-gold hover:bg-caveno-gold hover:text-caveno-black transition text-xs font-sans uppercase tracking-wider font-semibold"
              >
                Sign In
              </button>

              <Link
                to="/admin/login"
                className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-caveno-muted hover:text-caveno-gold transition py-1 px-2.5 rounded-full border border-white/10 hover:border-caveno-gold/40"
              >
                <ShieldCheck size={13} className="text-caveno-gold" />
                <span>Staff Portal</span>
              </Link>
            </div>
          )}

          {/* Shopping Bag Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative p-2.5 rounded-full glass-pill text-caveno-cream hover:text-caveno-gold hover:border-caveno-gold/50 transition duration-300 ${
              badgeBounce ? 'animate-bounce border-caveno-gold' : ''
            }`}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-caveno-gold text-caveno-black font-mono text-[10px] font-bold flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full glass-pill text-caveno-cream hover:text-caveno-gold transition"
          >
            {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-full bg-caveno-dark/95 backdrop-blur-2xl border-b border-white/10 py-8 px-8 space-y-6 shadow-2xl">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="font-cinzel text-lg tracking-widest text-caveno-cream hover:text-caveno-gold transition"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="border-t border-white/10 pt-4 space-y-3">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 font-sans text-xs text-caveno-gold"
                >
                  <LayoutDashboard size={16} />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 font-sans text-xs text-rose-300"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-mono text-xs text-caveno-gold border-t border-white/10 pt-4"
              >
                <ShieldCheck size={16} />
                <span>Staff Portal</span>
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Auth Modal Trigger */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};

export default Header;
