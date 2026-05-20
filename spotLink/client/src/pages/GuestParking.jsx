import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { registerGuest, verifyGuestCode, getMyGuests } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineClipboardCopy, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

const GuestParking = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [lastRegisteredCode, setLastRegisteredCode] = useState(null);

  const [form, setForm] = useState({
    guestName: '',
    guestVehicle: '',
    slotAssigned: '',
    validUntil: ''
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const { data } = await getMyGuests();
      setGuests(data.data || []);
    } catch {
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLastRegisteredCode(null);
    try {
      const { data } = await registerGuest(form);
      const returnedCode = data.code || data.data?.verificationCode;
      
      setLastRegisteredCode(returnedCode);
      toast.success('Visitor guest registered successfully! 🎉');
      
      // Clear form
      setForm({ guestName: '', guestVehicle: '', slotAssigned: '', validUntil: '' });
      fetchGuests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register guest');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verifyCode) return;
    setVerificationResult(null);
    try {
      const { data } = await verifyGuestCode(verifyCode);
      setVerificationResult(data);
      toast.success(`Guest verified successfully! ✅ Slot: ${data.slotAssigned}`);
      setVerifyCode('');
      fetchGuests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired code');
    }
  };

  const handleCopyCode = () => {
    if (lastRegisteredCode) {
      navigator.clipboard.writeText(lastRegisteredCode);
      toast.success('Code copied to clipboard! 📋');
    }
  };

  const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none' };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 32, marginBottom: 8 }}>
                Guest <span className="gradient-text">Parking</span>
              </h1>
              <p style={{ color: 'rgba(226,232,240,0.45)', fontSize: 15 }}>Manage visitor parking for your society</p>
            </div>
            <button onClick={() => { setShowForm(!showForm); setLastRegisteredCode(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 14, background: showForm ? 'rgba(239,68,68,0.12)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: showForm ? 'none' : '0 4px 24px rgba(99,102,241,0.35)' }}>
              {showForm ? <><HiOutlineX style={{ width: 16, height: 16 }} /> Cancel</> : <><HiOutlinePlus style={{ width: 16, height: 16 }} /> Register Guest</>}
            </button>
          </div>
        </motion.div>

        {/* Verification code result banner */}
        {lastRegisteredCode && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="glass" style={{ borderRadius: 20, padding: 32, marginBottom: 32, textAlign: 'center', border: '1px solid rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.08)' }}>
            <p style={{ fontSize: 14, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Share this verification code with your visitor</p>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#a5b4fc', letterSpacing: 4, marginBottom: 16 }}>{lastRegisteredCode}</div>
            <button onClick={handleCopyCode} className="btn-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 600 }}>
              <HiOutlineClipboardCopy style={{ width: 16, height: 16 }} /> Copy Code
            </button>
          </motion.div>
        )}

        {/* Verify bar */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-strong" style={{ borderRadius: 20, padding: 24, marginBottom: 32 }}>
          <form onSubmit={handleVerify} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <HiOutlineShieldCheck style={{ width: 22, height: 22, color: '#4ade80', flexShrink: 0 }} />
            <input type="text" placeholder="Enter guest verification code..." value={verifyCode} onChange={e => setVerifyCode(e.target.value.toUpperCase())} style={{ ...inputStyle, flex: 1 }} required />
            <button type="submit" className="btn-glow" style={{ padding: '14px 28px', borderRadius: 14, color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Verify</button>
          </form>

          {/* Verification Results details */}
          {verificationResult && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 16, padding: '16px 20px', borderRadius: 12, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', fontSize: 14 }}>
              <span style={{ color: '#4ade80', fontWeight: 600 }}>Verification Successful: </span>
              Registered visitor <strong style={{ color: '#fff' }}>{verificationResult.guestName}</strong> has been authorized to park at slot <strong style={{ color: '#fff' }}>{verificationResult.slotAssigned}</strong>.
            </motion.div>
          )}
        </motion.div>

        {/* Registration form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="glass" style={{ borderRadius: 20, padding: 32, marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Register New Guest</h3>
            <form onSubmit={handleRegister}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Guest Name</label>
                  <input type="text" required value={form.guestName} onChange={e => setForm(p => ({...p, guestName: e.target.value}))} style={inputStyle} placeholder="John Doe" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Vehicle Number</label>
                  <input type="text" required value={form.guestVehicle} onChange={e => setForm(p => ({...p, guestVehicle: e.target.value}))} style={{ ...inputStyle, textTransform: 'uppercase' }} placeholder="MH 01 AB 5678" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Assigned Slot</label>
                  <input type="text" required value={form.slotAssigned} onChange={e => setForm(p => ({...p, slotAssigned: e.target.value}))} style={inputStyle} placeholder="Slot B-12" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Validity Limit (Until)</label>
                  <input type="datetime-local" required value={form.validUntil} onChange={e => setForm(p => ({...p, validUntil: e.target.value}))} style={inputStyle} />
                </div>
              </div>
              <button type="submit" className="btn-glow" style={{ padding: '14px 32px', borderRadius: 14, color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                Register Guest
              </button>
            </form>
          </motion.div>
        )}

        {/* Guest list */}
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Visitor History</h2>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1,2,3].map(i => <div key={i} className="glass" style={{ borderRadius: 20, padding: 28, height: 80 }} />)}
          </div>
        ) : guests.length === 0 ? (
          <div className="glass" style={{ borderRadius: 20, padding: '64px 24px', textAlign: 'center' }}>
            <HiOutlineUserGroup style={{ width: 48, height: 48, margin: '0 auto 16px', color: 'rgba(226,232,240,0.15)' }} />
            <p style={{ color: 'rgba(226,232,240,0.35)', fontSize: 15 }}>No guest registrations yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {guests.map((g, i) => (
              <motion.div key={g._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass card-hover" style={{ borderRadius: 20, padding: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600 }}>{g.guestName}</h3>
                    <span style={{ padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                      background: g.status === 'verified' || g.status === 'active' ? 'rgba(34,197,94,0.15)' : g.status === 'violation' ? 'rgba(239,68,68,0.15)' : 'rgba(234,179,8,0.15)',
                      color: g.status === 'verified' || g.status === 'active' ? '#4ade80' : g.status === 'violation' ? '#f87171' : '#facc15'
                    }}>{g.status}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.35)' }}>
                    🚗 {g.guestVehicle || g.guestVehicleNumber} · Code: <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{g.verificationCode}</span> · Assigned: {g.slotAssigned}
                  </p>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(226,232,240,0.25)', textAlign: 'right' }}>
                  Valid Until: {new Date(g.validUntil).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestParking;
