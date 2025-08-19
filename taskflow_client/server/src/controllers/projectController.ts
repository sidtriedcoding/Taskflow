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
  const { name, description, startDate, endDate } = req.body;

  // --- Start of Changes ---

  // Basic Validation: Check if required fields are provided.
  if (!name || !startDate || !endDate) {
    res.status(400).json({
      message: "Missing required fields: name, startDate, and endDate.",
    });
    return;
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  // Date Validation: Check if the provided date strings are valid.
  if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
    res.status(400).json({
      message:
        "Invalid date format for startDate or endDate. Please use a valid ISO date string (e.g., '2024-12-31T00:00:00.000Z').",
    });
    return;
}
  try {
    const newProject = await prisma.project.create({
      data: {
        teamname: name, // Correctly maps incoming 'name' to schema's 'teamname'
        description,
        startDate: new Date(startDate), // Use the validated start date
        endDate: new Date(endDate), // Use the validated end date
      },
    });
    res.status(201).json(newProject);
  } catch (error: any) {
    // This will catch any other database-level errors
    res
      .status(500)
      .json({ message: `Error creating project: ${error.message}` });
  }
};
