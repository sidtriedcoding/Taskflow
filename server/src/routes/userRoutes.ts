import { Router } from "express";
import { getUsers } from "../controllers/userController";

const router = Router();

// GET all users
router.get("/", getUsers);

export default router;
