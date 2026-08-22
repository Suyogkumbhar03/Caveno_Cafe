import express from 'express';
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  getUserActiveOrders,
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id/status')
  .patch(updateOrderStatus);

router.route('/user/:email')
  .get(getUserActiveOrders);

export default router;
