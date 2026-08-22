import express from 'express';
import { loginAdmin, registerCustomer, loginCustomer, getMe, initAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/admin-login', loginAdmin);
router.post('/init-admin', initAdmin);
router.get('/me', protect, getMe);

export default router;
