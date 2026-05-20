import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getParkingById, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineStar, HiOutlineCurrencyDollar, HiOutlineShieldCheck } from 'react-icons/hi';

const formatDateTime = (date) => {
  const pad = (n) => n.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

const BookParking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pre-populate with realistic defaults (Start: now, End: in 2 hours)
  const [booking, setBooking] = useState(() => {
    const now = new Date();
    const future = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return {
      startTime: formatDateTime(now),
      endTime: formatDateTime(future),
      vehicleNumber: user?.vehicleNumber || '',
      vehicleType: user?.vehicleType || 'car'
    };
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await getParkingById(id);
        setSpace(data.data);
      } catch (err) {
        toast.error('Failed to load parking spot details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const calcDurationHours = () => {
    if (!booking.startTime || !booking.endTime) return 0;
    const durationMs = new Date(booking.endTime) - new Date(booking.startTime);
    return Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
  };

  const calcPrice = () => {
    if (!space) return 0;
    const hours = calcDurationHours();
    return hours * (space.dynamicPrice || space.basePrice);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      const payload = {
        parkingId: id,
        startTime: booking.startTime,
        endTime: booking.endTime,
        vehicleNumber: user?.vehicleNumber || booking.vehicleNumber,
        vehicleType: user?.vehicleType || booking.vehicleType
      };
      const { data } = await createBooking(payload);
      const bookingId = data.data?._id || data.data?.id || '';
      toast.success(`Booking confirmed! 🎉 ID: ${bookingId}`);
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none' };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(226,232,240,0.4)' }}>Loading...</div>;
  if (!space) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(226,232,240,0.4)' }}>Parking space not found</div>;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 32, marginBottom: 32 }}>
            Book <span className="gradient-text">Parking</span>
          </h1>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'start' }}>
          {/* Space details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass" style={{ borderRadius: 24, overflow: 'hidden' }}>
            <div style={{ height: 200, background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(14,165,233,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 48 }}>🅿️</span>
            </div>
            <div style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(99,102,241,0.12)', fontSize: 11, fontWeight: 600, color: '#a5b4fc', textTransform: 'uppercase' }}>{space.type || space.spaceType}</span>
                {space.demandFactor > 1.2 && <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(234,179,8,0.12)', fontSize: 11, fontWeight: 600, color: '#facc15' }}>🔥 High Demand</span>}
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{space.title}</h2>
              <p style={{ fontSize: 14, color: 'rgba(226,232,240,0.35)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                <HiOutlineLocationMarker style={{ width: 16, height: 16 }} />
                {typeof space.address === 'object' ? `${space.address?.street}, ${space.address?.city}` : space.address}
              </p>

              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div className="glass" style={{ borderRadius: 14, padding: 16, textAlign: 'center' }}>
                  <HiOutlineCurrencyDollar style={{ width: 20, height: 20, margin: '0 auto 6px', color: '#4ade80' }} />
                  <div style={{ fontSize: 18, fontWeight: 700 }}>₹{space.dynamicPrice || space.basePrice}</div>
                  <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.35)' }}>per hour</div>
                </div>
                <div className="glass" style={{ borderRadius: 14, padding: 16, textAlign: 'center' }}>
                  <HiOutlineStar style={{ width: 20, height: 20, margin: '0 auto 6px', color: '#facc15' }} />
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{space.rating?.average?.toFixed(1) || '4.5'}</div>
                  <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.35)' }}>{space.rating?.count || 12} reviews</div>
                </div>
              </div>

              {/* Amenities */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(space.amenities || []).map((a, i) => (
                  <span key={i} style={{ padding: '6px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', fontSize: 12, color: 'rgba(226,232,240,0.5)', fontWeight: 500 }}>
                    {a === 'covered' ? '🏗️' : a === 'cctv' ? '📹' : a === 'lighting' ? '💡' : a === 'ev_charging' ? '⚡' : a === 'security' ? '🔒' : '✓'} {a.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Booking form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-strong" style={{ borderRadius: 24, padding: 32 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 24 }}>Reserve Your Spot</h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Start Time</label>
                <input type="datetime-local" required value={booking.startTime} onChange={e => setBooking(p => ({...p, startTime: e.target.value}))} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>End Time</label>
                <input type="datetime-local" required value={booking.endTime} onChange={e => setBooking(p => ({...p, endTime: e.target.value}))} style={inputStyle} />
              </div>
              {/* Vehicle Info: Show gorgeous read-only badge if already saved in profile to prevent duplicate entries */}
              {user?.vehicleNumber ? (
                <div className="glass" style={{ borderRadius: 16, padding: '16px 20px', marginBottom: 24, border: '1px dashed rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.03)' }}>
                  <div style={{ fontSize: 12, color: 'rgba(226,232,240,0.4)', marginBottom: 6 }}>Registered Vehicle (From Profile)</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.5px', color: '#e2e8f0' }}>🚗 {user.vehicleNumber.toUpperCase()}</span>
                    <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', fontSize: 11, fontWeight: 600, color: '#a5b4fc', textTransform: 'uppercase' }}>{user.vehicleType || 'Car'}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Vehicle Number</label>
                    <input type="text" required value={booking.vehicleNumber} onChange={e => setBooking(p => ({...p, vehicleNumber: e.target.value}))} style={{ ...inputStyle, textTransform: 'uppercase' }} placeholder="MH 01 AB 1234" />
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Vehicle Type</label>
                    <select value={booking.vehicleType} onChange={e => setBooking(p => ({...p, vehicleType: e.target.value}))} style={inputStyle}>
                      <option value="car">🚗 Car</option>
                      <option value="bike">🏍️ Bike</option>
                      <option value="suv">🚙 SUV</option>
                      <option value="ev">⚡ EV</option>
                    </select>
                  </div>
                </>
              )}

              {/* Price summary */}
              <div className="glass" style={{ borderRadius: 16, padding: 20, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'rgba(226,232,240,0.4)' }}>
                  <span>Rate</span><span>₹{space.dynamicPrice || space.basePrice}/hour</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'rgba(226,232,240,0.4)' }}>
                  <span>Duration</span><span>{calcDurationHours()} hours</span>
                </div>
                {space.demandFactor && space.demandFactor !== 1 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'rgba(226,232,240,0.4)' }}>
                    <span>Demand Factor</span><span>{space.demandFactor}x</span>
                  </div>
                )}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 700 }}>
                  <span>Total</span><span className="gradient-text">₹{calcPrice()}</span>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn-glow" style={{ width: '100%', padding: '16px', borderRadius: 14, color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'Confirming...' : `Confirm & Pay ₹${calcPrice()}`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, fontSize: 12, color: 'rgba(226,232,240,0.25)' }}>
                <HiOutlineShieldCheck style={{ width: 14, height: 14 }} /> Secured by blockchain
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookParking;
