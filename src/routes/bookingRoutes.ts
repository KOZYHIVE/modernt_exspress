// routes/bookingRoutes.ts
import express from "express";
import BookingController from "../controllers/bookingController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";

const router = express.Router();

// Create a new booking
router.post("/create", authMiddleware, BookingController.createBooking);

// Get a booking by ID
router.get("user/:id", authMiddleware, BookingController.getBookingById);

// Get a booking by ID
router.get("/user/history", authMiddleware, BookingController.getAllByUser);

// Get a booking by ID
router.get("/user/history/:id", authMiddleware, BookingController.getBookingByIdRoleUser);

// Get bookings by user ID
router.get("/user/:user_id", authMiddleware, BookingController.getBookingsByUserId);

// Update a booking by ID (User role)
router.put("/user/:id", authMiddleware, upload.single("image"), BookingController.updateBookingByIdRoleUser);

export default router;