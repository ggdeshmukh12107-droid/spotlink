import express from 'express';
import {
  createParking,
  searchParking,
  getParkingById,
  updateParkingSpace,
  deleteParkingSpace,
  getMyParkings
} from '../controllers/parkingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Specific routes
router.get('/mine', protect, getMyParkings);
router.get('/my-spaces', protect, getMyParkings); // original legacy route

// Standard resource routes
router.route('/')
  .get(searchParking)
  .post(protect, createParking);

router.route('/:id')
  .get(getParkingById)
  .put(protect, updateParkingSpace)
  .delete(protect, deleteParkingSpace);

export default router;
