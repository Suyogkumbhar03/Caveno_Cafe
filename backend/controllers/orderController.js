import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res, next) => {
  try {
    const { items, subtotal, tax, totalAmount, customerInfo, tableNumber, zone } = req.body;

    const formattedSubtotal = Number(subtotal) || 0;
    const formattedTax = Number(tax) || 0;
    const formattedTotal = Number(totalAmount) || formattedSubtotal + formattedTax;

    const order = await Order.create({
      items: Array.isArray(items) ? items : [],
      subtotal: formattedSubtotal,
      tax: formattedTax,
      totalAmount: formattedTotal,
      tableNumber: tableNumber || customerInfo?.tableNo || 'Barista Salon Table 4',
      zone: zone || 'Barista Bar',
      customerInfo: {
        name: customerInfo?.name || 'Guest Connoisseur',
        email: customerInfo?.email || 'guest@domain.com',
        phone: customerInfo?.phone || '',
      },
      orderStatus: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order processed successfully',
      data: order,
    });
  } catch (error) {
    console.error('[createOrder error]', error);
    next(error);
  }
};

// @desc    Get all orders sorted by createdAt: -1
// @route   GET /api/orders
// @access  Public / Admin
export const getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { orderStatus: status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'];
    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: `Order status updated to ${orderStatus}`, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user active orders by email
// @route   GET /api/orders/user/:email
// @access  Public / User
export const getUserActiveOrders = async (req, res, next) => {
  try {
    const { email } = req.params;
    const userEmail = decodeURIComponent(email);

    // If guest or email provided, find match or latest orders if email is guest
    let filter = { 'customerInfo.email': userEmail };
    if (userEmail === 'guest@domain.com') {
      filter = {}; // Return recent orders for guest view
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};
