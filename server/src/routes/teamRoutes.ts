import { Router } from "express";
import { getTeams } from "../controllers/teamController";

const router = Router();

// GET all teams
router.get("/", getTeams);

export default router;
