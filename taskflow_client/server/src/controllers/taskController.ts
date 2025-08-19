import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This function was already correct, but is included for completeness.
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        // Ensure projectId is a number before querying
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

// This is the new, corrected function for creating tasks.
export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
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

  // --- Start of Validation ---
  if (!title || !priority || !tags || !projectId || !authorUserId) {
    res.status(400).json({
      message:
        "Missing required fields: title, priority, tags, projectId, authorUserId.",
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
  // --- End of Validation ---

  try {
    // Build the data object for Prisma
    const taskData: any = {
      title,
      description,
      status,
      priority,
      tags,
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
    const updateTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
    });
    res.json(updateTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating tasks: ${error.message}` });
  }
};
