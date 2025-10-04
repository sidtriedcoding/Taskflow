import { Router } from 'express';
import { createProject, getProjects, getProject } from '../controllers/projectController';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProject);
router.post("/", createProject);

export default router;

