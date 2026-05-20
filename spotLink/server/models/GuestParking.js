import mongoose from 'mongoose';

const guestParkingSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  guestName: {
    type: String,
    required: true,
    trim: true
  },
  guestVehicle: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  slotAssigned: {
    type: String,
    required: true
  },
  verificationCode: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'expired'],
    default: 'pending'
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Configure JSON and Object transformations for complete frontend compatibility
const transformFunction = (doc, ret) => {
  ret.id = ret._id;
  ret.hostUserId = ret.residentId;
  ret.assignedSlot = ret.slotAssigned;
  ret.guestVehicleNumber = ret.guestVehicle;
  return ret;
};

guestParkingSchema.set('toJSON', { virtuals: true, transform: transformFunction });
guestParkingSchema.set('toObject', { virtuals: true, transform: transformFunction });

const GuestParking = mongoose.model('GuestParking', guestParkingSchema);
export default GuestParking;
