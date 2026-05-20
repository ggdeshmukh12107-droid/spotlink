import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData);
      toast.success('Welcome back!');
      const role = res?.user?.role;
      navigate(role === 'owner' || role === 'admin' ? '/dashboard' : '/search');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px 14px 44px', borderRadius: 14,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 14, outline: 'none', transition: 'border-color 0.2s'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px', position: 'relative', overflow: 'hidden' }}>
      {/* BG orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: '#6366f1', opacity: 0.05, filter: 'blur(80px)', top: -100, left: -100 }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: '#0ea5e9', opacity: 0.05, filter: 'blur(80px)', bottom: -100, right: -100 }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="glass-strong" style={{ width: '100%', maxWidth: 440, borderRadius: 28, padding: '48px 40px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20, marginBottom: 20, boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>SP</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ fontSize: 14, color: 'rgba(226,232,240,0.45)' }}>Sign in to continue to SpotLink</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 20, position: 'relative' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Email</label>
            <HiOutlineMail style={{ position: 'absolute', left: 14, bottom: 15, width: 18, height: 18, color: 'rgba(226,232,240,0.3)' }} />
            <input type="email" required value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} style={inputStyle} placeholder="name@example.com" />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28, position: 'relative' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Password</label>
            <HiOutlineLockClosed style={{ position: 'absolute', left: 14, bottom: 15, width: 18, height: 18, color: 'rgba(226,232,240,0.3)' }} />
            <input type={showPass ? 'text' : 'password'} required value={formData.password} onChange={e => setFormData(p => ({...p, password: e.target.value}))} style={inputStyle} placeholder="••••••••" />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, bottom: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(226,232,240,0.3)' }}>
              {showPass ? <HiOutlineEyeOff style={{ width: 18, height: 18 }} /> : <HiOutlineEye style={{ width: 18, height: 18 }} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn-glow" style={{ width: '100%', padding: '14px 24px', borderRadius: 14, color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'rgba(226,232,240,0.4)' }}>
          Don't have an account? <Link to="/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
