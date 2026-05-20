import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/endpoints';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineTruck, HiOutlineCreditCard } from 'react-icons/hi';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', vehicleNumber: '', vehicleType: 'car', walletAddress: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', vehicleNumber: user.vehicleNumber || '', vehicleType: user.vehicleType || 'car', walletAddress: user.walletAddress || '' });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.updateProfile(form);
      setUser(data.user || { ...user, ...form });
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none' };
  const readonlyStyle = { ...inputStyle, background: 'rgba(255,255,255,0.02)', color: 'rgba(226,232,240,0.6)' };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 32, marginBottom: 32 }}>
            My <span className="gradient-text">Profile</span>
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-strong" style={{ borderRadius: 24, padding: 40 }}>

          {/* Avatar + name */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 32, marginBottom: 16, boxShadow: '0 8px 32px rgba(99,102,241,0.3)' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{user?.name || 'User'}</h2>
            <span style={{ padding: '4px 14px', borderRadius: 10, background: 'rgba(99,102,241,0.12)', fontSize: 12, fontWeight: 600, color: '#a5b4fc', textTransform: 'uppercase' }}>{user?.role}</span>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>
                  <HiOutlineUser style={{ width: 14, height: 14 }} /> Full Name
                </label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} style={editing ? inputStyle : readonlyStyle} readOnly={!editing} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>
                  <HiOutlineMail style={{ width: 14, height: 14 }} /> Email
                </label>
                <input type="email" value={form.email} style={readonlyStyle} readOnly />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>
                  <HiOutlinePhone style={{ width: 14, height: 14 }} /> Phone
                </label>
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} style={editing ? inputStyle : readonlyStyle} readOnly={!editing} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>
                    <HiOutlineTruck style={{ width: 14, height: 14 }} /> Vehicle
                  </label>
                  <input type="text" value={form.vehicleNumber} onChange={e => setForm(p => ({...p, vehicleNumber: e.target.value}))} style={editing ? { ...inputStyle, textTransform: 'uppercase' } : readonlyStyle} readOnly={!editing} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Type</label>
                  <select value={form.vehicleType} onChange={e => setForm(p => ({...p, vehicleType: e.target.value}))} style={editing ? inputStyle : readonlyStyle} disabled={!editing}>
                    <option value="car">🚗 Car</option>
                    <option value="bike">🏍️ Bike</option>
                    <option value="suv">🚙 SUV</option>
                    <option value="ev">⚡ EV</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>
                  <HiOutlineCreditCard style={{ width: 14, height: 14 }} /> Wallet Address (Sepolia)
                </label>
                <input type="text" value={form.walletAddress} onChange={e => setForm(p => ({...p, walletAddress: e.target.value}))} style={editing ? inputStyle : readonlyStyle} readOnly={!editing} placeholder="0x..." />
              </div>
            </div>

            {editing ? (
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" disabled={loading} className="btn-glow" style={{ flex: 1, padding: '14px', borderRadius: 14, color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditing(false)} style={{ padding: '14px 24px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(226,232,240,0.5)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              </div>
            ) : (
              <button type="button" onClick={() => setEditing(true)} style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#a5b4fc', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Edit Profile
              </button>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
