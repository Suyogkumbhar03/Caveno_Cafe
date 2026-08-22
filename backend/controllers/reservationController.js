import Reservation from '../models/Reservation.js';

export const createReservation = async (req, res, next) => {
  try {
    const { name, email, phone, guests, date, timeSlot, zone, dietary, occasion } = req.body;

    if (!email || !guests || !date || !timeSlot || !zone) {
      return res.status(400).json({ success: false, message: 'Please provide all required reservation fields' });
    }

    const bookingRef = `CVN-${Math.floor(1000 + Math.random() * 9000)}-X`;

    const newReservation = await Reservation.create({
      bookingRef,
      name: name || 'Guest Connoisseur',
      email,
      phone,
      guests,
      date,
      timeSlot,
      zone,
      dietary,
      occasion,
    });

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: newReservation,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservationByRef = async (req, res, next) => {
  try {
    const { bookingRef } = req.params;
    const reservation = await Reservation.findOne({ bookingRef });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation pass reference not found' });
    }

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};

export const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    next(error);
  }
};
