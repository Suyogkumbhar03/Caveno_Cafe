import Reservation from '../models/Reservation.js';
import Order from '../models/Order.js';

export const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'customerInfo.name': req.user.name }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};
