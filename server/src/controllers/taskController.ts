import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId ? Number(projectId) : undefined,
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving tasks: ${error.message}` });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  // --- START OF DEBUGGING LOGS ---
  // These logs will show us exactly what the backend is receiving.
  console.log("--- RECEIVED NEW TASK REQUEST ---");
  console.log("Request Body Received:", req.body);
  console.log("Content-Type Header:", req.headers['content-type']);
  // --- END OF DEBUGGING LOGS ---

  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;

  // --- START OF ROBUST VALIDATION ---
  if (!title || !priority || !projectId || !authorUserId) {
    res.status(400).json({
      message:
        "Missing required fields. Required: title, priority, projectId, authorUserId.",
    });
    return;
  }

  // Validate dates if they are provided
  if (startDate && isNaN(new Date(startDate).getTime())) {
    res.status(400).json({
      message: "Invalid startDate format. Please use a valid ISO date string.",
    });
    return;
  }
  if (dueDate && isNaN(new Date(dueDate).getTime())) {
    res.status(400).json({
      message: "Invalid dueDate format. Please use a valid ISO date string.",
    });
    return;
  }
  // --- END OF ROBUST VALIDATION ---

  try {
    // Build the data object for Prisma
    const taskData: any = {
      title,
      description,
      status,
      priority,
      tags, // Tags can be an empty string if not provided
      points,
      startDate: startDate ? new Date(startDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      project: { connect: { id: Number(projectId) } },
      author: { connect: { userId: Number(authorUserId) } },
    };

    // Only connect an assignee if one is provided
    if (assignedUserId) {
      taskData.assignee = { connect: { userId: Number(assignedUserId) } };
    }

    const newTask = await prisma.task.create({ data: taskData });
    res.status(201).json(newTask);
  } catch (error: any) {
    console.error("Prisma Error:", error); // Log the detailed prisma error
    res.status(500).json({ message: `Error creating task: ${error.message}` });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task status: ${error.message}` });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const updateData = req.body;

  try {
    // Remove fields that shouldn't be updated directly
    const { id, ...allowedUpdates } = updateData;

    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: allowedUpdates,
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task: ${error.message}` });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;

  try {
    // First, delete all related records to avoid foreign key constraint violations
    await prisma.taskAssignment.deleteMany({
      where: { taskId: Number(taskId) },
    });

    await prisma.attachment.deleteMany({
      where: { taskId: Number(taskId) },
    });

    await prisma.comment.deleteMany({
      where: { taskId: Number(taskId) },
    });

    // Then delete the task itself
    await prisma.task.delete({
      where: {
        id: Number(taskId),
      },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: `Error deleting task: ${error.message}` });
  }
};

export const duplicateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;

  try {
    // Get the original task
    const originalTask = await prisma.task.findUnique({
      where: { id: Number(taskId) },
      include: {
        author: true,
        assignee: true,
      },
    });

    if (!originalTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Create a duplicate with modified title
    const duplicateData = {
      title: `${originalTask.title} (Copy)`,
      description: originalTask.description,
      status: 'To Do', // Reset status for duplicate
      priority: originalTask.priority,
      tags: originalTask.tags,
      points: originalTask.points,
      startDate: originalTask.startDate,
      dueDate: originalTask.dueDate,
      projectId: originalTask.projectId,
      authorUserId: originalTask.authorUserId,
      assignedUserId: originalTask.assignedUserId,
    };

    const newTask = await prisma.task.create({
      data: duplicateData,
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });

    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error duplicating task: ${error.message}` });
  }
};
