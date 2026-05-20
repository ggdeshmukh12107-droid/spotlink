import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, cancelBooking, getMySpaces } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineCurrencyDollar, HiOutlineTicket, HiOutlineChartBar, HiOutlineClock, HiOutlineLocationMarker, HiOutlineX } from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('driver'); // 'driver' or 'owner'
  const [bookings, setBookings] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwner = user?.role === 'owner' || user?.role === 'admin';

  useEffect(() => {
    if (user) {
      if (!isOwner) {
        setActiveTab('driver');
      }
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'driver') {
        const { data } = await getMyBookings();
        setBookings(data.data || []);
      } else if (activeTab === 'owner' && isOwner) {
        const { data } = await getMySpaces();
        setSpaces(data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled successfully! 🚫');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const statusStyle = (s) => {
    const map = {
      active: { bg: 'rgba(14,165,233,0.15)', color: '#38bdf8' },
      confirmed: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
      completed: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' },
      cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' }
    };
    const c = map[s] || { bg: 'rgba(234,179,8,0.15)', color: '#facc15' };
    return { padding: '3px 10px', borderRadius: 8, background: c.bg, color: c.color, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' };
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 32, marginBottom: 4 }}>
            Welcome back, <span className="gradient-text">{user?.name || 'User'}</span>
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.45)', fontSize: 15, marginBottom: 36 }}>Track your reservations and hosted spots in real time</p>
        </motion.div>

        {/* Console Mode Tabs */}
        {isOwner && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
            <button onClick={() => setActiveTab('driver')}
              style={{
                padding: '12px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                background: activeTab === 'driver' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                color: activeTab === 'driver' ? '#fff' : 'rgba(226,232,240,0.45)',
                transition: 'all 0.3s'
              }}>
              🚘 Driver Console
            </button>
            <button onClick={() => setActiveTab('owner')}
              style={{
                padding: '12px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                background: activeTab === 'owner' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                color: activeTab === 'owner' ? '#fff' : 'rgba(226,232,240,0.45)',
                transition: 'all 0.3s'
              }}>
              🏠 Owner Console
            </button>
          </div>
        )}

        {/* Content Console */}
        {loading ? (
          <div style={{ color: 'rgba(226,232,240,0.4)', textAlign: 'center', padding: '48px 0' }}>Loading Console Data...</div>
        ) : activeTab === 'driver' ? (
          /* Driver tab: getMyBookings() */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 22, marginBottom: 20 }}>My Bookings</h2>
            {bookings.length === 0 ? (
              <div className="glass" style={{ borderRadius: 20, padding: '48px', textAlign: 'center', color: 'rgba(226,232,240,0.35)' }}>
                You have not booked any parking spaces yet.
              </div>
            ) : (
              <div className="glass-strong" style={{ borderRadius: 20, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Parking Spot', 'Time Frame', 'Amount Paid', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '16px 20px', fontSize: 12, fontWeight: 600, color: 'rgba(226,232,240,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => {
                      const spaceName = b.parkingId?.title || b.spaceName || 'Parking Space';
                      const startStr = b.startTime ? new Date(b.startTime).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
                      const endStr = b.endTime ? new Date(b.endTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';
                      const timeFrame = `${startStr} - ${endStr}`;
                      const amountPaid = b.amount || b.totalPrice || 0;

                      return (
                        <tr key={b._id || i} style={{ borderBottom: i < bookings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.2s' }}>
                          <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 500 }}>{spaceName}</td>
                          <td style={{ padding: '16px 20px', fontSize: 13, color: 'rgba(226,232,240,0.5)' }}>{timeFrame}</td>
                          <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 600, color: '#4ade80' }}>₹{amountPaid}</td>
                          <td style={{ padding: '16px 20px' }}><span style={statusStyle(b.status)}>{b.status}</span></td>
                          <td style={{ padding: '16px 20px' }}>
                            {(b.status === 'active' || b.status === 'confirmed') ? (
                              <button onClick={() => handleCancel(b._id)}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                                <HiOutlineX style={{ width: 14, height: 14 }} /> Cancel
                              </button>
                            ) : (
                              <span style={{ fontSize: 12, color: 'rgba(226,232,240,0.2)' }}>None</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        ) : (
          /* Owner tab: fetch /api/parking/mine */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 22, marginBottom: 20 }}>Hosted Parking Spaces</h2>
            {spaces.length === 0 ? (
              <div className="glass" style={{ borderRadius: 20, padding: '48px', textAlign: 'center', color: 'rgba(226,232,240,0.35)' }}>
                You have not registered any parking spaces for hosting yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
                {spaces.map((s, i) => {
                  const availableSlots = s.availableSlots ?? s.totalSlots;
                  return (
                    <motion.div key={s._id || i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="glass card-hover" style={{ borderRadius: 20, padding: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0' }}>{s.title}</h3>
                        <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(34,197,94,0.12)', color: '#4ade80', fontSize: 11, fontWeight: 700 }}>
                          {availableSlots} / {s.totalSlots} Slots Free
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.45)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                        <HiOutlineLocationMarker style={{ width: 14, height: 14, color: 'rgba(226,232,240,0.3)' }} />
                        {typeof s.address === 'object' ? `${s.address?.street}, ${s.address?.city}` : s.address}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: 12, color: 'rgba(226,232,240,0.35)' }}>Base Rate: </span>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#a5b4fc' }}>₹{s.basePrice}/hr</span>
                        </div>
                        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: 'rgba(226,232,240,0.4)' }}>
                          {s.type || s.spaceType || 'covered'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
