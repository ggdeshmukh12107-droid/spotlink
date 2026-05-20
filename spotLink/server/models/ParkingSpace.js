import mongoose from 'mongoose';

const parkingSpaceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  lat: {
    type: Number
  },
  lng: {
    type: Number
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: 0
  },
  type: {
    type: String,
    enum: ['covered', 'open', 'basement'],
    default: 'open'
  },
  totalSlots: {
    type: Number,
    default: 1,
    min: 1
  },
  availableSlots: {
    type: Number
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amenities: [{
    type: String
  }],
  supportedVehicles: {
    type: [String],
    default: ['car', 'bike', 'suv', 'ev']
  },
  images: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Configure JSON and Object transformations for complete frontend compatibility
const transformFunction = (doc, ret) => {
  ret.id = ret._id;
  ret.totalSpots = ret.totalSlots;
  ret.bookedSpots = Math.max(0, ret.totalSlots - (ret.availableSlots ?? ret.totalSlots));
  ret.availableSpots = ret.availableSlots ?? ret.totalSlots;
  ret.spaceType = ret.type;
  
  // Format address as object for standard frontend expectations
  if (typeof ret.address === 'string') {
    const parts = ret.address.split(',');
    ret.address = {
      street: parts[0]?.trim() || ret.address,
      city: parts[1]?.trim() || '',
      state: parts[2]?.trim() || '',
      zipCode: '',
      landmark: ''
    };
  }
  return ret;
};

parkingSpaceSchema.set('toJSON', { virtuals: true, transform: transformFunction });
parkingSpaceSchema.set('toObject', { virtuals: true, transform: transformFunction });

const ParkingSpace = mongoose.model('ParkingSpace', parkingSpaceSchema);
export default ParkingSpace;
