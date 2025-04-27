// routes/bookingRoutes.ts
import express from "express";
import BookingController from "../controllers/bookingController";
import { authMiddleware } from "../middlewares/authMiddleware";
import UserController from "../controllers/userController";
import { roleMiddleware} from "../middlewares/roleMiddleware";

const router = express.Router();

// Mendapatkan semua pengguna dengan paginasi
router.get("/users", authMiddleware, roleMiddleware("admin"), UserController.getUsers);

// Get a booking by ID
router.get("/book/:id", authMiddleware, roleMiddleware("admin"), BookingController.getBookingById);

// Get bookings by vehicle ID
router.get("/book/vehicle/:vehicle_id", roleMiddleware("admin"), authMiddleware, BookingController.getBookingsByVehicleId);

// Update a booking by ID (Admin role)
router.put("/book/:id", authMiddleware, roleMiddleware("admin"), BookingController.updateBookingByIdRoleAdmin);

// Delete a booking by ID
router.delete("/book/:id", authMiddleware, roleMiddleware("admin"), BookingController.deleteBooking);

// Get all bookings with pagination
router.get("/book", authMiddleware, roleMiddleware("admin"), BookingController.getBookings);

export default router;