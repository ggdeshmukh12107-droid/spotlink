import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome, HiOutlineSearch, HiOutlineTicket, HiOutlinePlusCircle,
  HiOutlineUserGroup, HiOutlineChartBar, HiOutlineLogout, HiOutlineMenu,
  HiOutlineX, HiOutlineUser
} from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/', label: 'Home', icon: HiOutlineHome },
    { to: '/search', label: 'Find Parking', icon: HiOutlineSearch },
  ];
  if (user) {
    navLinks.push({ to: '/bookings', label: 'My Bookings', icon: HiOutlineTicket });
    if (user.role === 'owner' || user.role === 'admin') {
      navLinks.push({ to: '/my-spaces', label: 'My Spaces', icon: HiOutlinePlusCircle });
      navLinks.push({ to: '/dashboard', label: 'Dashboard', icon: HiOutlineChartBar });
    }
    if (user.societyId) navLinks.push({ to: '/guest-parking', label: 'Guest Parking', icon: HiOutlineUserGroup });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>SP</div>
            <span className="gradient-text" style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>SpotLink</span>
          </Link>

          {/* Desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s', background: isActive(link.to) ? 'rgba(99,102,241,0.15)' : 'transparent', color: isActive(link.to) ? '#a5b4fc' : 'rgba(226,232,240,0.6)' }}>
                <link.icon style={{ width: 16, height: 16 }} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setProfileOpen(!profileOpen)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px 6px 6px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: '#e2e8f0' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 10, background: 'linear-gradient(135deg, #818cf8, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{user.name}</span>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      style={{ position: 'absolute', right: 0, marginTop: 8, width: 220, borderRadius: 16, background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                      <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{user.name}</p>
                        <p style={{ fontSize: 12, color: 'rgba(226,232,240,0.4)', marginTop: 2 }}>{user.email}</p>
                        <span style={{ display: 'inline-block', marginTop: 8, padding: '2px 10px', borderRadius: 8, background: 'rgba(99,102,241,0.15)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: '#a5b4fc' }}>{user.role}</span>
                      </div>
                      <div style={{ padding: 6 }}>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, fontSize: 14, color: 'rgba(226,232,240,0.6)', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <HiOutlineUser style={{ width: 16, height: 16 }} /> Profile
                        </Link>
                        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, fontSize: 14, color: '#f87171', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <HiOutlineLogout style={{ width: 16, height: 16 }} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link to="/login" style={{ padding: '8px 18px', borderRadius: 12, fontSize: 14, fontWeight: 500, color: 'rgba(226,232,240,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}>Sign In</Link>
                <Link to="/register" className="btn-glow" style={{ padding: '8px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none' }}>Get Started</Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="show-mobile" style={{ display: 'none', padding: 8, borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', color: '#e2e8f0' }}>
              {mobileOpen ? <HiOutlineX style={{ width: 22, height: 22 }} /> : <HiOutlineMenu style={{ width: 22, height: 22 }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, fontSize: 14, fontWeight: 500, textDecoration: 'none', background: isActive(link.to) ? 'rgba(99,102,241,0.15)' : 'transparent', color: isActive(link.to) ? '#a5b4fc' : 'rgba(226,232,240,0.5)' }}>
                  <link.icon style={{ width: 18, height: 18 }} />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
