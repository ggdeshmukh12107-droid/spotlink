import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { parkingService } from '../services/endpoints';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX, HiOutlineLocationMarker } from 'react-icons/hi';

const MySpaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', spaceType: 'residential', basePrice: '', totalSpots: '', street: '', city: '', amenities: [] });

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    setLoading(true);
    try { 
      const { data } = await parkingService.getOwnerSpaces(); 
      setSpaces(data.data || []); 
    } catch { 
      setSpaces([]); 
      toast.error('Failed to load owned parking spaces');
    } finally { 
      setLoading(false); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { 
        await parkingService.update(editing, form); 
        toast.success('Parking space updated! 🏠'); 
      } else { 
        await parkingService.create(form); 
        toast.success('Parking space created! 🏠'); 
      }
      setShowForm(false); 
      setEditing(null);
      fetchSpaces();
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to submit parking space'); 
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this space?')) return;
    try { await parkingService.delete(id); toast.success('Deleted'); setSpaces(s => s.filter(x => x._id !== id)); }
    catch { toast.error('Failed'); }
  };

  const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none' };

  const amenityList = ['covered', 'cctv', 'lighting', 'ev_charging', 'security', 'wheelchair'];
  const toggleAmenity = (a) => setForm(p => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a] }));

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 32, marginBottom: 8 }}>
                My <span className="gradient-text">Spaces</span>
              </h1>
              <p style={{ color: 'rgba(226,232,240,0.45)', fontSize: 15 }}>Manage your parking listings</p>
            </div>
            <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', spaceType: 'residential', basePrice: '', totalSpots: '', street: '', city: '', amenities: [] }); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 14, background: showForm ? 'rgba(239,68,68,0.12)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: showForm ? 'none' : '0 4px 24px rgba(99,102,241,0.35)' }}>
              {showForm ? <><HiOutlineX style={{ width: 16, height: 16 }} /> Cancel</> : <><HiOutlinePlus style={{ width: 16, height: 16 }} /> Add Space</>}
            </button>
          </div>
        </motion.div>

        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ borderRadius: 20, padding: 32, marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>{editing ? 'Edit Space' : 'Add New Space'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Title</label>
                <input type="text" required value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} style={inputStyle} placeholder="e.g. Green Valley - Basement Parking" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Type</label>
                  <select value={form.spaceType} onChange={e => setForm(p => ({...p, spaceType: e.target.value}))} style={inputStyle}>
                    <option value="residential">🏠 Residential</option>
                    <option value="commercial">🏢 Commercial</option>
                    <option value="institutional">🏫 Institutional</option>
                    <option value="private">🔒 Private</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Base Price (₹/hr)</label>
                  <input type="number" required value={form.basePrice} onChange={e => setForm(p => ({...p, basePrice: e.target.value}))} style={inputStyle} placeholder="50" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Total Spots</label>
                  <input type="number" required value={form.totalSpots} onChange={e => setForm(p => ({...p, totalSpots: e.target.value}))} style={inputStyle} placeholder="10" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>Street</label>
                  <input type="text" value={form.street} onChange={e => setForm(p => ({...p, street: e.target.value}))} style={inputStyle} placeholder="MG Road" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 8 }}>City</label>
                  <input type="text" value={form.city} onChange={e => setForm(p => ({...p, city: e.target.value}))} style={inputStyle} placeholder="Mumbai" />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(226,232,240,0.5)', marginBottom: 10 }}>Amenities</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {amenityList.map(a => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      style={{ padding: '8px 14px', borderRadius: 10, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize', border: form.amenities.includes(a) ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.08)', background: form.amenities.includes(a) ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', color: form.amenities.includes(a) ? '#a5b4fc' : 'rgba(226,232,240,0.4)' }}>
                      {a.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-glow" style={{ padding: '14px 32px', borderRadius: 14, color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                {editing ? 'Update Space' : 'Create Space'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Space list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {spaces.map((s, i) => (
            <motion.div key={s._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass card-hover" style={{ borderRadius: 20, padding: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 600 }}>{s.title}</h3>
                  <span style={{ padding: '3px 10px', borderRadius: 8, background: 'rgba(99,102,241,0.12)', fontSize: 11, fontWeight: 600, color: '#a5b4fc', textTransform: 'uppercase' }}>{s.spaceType}</span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.35)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <HiOutlineLocationMarker style={{ width: 14, height: 14 }} />
                  {s.address?.street}, {s.address?.city}
                </p>
                <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.3)', marginTop: 4 }}>
                  ₹{s.basePrice}/hr · {s.totalSpots} spots · {(s.amenities || []).join(', ')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setEditing(s._id); setForm({ title: s.title, spaceType: s.spaceType, basePrice: s.basePrice, totalSpots: s.totalSpots, street: s.address?.street, city: s.address?.city, amenities: s.amenities || [] }); setShowForm(true); }}
                  style={{ padding: '8px 14px', borderRadius: 12, background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <HiOutlinePencil style={{ width: 14, height: 14 }} /> Edit
                </button>
                <button onClick={() => handleDelete(s._id)}
                  style={{ padding: '8px 14px', borderRadius: 12, background: 'rgba(239,68,68,0.12)', color: '#f87171', fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <HiOutlineTrash style={{ width: 14, height: 14 }} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Demo fallbacks removed to ensure 100% production database-driven rendering

export default MySpaces;
