import Reservation from '../models/Reservation.js';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const totalReservations = await Reservation.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    const totalMenuItems = await MenuItem.countDocuments({});

    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const pendingOrders = await Order.countDocuments({ orderStatus: { $ne: 'Served' } });
    const seatedReservations = await Reservation.countDocuments({ status: 'Seated' });

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalReservations,
        totalOrders,
        totalMenuItems,
        pendingOrders,
        seatedReservations,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminReservations = async (req, res, next) => {
  try {
    const { zone, status, search } = req.query;
    let query = {};

    if (zone && zone !== 'All') {
      query.zone = zone;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bookingRef: { $regex: search, $options: 'i' } },
      ];
    }

    const reservations = await Reservation.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    next(error);
  }
};

export const updateReservationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
