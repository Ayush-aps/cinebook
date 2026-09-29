import db, { executeRead } from '../../config/db.js';

export const bookingRepository = {
  // Get seat with lock (using transaction connection)
  getSeatWithLock: async (seatId, connection) => {
    const [rows] = await connection.execute(
      'SELECT * FROM seats WHERE id = ? FOR UPDATE',
      [seatId]
    );
    return rows[0];
  },

  updateSeatStatus: async (seatId, status, userId, holdExpiresAt = null, connection) => {
    console.log(`Updating seat ${seatId} to ${status}`);
    await connection.execute(
      `UPDATE seats 
       SET status = ?, user_id = ?, hold_expires_at = ? 
       WHERE id = ?`,
      [status, userId, holdExpiresAt, seatId]
    );
  },

  createBooking: async (bookingData, connection) => {
    // bookingData: { id, user_id, showtime_id, total_amount, seats (JSON) }
    await connection.execute(
      `INSERT INTO bookings 
       (id, user_id, showtime_id, total_amount, seats, booking_status, payment_status) 
       VALUES (?, ?, ?, ?, ?, 'CONFIRMED', 'COMPLETED')`,
      [bookingData.id, bookingData.user_id, bookingData.showtime_id, bookingData.total_amount, JSON.stringify(bookingData.seats)]
    );
  },

  createBookingSeat: async (bookingId, seatId, price, connection) => {
    await connection.execute(
      `INSERT INTO booking_seats (booking_id, seat_id, price) VALUES (?, ?, ?)`,
      [bookingId, seatId, price]
    );
  },

  // Helper to get seat info without lock (for initial checks if needed)
  getSeatById: async (seatId) => {
    const [rows] = await executeRead('SELECT * FROM seats WHERE id = ?', [seatId]);
    return rows[0];
  },

  getBooking: async (bookingId, connection) => {
    const [rows] = await connection.execute(
      'SELECT * FROM bookings WHERE id = ?',
      [bookingId]
    );
    return rows[0];
  },

  // Read from Replica
  getBookingRead: async (bookingId) => {
    const [rows] = await executeRead(
      'SELECT * FROM bookings WHERE id = ?',
      [bookingId]
    );
    return rows[0];
  },

  updateBookingStatus: async (bookingId, status, connection) => {
    await connection.execute(
      'UPDATE bookings SET booking_status = ?, cancelled_at = NOW() WHERE id = ?',
      [status, bookingId]
    );
  },

  releaseSeats: async (bookingId, connection) => {
    // Release seats associated with this booking
    // Note: In a real schema we might join booking_seats
    // For this simplified version we assume we can track them back or we update based on booking_id if we stored it in seats (schema used JSON for seats in bookings, but seats table also had booking_id column potential?)
    // Checking schema: seats table has `booking_id VARCHAR(50) NULL`.
    // So we can update seats where booking_id matches.

    // First we need to make sure we linked them in createBooking.
    // In createBooking we didn't explicitly set booking_id in seats table!
    // We only set status='BOOKED' and user_id.
    // We should fix createBooking to also set booking_id in seats table for easier release.
    // Or we use the JSON 'seats' array from bookings table to find which seats to release.
    // Let's use the JSON array approach since we have the booking record.
    // Actually, SQL query to release based on booking_id in seats is cleaner IF we set it.
    // Let's assume we update createBooking to set booking_id too.

    await connection.execute(
      "UPDATE seats SET status='AVAILABLE', user_id=NULL, booking_id=NULL, hold_expires_at=NULL WHERE booking_id = ?",
      [bookingId]
    );
  }
};
