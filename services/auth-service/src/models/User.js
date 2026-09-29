import pool from '../config/db.js';

export const User = {
  // Create new user
  async create(userData) {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [userData.name, userData.email, userData.password, userData.phone, userData.role || 'CUSTOMER']
    );
    return result.insertId;
  },

  // Find user by email
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  // Find user by ID
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  // Update user
  async update(id, userData) {
    const [result] = await pool.execute(
      'UPDATE users SET name = ?, phone = ? WHERE id = ?',
      [userData.name, userData.phone, id]
    );
    return result.affectedRows > 0;
  }
};