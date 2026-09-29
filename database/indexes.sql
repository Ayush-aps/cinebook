-- User indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);

-- Show indexes
CREATE INDEX idx_show_movie ON shows(movie_id);
CREATE INDEX idx_show_time ON shows(show_time);

-- Seat indexes (your existing, keep them)
CREATE INDEX idx_seat_status ON seats(status);
CREATE INDEX idx_hold_expiry ON seats(hold_expires_at);
CREATE INDEX idx_seat_show ON seats(show_id);
CREATE INDEX idx_seat_held_by ON seats(held_by_user_id);

-- Booking indexes
CREATE INDEX idx_booking_user ON bookings(user_id);
CREATE INDEX idx_booking_show ON bookings(show_id);
CREATE INDEX idx_booking_status ON bookings(status);