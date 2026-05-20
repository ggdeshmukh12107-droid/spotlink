import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlinePhone, HiOutlineTruck } from 'react-icons/hi';

const roles = [
  { value: 'driver', label: 'Find Parking', emoji: '🚗' },
  { value: 'owner', label: 'List Spaces', emoji: '🏠' }
];

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'driver', phone: '', vehicleNumber: '', vehicleType: 'car'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await registerUser(formData);
      toast.success('Account created! 🎉');
      navigate(formData.role === 'driver' ? '/search' : '/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 14,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 14, outline: 'none'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', position: 'relative', overflow: 'hidden' }}>
      {/* BG orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: '#8b5cf6', opacity: 0.05, filter: 'blur(80px)', top: -50, right: -100 }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: '#0ea5e9', opacity: 0.05, filter: 'blur(80px)', bottom: -100, left: -100 }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="glass-strong" style={{ width: '100%', maxWidth: 520, borderRadius: 28, padding: '48px 40px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20, marginBottom: 20, boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>SP</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, marginBottom: 8 }}>Create Account</h1>
          <p style={{ fontSize: 14, color: 'rgba(226,232,240,0.45)' }}>Join SpotLink and never circle for parking again</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name + Email row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} style={inputStyle} placeholder="John Doe" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Email</label>
              <input type="email" required value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} style={inputStyle} placeholder="name@example.com" />
            </div>
          </div>

          {/* Password row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Password</label>
              <input type="password" required value={formData.password} onChange={e => setFormData(p => ({...p, password: e.target.value}))} style={inputStyle} placeholder="Min 6 chars" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Confirm Password</label>
              <input type="password" required value={formData.confirmPassword} onChange={e => setFormData(p => ({...p, confirmPassword: e.target.value}))} style={inputStyle} placeholder="Re-enter" />
            </div>
          </div>

          {/* Role selector */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 10 }}>I want to</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {roles.map(r => (
                <button key={r.value} type="button" onClick={() => setFormData(p => ({...p, role: r.value}))}
                  style={{ padding: '14px 12px', borderRadius: 14, border: formData.role === r.value ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)', background: formData.role === r.value ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', color: '#e2e8f0' }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{r.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Phone + Vehicle Number */}
          <div style={{ display: formData.role === 'driver' ? 'grid' : 'block', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Phone</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))} style={inputStyle} placeholder="+91 98765 43210" />
            </div>
            {formData.role === 'driver' && (
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Vehicle Number</label>
                <input type="text" value={formData.vehicleNumber} onChange={e => setFormData(p => ({...p, vehicleNumber: e.target.value}))} style={{ ...inputStyle, textTransform: 'uppercase' }} placeholder="MH 01 AB 1234" />
              </div>
            )}
          </div>

          {/* Vehicle Type (Only for Drivers) */}
          {formData.role === 'driver' && (
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Vehicle Type</label>
              <select value={formData.vehicleType} onChange={e => setFormData(p => ({...p, vehicleType: e.target.value}))} style={inputStyle}>
                <option value="car">🚗 Car</option>
                <option value="bike">🏍️ Bike</option>
                <option value="suv">🚙 SUV</option>
                <option value="ev">⚡ EV</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-glow" style={{ width: '100%', padding: '14px 24px', borderRadius: 14, color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'rgba(226,232,240,0.4)' }}>
          Already have an account? <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
