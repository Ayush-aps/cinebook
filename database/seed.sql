-- Users
INSERT INTO users (id, name, email, password, role) VALUES 
(1, 'John Doe', 'john@example.com', '$2a$10$XXXXXXXXXXXXXXXXXXXXXX', 'customer'),
(2, 'Jane Smith', 'jane@example.com', '$2a$10$XXXXXXXXXXXXXXXXXXXXXX', 'customer'),
(3, 'Admin User', 'admin@example.com', '$2a$10$XXXXXXXXXXXXXXXXXXXXXX', 'admin');

-- Movies (if not already in schema.sql, usually schema has structure, seed has data. 
-- Checking schema.sql, it had INSERTs at the bottom! 
-- But schema.sql might not have been fully run if it failed on something else or if I am just adding users here)
-- Let's just ensure Users exist as that's the current error.
