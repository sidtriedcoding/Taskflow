// ROUTES IMPORTS
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";

// CONFIGURATIONS
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ROUTES
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

// Legacy routes for backward compatibility
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

// SERVER
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`TaskFlow Server is running on port ${port}`);
  console.log(`API endpoints available at:`);
  console.log(`  - GET /api/projects`);
  console.log(`  - POST /api/projects`);
  console.log(`  - GET /api/tasks`);
  console.log(`  - POST /api/tasks`);
});
