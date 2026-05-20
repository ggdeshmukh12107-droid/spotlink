import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { bookingService } from '../services/endpoints';
import toast from 'react-hot-toast';
import { HiOutlineTicket, HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineBell, HiOutlineX } from 'react-icons/hi';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try { 
      const { data } = await bookingService.getMyBookings(); 
      setBookings(data.data || []); 
    } catch { 
      setBookings([]); 
      toast.error('Failed to retrieve active bookings');
    } finally { 
      setLoading(false); 
    }
  };

  const handleCancel = async (id) => {
    try { 
      await bookingService.cancel(id); 
      toast.success('Booking cancelled successfully! 🚫'); 
      fetchBookings(); 
    } catch (e) { 
      toast.error(e.response?.data?.message || 'Failed to cancel booking'); 
    }
  };

  const handleVacate = async (id) => {
    try { await bookingService.vacateAlert(id, { estimatedLeaveTime: new Date().toISOString() }); toast.success('Vacate alert sent!'); }
    catch { toast.error('Failed'); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const statusStyle = (s) => {
    const map = {
      confirmed: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
      active: { bg: 'rgba(14,165,233,0.15)', color: '#38bdf8', border: 'rgba(14,165,233,0.3)' },
      completed: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', border: 'rgba(148,163,184,0.3)' },
      cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
      pending: { bg: 'rgba(234,179,8,0.15)', color: '#facc15', border: 'rgba(234,179,8,0.3)' }
    };
    const c = map[s] || map.pending;
    return { padding: '3px 10px', borderRadius: 8, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' };
  };

  const tabs = ['all', 'confirmed', 'active', 'completed', 'cancelled'];

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 32, marginBottom: 8 }}>
            My <span className="gradient-text">Bookings</span>
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.45)', fontSize: 15, marginBottom: 28 }}>Track and manage your parking reservations</p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 4 }}>
            {tabs.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '10px 20px', borderRadius: 14, fontSize: 13, fontWeight: 600, textTransform: 'capitalize', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', border: filter === f ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.08)', background: filter === f ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)', color: filter === f ? '#a5b4fc' : 'rgba(226,232,240,0.4)' }}>
                {f}
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[1,2,3].map(i => (
                <div key={i} className="glass" style={{ borderRadius: 20, padding: 28 }}>
                  <div style={{ height: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 8, width: '40%', marginBottom: 12 }} />
                  <div style={{ height: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 8, width: '60%' }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass" style={{ borderRadius: 20, padding: '64px 24px', textAlign: 'center' }}>
              <HiOutlineTicket style={{ width: 48, height: 48, margin: '0 auto 16px', color: 'rgba(226,232,240,0.15)' }} />
              <p style={{ color: 'rgba(226,232,240,0.35)', fontSize: 15 }}>No bookings found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filtered.map((b, i) => (
                <motion.div key={b._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass card-hover" style={{ borderRadius: 20, padding: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 600, color: '#e2e8f0' }}>
                          {b.spaceId?.title || b.spaceName || 'Parking Space'}
                        </h3>
                        <span style={statusStyle(b.status)}>{b.status}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'rgba(226,232,240,0.35)', marginBottom: 8 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <HiOutlineClock style={{ width: 14, height: 14 }} />
                          {new Date(b.startTime).toLocaleString()} — {new Date(b.endTime).toLocaleTimeString()}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <HiOutlineCurrencyDollar style={{ width: 14, height: 14 }} />
                          ₹{b.totalPrice}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: 'rgba(226,232,240,0.25)' }}>🚗 {b.vehicleNumber} · Code: {b.bookingCode}</p>
                    </div>

                    {(b.status === 'active' || b.status === 'confirmed') && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleVacate(b._id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 12, background: 'rgba(14,165,233,0.12)', color: '#38bdf8', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                          <HiOutlineBell style={{ width: 14, height: 14 }} /> Vacate
                        </button>
                        <button onClick={() => handleCancel(b._id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 12, background: 'rgba(239,68,68,0.12)', color: '#f87171', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                          <HiOutlineX style={{ width: 14, height: 14 }} /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Demo fallbacks removed to ensure 100% production database-driven rendering

export default MyBookings;
