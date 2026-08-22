import express from 'express';
import {
  getAdminStats,
  getAdminReservations,
  updateReservationStatus,
  getAdminOrders,
  updateOrderStatus,
} from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect & requireAdmin middleware to all admin endpoints
router.use(protect);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/reservations', getAdminReservations);
router.patch('/reservations/:id', updateReservationStatus);
router.get('/orders', getAdminOrders);
router.patch('/orders/:id', updateOrderStatus);

export default router;
