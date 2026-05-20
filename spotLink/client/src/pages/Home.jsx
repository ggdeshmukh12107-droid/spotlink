import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineLocationMarker, HiOutlineCurrencyDollar,
  HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineLightningBolt,
  HiOutlineBell, HiOutlineSearch, HiOutlineCreditCard, HiOutlineCheck
} from 'react-icons/hi';

const features = [
  { icon: HiOutlineLocationMarker, title: 'Smart Discovery', desc: 'Find nearby parking spots in real-time with map-based search and availability filters.', color: 'from-blue-500 to-cyan-400' },
  { icon: HiOutlineCurrencyDollar, title: 'Dynamic Pricing', desc: 'Prices adjust based on demand — save during off-peak hours, premium during rush.', color: 'from-emerald-500 to-teal-400' },
  { icon: HiOutlineUserGroup, title: 'Guest Parking', desc: 'Residents can pre-assign guest slots with QR verification and conflict detection.', color: 'from-purple-500 to-pink-400' },
  { icon: HiOutlineShieldCheck, title: 'Blockchain Secured', desc: 'Every booking is recorded on Ethereum Sepolia — tamper-proof and transparent.', color: 'from-orange-500 to-amber-400' },
  { icon: HiOutlineLightningBolt, title: 'Predictive AI', desc: 'Historical data analysis predicts future availability to help you plan ahead.', color: 'from-rose-500 to-red-400' },
  { icon: HiOutlineBell, title: 'Live Alerts', desc: 'Get notified instantly when a spot opens up near you with vacate alerts.', color: 'from-indigo-500 to-violet-400' }
];


const steps = [
  { num: '01', icon: HiOutlineSearch, title: 'Search', desc: 'Find available parking near your destination using our smart map and filters.', color: 'from-blue-500 to-cyan-400' },
  { num: '02', icon: HiOutlineCreditCard, title: 'Book & Pay', desc: 'Reserve your spot instantly with transparent dynamic pricing in seconds.', color: 'from-emerald-500 to-teal-400' },
  { num: '03', icon: HiOutlineCheck, title: 'Park & Go', desc: 'Navigate to your spot, scan QR to verify, and park with total confidence.', color: 'from-green-500 to-emerald-400' }
];

const Home = () => {
  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ────────── HERO ────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* BG orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: '#6366f1', opacity: 0.06, filter: 'blur(80px)', top: -100, left: -100 }} />
          <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: '#0ea5e9', opacity: 0.06, filter: 'blur(80px)', bottom: -100, right: -100 }} />
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: '#8b5cf6', opacity: 0.05, filter: 'blur(60px)', top: '35%', left: '45%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, #020617)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto', padding: '120px 24px 80px', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, color: '#a5b4fc', marginBottom: 32 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
              Powered by Blockchain & AI
            </div>

            {/* Heading */}
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, lineHeight: 1.05, marginBottom: 32 }}>
              <span className="gradient-text" style={{ display: 'block', fontSize: 'clamp(3rem, 8vw, 6rem)' }}>Smart Parking</span>
              <span style={{ display: 'block', fontSize: 'clamp(3rem, 8vw, 6rem)', color: '#fff', marginTop: 8 }}>Simplified</span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(226,232,240,0.55)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
              Discover, book, and monetize parking spaces with dynamic pricing, predictive availability, and blockchain-secured transactions.
            </p>

            {/* CTA */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 72 }}>
              <Link to="/search" className="btn-glow" style={{ padding: '16px 40px', borderRadius: 16, color: '#fff', fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>
                Find Parking Now
              </Link>
              <Link to="/register" className="glass" style={{ padding: '16px 40px', borderRadius: 16, color: '#fff', fontWeight: 600, fontSize: 16, textDecoration: 'none', transition: 'background 0.3s' }}>
                List Your Space →
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      {/* ────────── FEATURES ────────── */}
      <section style={{ padding: '120px 24px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)', maxWidth: 500, margin: '0 auto 80px' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 16 }}>
            Everything You Need in <span className="gradient-text">One Platform</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(226,232,240,0.45)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            From finding a spot to resolving conflicts — SpotLink handles it all.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="glass card-hover"
              style={{ borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column' }}
            >
              <div className={`bg-gradient-to-br ${f.color}`} style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                <f.icon style={{ width: 28, height: 28, color: '#fff' }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#e2e8f0' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(226,232,240,0.45)', lineHeight: 1.7, flex: 1 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ────────── HOW IT WORKS ────────── */}
      <section style={{ padding: '120px 24px', maxWidth: 1000, margin: '0 auto' }}>
        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)', maxWidth: 500, margin: '0 auto 80px' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 12 }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(226,232,240,0.45)', maxWidth: 400, margin: '0 auto' }}>
            Three simple steps to parking bliss.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
                <div className={`bg-gradient-to-br ${item.color}`} style={{ width: 80, height: 80, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 32px rgba(0,0,0,0.3)' }}>
                  <item.icon style={{ width: 36, height: 36, color: '#fff' }} />
                </div>
                <span style={{ position: 'absolute', top: -8, right: -8, width: 30, height: 30, borderRadius: '50%', background: '#0f172a', border: '2px solid rgba(99,102,241,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#a5b4fc' }}>
                  {item.num}
                </span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: '#e2e8f0' }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(226,232,240,0.45)', lineHeight: 1.7, maxWidth: 260, margin: '0 auto' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ────────── CTA ────────── */}
      <section style={{ padding: '80px 24px 120px', maxWidth: 900, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong"
          style={{ borderRadius: 32, padding: 'clamp(48px, 6vw, 80px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(14,165,233,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 20 }}>
              Ready to Find Your <span className="gradient-text">Perfect Spot</span>?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(226,232,240,0.45)', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
              Join thousands of drivers who save time and money with SpotLink's intelligent parking platform.
            </p>
            <Link to="/register" className="btn-glow" style={{ padding: '18px 48px', borderRadius: 16, color: '#fff', fontWeight: 600, fontSize: 18, textDecoration: 'none', display: 'inline-block' }}>
              Get Started Free
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
