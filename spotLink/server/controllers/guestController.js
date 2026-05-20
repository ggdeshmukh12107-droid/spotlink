import GuestParking from '../models/GuestParking.js';
import crypto from 'crypto';

// @desc    Register guest parking
// @route   POST /api/guest-parking
export const registerGuest = async (req, res, next) => {
  try {
    const { guestName, guestVehicle, guestVehicleNumber, slotAssigned, assignedSlot, validFrom } = req.body;
    
    // Support both input names for legacy/client compatibility
    const vehicle = guestVehicle || guestVehicleNumber;
    const slot = slotAssigned || assignedSlot;
    
    if (!guestName || !vehicle || !slot) {
      return res.status(400).json({ success: false, message: 'guestName, guestVehicle, and slotAssigned are required' });
    }

    const code = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars hex
    const validUntil = req.body.validUntil ? new Date(req.body.validUntil) : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const guest = await GuestParking.create({
      residentId: req.user.id,
      guestName,
      guestVehicle: vehicle,
      slotAssigned: slot,
      verificationCode: code,
      status: 'pending',
      validFrom: validFrom ? new Date(validFrom) : new Date(),
      validUntil
    });

    res.status(201).json({
      success: true,
      code: guest.verificationCode,
      validUntil: guest.validUntil,
      slotAssigned: guest.slotAssigned,
      data: guest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify guest parking code
// @route   POST /api/guest-parking/verify
export const verifyGuestCode = async (req, res, next) => {
  try {
    const { verificationCode } = req.body;

    if (!verificationCode) {
      return res.status(400).json({ success: false, message: 'verificationCode is required' });
    }

    // find GuestParking by verificationCode in MongoDB
    const guest = await GuestParking.findOne({ verificationCode })
      .populate('residentId', 'name email phone');

    if (!guest) {
      return res.status(404).json({ success: false, message: 'Verification code not found' });
    }

    // if status!='pending' or validUntil < now: return 400 'Code expired or already used'
    const now = new Date();
    if (guest.status !== 'pending' || guest.validUntil < now) {
      return res.status(400).json({ success: false, message: 'Code expired or already used' });
    }

    // update status='active' in DB
    guest.status = 'active';
    await guest.save();

    res.status(200).json({
      success: true,
      guestName: guest.guestName,
      slotAssigned: guest.slotAssigned,
      data: guest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my guest registrations
// @route   GET /api/guest-parking/mine
export const getMyGuestRegistrations = async (req, res, next) => {
  try {
    const guests = await GuestParking.find({ residentId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: guests.length, data: guests });
  } catch (error) {
    next(error);
  }
};

// Aliases for compatibility with other components
export const registerGuestParking = registerGuest;
export const verifyGuestParking = verifyGuestCode;
export const getMyGuests = getMyGuestRegistrations;
