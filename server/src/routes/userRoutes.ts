import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController";

const router = Router();

// GET all users
router.get("/", getUsers);

// POST create new user
router.post("/", createUser);

export default router;
