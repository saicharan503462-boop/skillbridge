import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center group-hover:bg-brand-400 transition-colors">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 14L9 4L15 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.5 10H12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
    <span className="font-display font-bold text-lg text-white">SkillBridge</span>
  </Link>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `font-display font-medium text-sm transition-colors duration-200 ${
      isActive ? 'text-brand-400' : 'text-gray-400 hover:text-gray-100'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-lg border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/explore" className={navLinkClass}>Explore</NavLink>
            {user && <NavLink to="/upload" className={navLinkClass}>Upload</NavLink>}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={`/profile/${user._id}`}
                  className="flex items-center gap-2 hover:bg-surface-card px-3 py-1.5 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-800 border border-brand-600 flex items-center justify-center">
                    <span className="text-brand-300 text-sm font-display font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-display text-gray-300">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="btn-ghost text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Log in</Link>
                <Link to="/signup" className="btn-primary text-sm py-2">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface-secondary border-b border-surface-border px-4 py-4 space-y-3 animate-slide-up">
          <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <div />
          <NavLink to="/explore" className={navLinkClass} onClick={() => setMenuOpen(false)}>Explore</NavLink>
          <div />
          {user && (
            <>
              <NavLink to="/upload" className={navLinkClass} onClick={() => setMenuOpen(false)}>Upload</NavLink>
              <div />
              <Link
                to={`/profile/${user._id}`}
                className="block text-sm font-display text-gray-400 hover:text-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <div />
              <button onClick={handleLogout} className="text-sm font-display text-red-400 hover:text-red-300">
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="block text-sm font-display text-gray-400 hover:text-gray-100" onClick={() => setMenuOpen(false)}>Log in</Link>
              <div />
              <Link to="/signup" className="block text-sm font-display text-brand-400 hover:text-brand-300" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
