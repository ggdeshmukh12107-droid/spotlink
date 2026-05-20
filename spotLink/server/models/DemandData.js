import mongoose from 'mongoose';

const demandDataSchema = new mongoose.Schema({
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  spaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace'
  },
  hour: {
    type: Number,         // 0–23
    required: true
  },
  dayOfWeek: {
    type: Number,         // 0(Sun)–6(Sat)
    required: true
  },
  bookingCount: {
    type: Number,
    default: 0
  },
  demandLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'peak'],
    default: 'low'
  },
  demandFactor: {
    type: Number,
    default: 1.0,
    min: 0.5,
    max: 3.0
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

demandDataSchema.index({ location: '2dsphere' });
demandDataSchema.index({ spaceId: 1, hour: 1, dayOfWeek: 1 });

const DemandData = mongoose.model('DemandData', demandDataSchema);
export default DemandData;
