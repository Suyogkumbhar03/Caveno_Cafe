import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  grind: { type: String, default: 'Espresso' },
  milk: { type: String, default: 'Whole Milk' },
  sweetness: { type: String, default: 'Standard' },
});

const orderSchema = new mongoose.Schema(
  {
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    tableNumber: { type: String, default: 'Barista Salon Table 4' },
    zone: { type: String, default: 'Barista Bar' },
    customerInfo: {
      name: { type: String, default: 'Guest Connoisseur' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
