// auth.service.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// secret key (for demo; normally store in .env)
const SECRET = process.env.JWT_SECRET || "supersecret123";

// Generate JWT token
function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });
}

// Verify JWT token
function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

// Hash a plain password
function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

// Compare plain password with hashed password
function comparePassword(password, hashed) {
  return bcrypt.compareSync(password, hashed);
}

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
};
