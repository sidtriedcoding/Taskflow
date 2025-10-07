// ROUTES IMPORTS
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import commentRoutes from "./routes/commentRoutes";

// CONFIGURATIONS
dotenv.config();
const app = express();

// 1. Enable CORS for all requests
// Allow all origins since API Gateway controls access
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// 2. Body parsers to read JSON from the request body. THIS MUST BE EARLY.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Security and logging middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

// ROUTES (Must be after middleware)
app.get("/", (req, res) => {
  res.send("Welcome to the TaskFlow API");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes with /api prefix
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/comments", commentRoutes);

// Search route without /api prefix for backward compatibility
app.use("/search", searchRoutes);

// Legacy routes for backward compatibility
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.use("/notifications", notificationRoutes);
app.use("/comments", commentRoutes);

// SERVER
const port = Number(process.env.PORT) || 80;
app.listen(port, "0.0.0.0", () => {
  console.log(`TaskFlow Server is running on port ${port}`);
  console.log(`API endpoints available at:`);
  console.log(`  - GET /api/projects`);
  console.log(`  - POST /api/projects`);
  console.log(`  - GET /api/tasks`);
  console.log(`  - POST /api/tasks`);
});
