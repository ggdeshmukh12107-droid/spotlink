import express from 'express';
import {
  createSociety,
  getSocieties,
  getSociety,
  joinSociety,
  updateSociety
} from '../controllers/societyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getSocieties)
  .post(protect, authorize('admin', 'owner'), createSociety);

router.route('/:id')
  .get(getSociety)
  .put(protect, updateSociety);

router.post('/:id/join', protect, joinSociety);

export default router;
