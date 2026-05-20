import { Link } from 'react-router-dom';
import { HiOutlineHeart } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto', background: 'rgba(2,6,23,0.5)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 32px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                SP
              </div>
              <span className="gradient-text" style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>SpotLink</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(226,232,240,0.4)', maxWidth: 320, lineHeight: 1.7 }}>
              Smart decentralized parking management with predictive allocation, dynamic pricing, and blockchain-secured transactions on Sepolia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(226,232,240,0.3)', marginBottom: 20 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Search Parking', to: '/search' },
                { label: 'List Your Space', to: '/register' },
                { label: 'Guest Parking', to: '/guest-parking' },
                { label: 'Dashboard', to: '/dashboard' }
              ].map(link => (
                <li key={link.label} style={{ marginBottom: 12 }}>
                  <Link to={link.to} style={{ fontSize: 14, color: 'rgba(226,232,240,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#818cf8'}
                    onMouseLeave={e => e.target.style.color = 'rgba(226,232,240,0.4)'}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(226,232,240,0.3)', marginBottom: 20 }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map(label => (
                <li key={label} style={{ marginBottom: 12 }}>
                  <a href="#" style={{ fontSize: 14, color: 'rgba(226,232,240,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#818cf8'}
                    onMouseLeave={e => e.target.style.color = 'rgba(226,232,240,0.4)'}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 48, paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(226,232,240,0.25)' }}>© 2026 SpotLink. All rights reserved.</p>
          <p style={{ fontSize: 12, color: 'rgba(226,232,240,0.25)', display: 'flex', alignItems: 'center', gap: 6 }}>
            Built with <HiOutlineHeart style={{ width: 14, height: 14, color: '#f87171' }} /> using React, Node.js & Blockchain
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
