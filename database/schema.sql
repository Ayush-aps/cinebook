-- Drop everything and start fresh
DROP DATABASE IF EXISTS cinebook_db;
CREATE DATABASE cinebook_db;
USE cinebook_db;

-- 1. USERS (from auth-service)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
);

-- 2. MOVIES
CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration INT NOT NULL, -- minutes
    language VARCHAR(50),
    genre VARCHAR(100),
    rating VARCHAR(10),
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    price DECIMAL(10,2) DEFAULT 350.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_movie_title (title)
);

-- 3. THEATRES
CREATE TABLE theatres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    total_screens INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_theatre_city (city)
);

-- 4. SCREENS
CREATE TABLE screens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    theatre_id INT NOT NULL,
    screen_number INT NOT NULL,
    capacity INT NOT NULL DEFAULT 100,
    screen_type ENUM('2D', '3D', 'IMAX', '4DX') DEFAULT '2D',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (theatre_id) REFERENCES theatres(id) ON DELETE CASCADE,
    UNIQUE KEY unique_screen (theatre_id, screen_number)
);

-- 5. SHOWTIMES (CRITICAL FOR DISTRIBUTED SYSTEM)
CREATE TABLE showtimes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    screen_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    available_seats INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE CASCADE,
    INDEX idx_showtime_movie (movie_id),
    INDEX idx_showtime_time (start_time)
);

-- 6. SEATS (DISTRIBUTED CONCURRENCY CONTROL)
CREATE TABLE seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    showtime_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL, -- e.g., "A1", "B5"
    seat_type ENUM('regular', 'premium', 'vip') DEFAULT 'regular',
    price DECIMAL(10,2) NOT NULL,
    status ENUM('AVAILABLE', 'HELD', 'BOOKED') DEFAULT 'AVAILABLE',
    user_id INT NULL, -- user holding/booking this seat
    hold_expires_at DATETIME NULL, -- for distributed lock timeout
    booking_id VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_showtime_seat (showtime_id, seat_number),
    INDEX idx_seat_status (status),
    INDEX idx_hold_expiry (hold_expires_at),
    INDEX idx_seat_showtime (showtime_id)
) ENGINE=InnoDB;

-- 7. BOOKINGS (DISTRIBUTED TRANSACTIONS)
CREATE TABLE bookings (
    id VARCHAR(50) PRIMARY KEY, -- e.g., "BK202401151230001"
    user_id INT NOT NULL,
    showtime_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    booking_status ENUM('CONFIRMED', 'CANCELLED', 'EXPIRED') DEFAULT 'CONFIRMED',
    transaction_id VARCHAR(100),
    seats JSON NOT NULL, -- store seat numbers as JSON array
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
    INDEX idx_booking_user (user_id),
    INDEX idx_booking_status (booking_status),
    INDEX idx_booking_date (booking_date)
);

-- 8. BOOKING_SEATS (For analytics)
CREATE TABLE booking_seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(50) NOT NULL,
    seat_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE,
    INDEX idx_booking_seats (booking_id)
);

-- ==================== SAMPLE DATA ====================


-- Movies
INSERT INTO movies (title, description, duration, language, genre, rating, price) VALUES
('Interstellar', 'A team of explorers travel through a wormhole in space.', 169, 'English', 'Sci-Fi, Adventure', 'PG-13', 450),
('Dune: Part Two', 'Paul Atreides unites with the Fremen.', 166, 'English', 'Sci-Fi, Adventure', 'PG-13', 400),
('ගම්පෙරළිය (Gamperaliya)', 'Classic Sinhala film.', 135, 'Sinhala', 'Drama, Romance', 'U', 250);

-- Theatres
INSERT INTO theatres (name, city, address, total_screens) VALUES
('Savoy 3D Cinema', 'Colombo', 'Galle Road, Colombo 03', 5),
('Majestic Cineplex', 'Colombo', 'Main Street, Colombo 11', 4),
('Liberty by Scope Cinemas', 'Colombo', 'Liberty Plaza, Colombo 03', 6);

-- Screens
INSERT INTO screens (theatre_id, screen_number, capacity, screen_type) VALUES
(1, 1, 150, 'IMAX'),
(1, 2, 120, '3D'),
(2, 1, 100, '2D');

-- Showtimes
INSERT INTO showtimes (movie_id, screen_id, start_time, end_time, available_seats, price) VALUES
(1, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 169 MINUTE), 150, 450),
(1, 2, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 169 MINUTE), 120, 350),
(2, 3, DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 166 MINUTE), 100, 400);

-- Generate seats for showtimes
DELIMITER $$
CREATE PROCEDURE GenerateSeatsForShowtime(IN p_showtime_id INT, IN p_capacity INT)
BEGIN
    DECLARE v_row INT DEFAULT 1;
    DECLARE v_col INT DEFAULT 1;
    DECLARE v_rows INT DEFAULT 10;
    DECLARE v_cols INT;
    DECLARE v_seat_counter INT DEFAULT 1;
    
    SET v_cols = CEIL(p_capacity / v_rows);
    
    WHILE v_row <= v_rows DO
        SET v_col = 1;
        WHILE v_col <= v_cols AND v_seat_counter <= p_capacity DO
            INSERT INTO seats (showtime_id, seat_number, price, status) 
            VALUES (
                p_showtime_id,
                CONCAT(CHAR(64 + v_row), v_col),
                350.00,
                'AVAILABLE'
            );
            SET v_col = v_col + 1;
            SET v_seat_counter = v_seat_counter + 1;
        END WHILE;
        SET v_row = v_row + 1;
    END WHILE;
END$$
DELIMITER ;

-- Generate seats
CALL GenerateSeatsForShowtime(1, 150);
CALL GenerateSeatsForShowtime(2, 120);
CALL GenerateSeatsForShowtime(3, 100);

-- Drop procedure after use
DROP PROCEDURE GenerateSeatsForShowtime;