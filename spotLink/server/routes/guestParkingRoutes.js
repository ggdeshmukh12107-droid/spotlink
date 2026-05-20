import express from 'express';
import {
  registerGuest,
  verifyGuestCode,
  getMyGuestRegistrations
} from '../controllers/guestController.js';
import {
  getSocietyGuestParking,
  updateGuestParkingStatus,
  reportViolation
} from '../controllers/guestParkingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Specific routes
router.get('/mine', protect, getMyGuestRegistrations);
router.get('/my-guests', protect, getMyGuestRegistrations);
router.post('/verify', verifyGuestCode);

router.route('/')
  .post(protect, registerGuest);

// Legacy/Admin routes
router.get('/society/:societyId', protect, getSocietyGuestParking);
router.put('/:id/status', protect, authorize('admin', 'owner'), updateGuestParkingStatus);
router.post('/:id/violation', protect, authorize('admin'), reportViolation);

export default router;
