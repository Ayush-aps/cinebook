import { bookingService } from './booking.service.js';

export const bookingController = {
    createBooking: async (req, res) => {
        try {
            const { userId, showtimeId, seatIds, totalAmount } = req.body;

            if (!userId || !showtimeId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const result = await bookingService.createBooking(userId, showtimeId, seatIds, totalAmount || 0);

            res.status(201).json({
                message: "Booking successful",
                data: result
            });
        } catch (error) {
            console.error("Booking error:", error);
            res.status(400).json({ error: error.message });
        }
    },

    cancelBooking: async (req, res) => {
        try {
            const { bookingId } = req.params;
            const { userId } = req.body; // Assuming userId is passed for verification

            if (!bookingId || !userId) {
                return res.status(400).json({ error: "Missing bookingId or userId" });
            }

            const result = await bookingService.cancelBooking(bookingId, userId);
            res.json(result);
        } catch (error) {
            console.error("Cancellation error:", error);
            res.status(400).json({ error: error.message });
        }
    },

    getBooking: async (req, res) => {
        try {
            const { bookingId } = req.params;
            const result = await bookingService.getBooking(bookingId);
            res.json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
};
