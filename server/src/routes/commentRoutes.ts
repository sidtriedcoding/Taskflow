import { Router } from "express";
import { createComment, getComments, deleteComment } from "../controllers/commentController";

const router = Router();

router.get("/", getComments);
router.post("/", createComment);
router.delete("/:commentId", deleteComment);

export default router;
