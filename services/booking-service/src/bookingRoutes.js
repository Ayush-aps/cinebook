import express from "express";
import { bookingController } from "./modules/booking/booking.controller.js";

const router = express.Router();

// POST /api/booking/ - Create a new booking
router.post("/", bookingController.createBooking);

// POST /api/booking/:bookingId/cancel - Cancel a booking
router.post("/:bookingId/cancel", bookingController.cancelBooking);

// GET /api/booking/:bookingId - Get a booking (Reads from Replica)
router.get("/:bookingId", bookingController.getBooking);

export default router;
