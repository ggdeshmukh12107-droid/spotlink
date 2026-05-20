import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  setVacateAlert,
  completeBooking,
  getOwnerBookings
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/my-bookings', protect, getMyBookings);
router.get('/owner-bookings', protect, authorize('owner', 'admin'), getOwnerBookings);

router.route('/')
  .post(protect, createBooking);

router.route('/:id')
  .get(protect, getBooking);

router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/vacate-alert', protect, setVacateAlert);
router.put('/:id/complete', protect, completeBooking);

export default router;
