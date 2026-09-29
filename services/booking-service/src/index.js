console.log("BOOT: index.js started");

import express from "express";
import cors from "cors";
import { env } from "./config/env.js";

import bookingRoutes from "./bookingRoutes.js";

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true,
}));
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  res.json({ service: "booking-service", status: "UP", instance: process.env.INSTANCE_ID });
});

// API Routes
app.use("/", bookingRoutes);

app.listen(env.port, () => {
  console.log(`Booking Service running on port ${env.port} (${process.env.INSTANCE_ID})`);
});
