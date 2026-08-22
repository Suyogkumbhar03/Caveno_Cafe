import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    guests: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    zone: { type: String, required: true },
    dietary: { type: String, default: '' },
    occasion: { type: String, default: 'General Tasting' },
    bookingRef: { type: String, required: true, unique: true },
    status: { type: String, default: 'confirmed' },
  },
  { timestamps: true }
);

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
