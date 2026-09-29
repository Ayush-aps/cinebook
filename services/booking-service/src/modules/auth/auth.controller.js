// auth.controller.js
const authService = require("./auth.service");

// login API
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // demo user
    const user = {
      id: 1,
      username: "admin",
      password: authService.hashPassword("1234"), // demo hashed password
      role: "ADMIN",
    };

    // check password
    const valid = authService.comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = authService.generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
