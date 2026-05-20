import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { searchParking } from '../services/api';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineStar, HiOutlineFilter } from 'react-icons/hi';

const SearchParking = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', maxPrice: '', vehicleType: '', search: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSpaces();
  }, [filters.type, filters.vehicleType]);

  const fetchSpaces = async (customFilters = {}) => {
    setLoading(true);
    try {
      // Merge search text and drop-down filters
      const queryParams = { ...customFilters };
      if (filters.search) queryParams.search = filters.search;
      if (filters.type) queryParams.type = filters.type;
      if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;
      if (filters.vehicleType) queryParams.vehicleType = filters.vehicleType;

      const { data } = await searchParking(queryParams);
      setSpots(data.data || []);
    } catch (error) {
      setSpots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchSpaces();
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 14, outline: 'none'
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 32, marginBottom: 8 }}>
            Find <span className="gradient-text">Parking</span>
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.45)', fontSize: 15 }}>Discover available parking spots near you</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-strong" style={{ borderRadius: 20, padding: 24, marginBottom: 40 }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 250, position: 'relative' }}>
              <HiOutlineSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'rgba(226,232,240,0.3)' }} />
              <input type="text" placeholder="Search by name or location..."
                value={filters.search} onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
                style={{ ...inputStyle, paddingLeft: 42 }} />
            </div>
            <button type="button" onClick={() => setShowFilters(!showFilters)} className="glass" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 500, color: '#e2e8f0', cursor: 'pointer', background: showFilters ? 'rgba(99,102,241,0.15)' : undefined }}>
              <HiOutlineFilter style={{ width: 16, height: 16 }} /> Filters
            </button>
            <button type="submit" className="btn-glow" style={{ padding: '12px 28px', borderRadius: 12, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', border: 'none' }}>
              Search
            </button>
          </form>

          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <select value={filters.type} onChange={(e) => setFilters(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
                <option value="">All Space Types</option>
                <option value="covered">🏢 Covered Plaza</option>
                <option value="open">☀️ Open Lot</option>
                <option value="basement">🏛️ Basement Garage</option>
              </select>
              <select value={filters.vehicleType} onChange={(e) => setFilters(p => ({ ...p, vehicleType: e.target.value }))} style={inputStyle}>
                <option value="">All Vehicles</option>
                <option value="car">🚗 Car Allowed</option>
                <option value="bike">🏍️ Bike Allowed</option>
                <option value="suv">🚙 SUV Allowed</option>
                <option value="ev">⚡ EV Charging Available</option>
              </select>
              <input type="number" placeholder="Max price (₹/hr)" value={filters.maxPrice}
                onChange={(e) => setFilters(p => ({ ...p, maxPrice: e.target.value }))} style={inputStyle} />
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <p style={{ fontSize: 14, color: 'rgba(226,232,240,0.35)', marginBottom: 20 }}>{spots.length} spots found</p>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="glass" style={{ borderRadius: 20, padding: 24 }}>
                <div style={{ height: 160, background: 'rgba(255,255,255,0.04)', borderRadius: 12, marginBottom: 16 }} />
                <div style={{ height: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 8, width: '70%', marginBottom: 12 }} />
                <div style={{ height: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 8, width: '50%' }} />
              </div>
            ))}
          </div>
        ) : spots.length === 0 ? (
          <div className="glass" style={{ borderRadius: 20, padding: '64px 24px', textAlign: 'center' }}>
            <HiOutlineLocationMarker style={{ width: 48, height: 48, margin: '0 auto 16px', color: 'rgba(226,232,240,0.15)' }} />
            <p style={{ color: 'rgba(226,232,240,0.35)', fontSize: 16, fontWeight: 500 }}>No spaces found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {spots.map((space, i) => {
              const availableSlots = space.availableSlots ?? (space.totalSlots - (space.bookedSpots || 0));
              const demandFactor = space.demandFactor || 1.0;
              const hasHighDemand = demandFactor > 1.2;

              return (
                <motion.div key={space._id || i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass card-hover"
                  style={{ borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                  {/* Image area */}
                  <div style={{ height: 140, background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(14,165,233,0.15))', position: 'relative', padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#a5b4fc' }}>
                      {space.type || space.spaceType || 'open'}
                    </span>
                    {hasHighDemand && (
                      <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.2)', fontSize: 10, fontWeight: 700, color: '#f87171', border: '1px solid rgba(239,68,68,0.4)' }}>
                        🔥 High demand
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '20px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6, color: '#e2e8f0' }}>{space.title}</h3>
                    <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.35)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
                      <HiOutlineLocationMarker style={{ width: 14, height: 14 }} />
                      {typeof space.address === 'object' ? `${space.address?.street || ''}, ${space.address?.city || ''}` : space.address}
                    </p>

                    {/* Amenities */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                      {(space.amenities || []).slice(0, 3).map((a, j) => (
                        <span key={j} style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', fontSize: 10, textTransform: 'uppercase', fontWeight: 500, color: 'rgba(226,232,240,0.5)', letterSpacing: 0.5 }}>
                          {a.replace('_', ' ')}
                        </span>
                      ))}
                    </div>

                    <div style={{ flex: 1 }} />

                    {/* Price + Rating + Book */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                      <div>
                        {/* Prominent dynamicPrice from API */}
                        <span style={{ fontSize: 24, fontWeight: 800, color: '#4f46e5', textShadow: '0 0 12px rgba(79,70,229,0.3)' }}>₹{space.dynamicPrice || space.basePrice}</span>
                        <span style={{ fontSize: 12, color: 'rgba(226,232,240,0.35)', marginLeft: 2 }}>/hr</span>
                        {space.dynamicPrice && space.dynamicPrice !== space.basePrice && (
                          <span style={{ fontSize: 12, color: 'rgba(226,232,240,0.25)', textDecoration: 'line-through', marginLeft: 8 }}>₹{space.basePrice}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#facc15' }}>
                        <HiOutlineStar style={{ width: 14, height: 14 }} />
                        {space.rating?.average?.toFixed(1) || '4.5'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                      <span className={`${availableSlots > 0 ? 'status-confirmed' : 'status-cancelled'}`}
                        style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8 }}>
                        {availableSlots} spots left
                      </span>
                      <Link to={`/book/${space._id}`} className="btn-glow"
                        style={{ padding: '10px 20px', borderRadius: 12, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                        Book Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchParking;
