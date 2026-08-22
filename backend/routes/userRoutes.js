import express from 'express';
import { getMyReservations, getMyOrders } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/reservations', getMyReservations);
router.get('/orders', getMyOrders);

export default router;
