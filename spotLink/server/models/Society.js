import mongoose from 'mongoose';

const societySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Society name is required'],
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }       // [lng, lat]
  },
  totalSlots: {
    type: Number,
    required: true,
    min: 1
  },
  guestSlots: {
    type: Number,
    default: 0
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  residents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  parkingPolicy: {
    maxGuestDuration: { type: Number, default: 4 },        // hours
    guestParkingFee: { type: Number, default: 0 },
    violationFine: { type: Number, default: 500 },
    requireApproval: { type: Boolean, default: true }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

societySchema.index({ location: '2dsphere' });

const Society = mongoose.model('Society', societySchema);
export default Society;
