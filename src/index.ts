import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";

// Import middlewares
// import { jsonOnlyMiddleware } from "./middlewares/jsonOnlyMiddleware";

// Import routes
import welcomeRoutes from "./routes/welcomeRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import detailUserRoutes from "./routes/detailUserRoutes";

// Initialize dotenv
dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/", welcomeRoutes);

// app.use(jsonOnlyMiddleware);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/detail-users", detailUserRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
