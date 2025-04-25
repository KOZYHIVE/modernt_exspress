import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";


// Import routes
import welcomeRoutes from "./routes/welcomeRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import detailUserRoutes from "./routes/detailUserRoutes";
import brandRoutes from "./routes/brandRoutes";
import vehicleRoutes  from "./routes/vehicleRoutes";
import rentalRoutes from "./routes/rentalRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import bannerRoutes from "./routes/bannerRoutes";

// Initialize dotenv
dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/", welcomeRoutes);

// app.use(jsonOnlyMiddleware);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/detail-users", detailUserRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/banners", bannerRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
