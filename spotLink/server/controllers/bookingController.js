import Booking from '../models/Booking.js';
import ParkingSpace from '../models/ParkingSpace.js';
import { calculateDynamicPrice } from '../utils/pricing.js';

// @desc    Create booking
// @route   POST /api/bookings
export const createBooking = async (req, res, next) => {
  try {
    const { spaceId, parkingId: bodyParkingId, parkingSpace, startTime, endTime } = req.body;
    const parkingId = bodyParkingId || spaceId || parkingSpace; // Support all names for front-back compatibility

    if (!parkingId) {
      return res.status(400).json({ success: false, message: 'Parking space ID is required' });
    }

    // a. Find parking by ID in MongoDB
    const parking = await ParkingSpace.findById(parkingId);
    if (!parking || !parking.isActive) {
      return res.status(404).json({ success: false, message: 'Parking space not found or is inactive' });
    }

    // b. Check availableSlots > 0
    const availableSlots = parking.availableSlots ?? parking.totalSlots;
    if (availableSlots <= 0) {
      return res.status(400).json({ success: false, message: 'No spots available' });
    }

    // c. Check overlap: Booking.findOne({ parkingId, status:{$ne:'cancelled'}, $or:[{startTime:{$lt:endTime},endTime:{$gt:startTime}}] })
    const start = new Date(startTime);
    const end = new Date(endTime);

    const conflicting = await Booking.findOne({
      parkingId,
      status: { $ne: 'cancelled' },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (conflicting) {
      return res.status(400).json({ success: false, message: 'This spot is already booked for the selected time window' });
    }

    // d. Calculate duration and amount using calculateDynamicPrice
    const durationHours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
    const pricing = calculateDynamicPrice(
      parking.basePrice,
      availableSlots,
      parking.totalSlots
    );
    const amount = Number((pricing.dynamicPrice * durationHours).toFixed(2));

    // e. Create booking in MongoDB
    let booking = await Booking.create({
      parkingId,
      userId: req.user.id,
      ownerId: parking.ownerId,
      startTime: start,
      endTime: end,
      durationHours,
      amount,
      status: 'active'
    });

    // f. ParkingSpace.findByIdAndUpdate(parkingId, {$inc:{availableSlots:-1}})
    await ParkingSpace.findByIdAndUpdate(parkingId, { $inc: { availableSlots: -1 } });

    // g. Return populated booking (parking title, user name)
    booking = await Booking.findById(booking._id)
      .populate('parkingId', 'title address basePrice')
      .populate('userId', 'name email');

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    // Update status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    // Increment availableSlots by 1 atomically
    await ParkingSpace.findByIdAndUpdate(booking.parkingId, { $inc: { availableSlots: 1 } });

    res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my-bookings
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('parkingId', 'title address basePrice')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for my owned spaces
// @route   GET /api/bookings/owner-bookings
export const getOwnerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user.id })
      .populate('parkingId')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('parkingId')
      .populate('userId', 'name email phone');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Set vacate alert
// @route   PUT /api/bookings/:id/vacate-alert
export const setVacateAlert = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking, message: 'Vacate alert sent' });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete booking
// @route   PUT /api/bookings/:id/complete
export const completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    booking.status = 'completed';
    await booking.save();
    
    // Free up the slot atomically
    await ParkingSpace.findByIdAndUpdate(booking.parkingId, { $inc: { availableSlots: 1 } });
    
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};
