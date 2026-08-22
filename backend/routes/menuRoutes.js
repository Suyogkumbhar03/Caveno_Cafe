import express from 'express';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMenuItems)
  .post(protect, requireAdmin, createMenuItem);

router.route('/:id')
  .put(protect, requireAdmin, updateMenuItem)
  .delete(protect, requireAdmin, deleteMenuItem);

export default router;
