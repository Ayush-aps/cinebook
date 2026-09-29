const express = require('express'); 
const bookingRoutes = require('./src/route'); // should export express.Router()

const app = express();
const PORT = 3001;

// Built-in middleware to parse JSON
app.use(express.json());

// Debug check
console.log('Type of bookingRoutes:', typeof bookingRoutes); // Should print "function"

// Use routes
app.use('/booking', bookingRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Booking service running on port ${PORT}`);
});
