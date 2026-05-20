import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  parkingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  durationHours: {
    type: Number
  },
  amount: {
    type: Number
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'active'
  },
  blockchainTxHash: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Configure JSON and Object transformations for complete frontend compatibility
const transformFunction = (doc, ret) => {
  ret.id = ret._id;
  ret.spaceId = ret.parkingId;
  ret.totalPrice = ret.amount;
  return ret;
};

bookingSchema.set('toJSON', { virtuals: true, transform: transformFunction });
bookingSchema.set('toObject', { virtuals: true, transform: transformFunction });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
