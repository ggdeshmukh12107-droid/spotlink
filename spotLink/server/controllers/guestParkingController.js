import GuestParking from '../models/GuestParking.js';
import Society from '../models/Society.js';

// @desc    Register guest parking
// @route   POST /api/guest-parking
export const registerGuestParking = async (req, res, next) => {
  try {
    const {
      societyId, guestName, guestPhone, guestVehicleNumber,
      guestVehicleType, assignedSlot, purpose,
      expectedArrival, expectedDeparture
    } = req.body;

    // Verify resident belongs to society
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ success: false, message: 'Society not found' });
    }

    if (!society.residents.includes(req.user.id) && society.adminId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not a member of this society' });
    }

    // Check guest slot availability
    const activeGuestBookings = await GuestParking.countDocuments({
      societyId,
      status: { $in: ['pending', 'approved', 'active'] }
    });

    if (activeGuestBookings >= society.guestSlots) {
      return res.status(400).json({ success: false, message: 'No guest parking slots available' });
    }

    // Check for duplicate vehicle
    const existingGuest = await GuestParking.findOne({
      societyId,
      guestVehicleNumber,
      status: { $in: ['pending', 'approved', 'active'] }
    });

    if (existingGuest) {
      return res.status(400).json({ success: false, message: 'This vehicle already has a guest parking assignment' });
    }

    const guestParking = await GuestParking.create({
      hostUserId: req.user.id,
      societyId,
      guestName,
      guestPhone,
      guestVehicleNumber,
      guestVehicleType,
      assignedSlot,
      purpose,
      expectedArrival,
      expectedDeparture,
      status: society.parkingPolicy.requireApproval ? 'pending' : 'approved'
    });

    res.status(201).json({ success: true, data: guestParking });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify guest parking (by code)
// @route   POST /api/guest-parking/verify
export const verifyGuestParking = async (req, res, next) => {
  try {
    const { verificationCode } = req.body;

    const guestParking = await GuestParking.findOne({ verificationCode })
      .populate('hostUserId', 'name email phone')
      .populate('societyId', 'name address');

    if (!guestParking) {
      return res.status(404).json({ success: false, message: 'Invalid verification code' });
    }

    if (guestParking.status === 'completed' || guestParking.status === 'rejected') {
      return res.status(400).json({ success: false, message: `Guest parking is ${guestParking.status}` });
    }

    // Mark as verified and active
    guestParking.isVerified = true;
    guestParking.status = 'active';
    guestParking.actualArrival = new Date();
    await guestParking.save();

    res.status(200).json({ success: true, data: guestParking, message: 'Guest parking verified' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get guest parking for a society
// @route   GET /api/guest-parking/society/:societyId
export const getSocietyGuestParking = async (req, res, next) => {
  try {
    const guests = await GuestParking.find({ societyId: req.params.societyId })
      .populate('hostUserId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: guests.length, data: guests });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve / Reject guest parking (admin)
// @route   PUT /api/guest-parking/:id/status
export const updateGuestParkingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const guestParking = await GuestParking.findById(req.params.id);

    if (!guestParking) {
      return res.status(404).json({ success: false, message: 'Guest parking not found' });
    }

    // Verify admin
    const society = await Society.findById(guestParking.societyId);
    if (society.adminId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only society admin can update status' });
    }

    guestParking.status = status;
    if (status === 'completed') {
      guestParking.actualDeparture = new Date();
    }
    await guestParking.save();

    res.status(200).json({ success: true, data: guestParking });
  } catch (error) {
    next(error);
  }
};

// @desc    Report violation
// @route   POST /api/guest-parking/:id/violation
export const reportViolation = async (req, res, next) => {
  try {
    const { type, description, fine } = req.body;
    const guestParking = await GuestParking.findById(req.params.id);

    if (!guestParking) {
      return res.status(404).json({ success: false, message: 'Guest parking not found' });
    }

    guestParking.violations.push({ type, description, fine });
    guestParking.status = 'violation';
    await guestParking.save();

    res.status(200).json({ success: true, data: guestParking, message: 'Violation reported' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my guest registrations
// @route   GET /api/guest-parking/my-guests
export const getMyGuestRegistrations = async (req, res, next) => {
  try {
    const guests = await GuestParking.find({ hostUserId: req.user.id })
      .populate('societyId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: guests.length, data: guests });
  } catch (error) {
    next(error);
  }
};
