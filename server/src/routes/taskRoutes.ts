import { Router } from "express";
import { getTasks, createTask, updateTaskStatus, updateTask, deleteTask, duplicateTask } from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.post("/:taskId/duplicate", duplicateTask);

export default router;

