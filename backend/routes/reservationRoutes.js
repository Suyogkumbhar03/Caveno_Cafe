import express from 'express';
import {
  createReservation,
  getReservationByRef,
  getAllReservations,
} from '../controllers/reservationController.js';

const router = express.Router();

router.post('/', createReservation);
router.get('/', getAllReservations);
router.get('/track/:bookingRef', getReservationByRef);

export default router;
