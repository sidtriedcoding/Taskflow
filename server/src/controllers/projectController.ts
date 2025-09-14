import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { teamname, description, startDate, endDate } = req.body;

  // --- START OF ROBUST VALIDATION ---
  if (!teamname || !startDate || !endDate) {
    res.status(400).json({
      message:
        "Missing required fields. Required: teamname, startDate, and endDate.",
    });
    return;
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
    res.status(400).json({
      message:
        "Invalid date format. Please use a valid ISO date string (e.g., '2024-12-31T00:00:00.000Z').",
    });
    return;
  }
  // --- END OF ROBUST VALIDATION ---

  try {
    const newProject = await prisma.project.create({
      data: {
        teamname: teamname, // Use teamname directly from request body
        description,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      },
    });
    res.status(201).json(newProject);
  } catch (error: any) {
    console.error("Prisma Error:", error);
    res
      .status(500)
      .json({ message: `Error creating project: ${error.message}` });
  }
};
