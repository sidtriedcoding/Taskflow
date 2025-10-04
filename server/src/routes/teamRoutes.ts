import { Router } from "express";
import { getTeams, createTeam } from "../controllers/teamController";

const router = Router();

// GET all teams
router.get("/", getTeams);

// POST create new team
router.post("/", createTeam);

export default router;
