import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;

  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    res.json({ tasks: [], projects: [], users: [], teams: [] });
    return;
  }

  try {
    const searchTerm = query.trim();

    // Search tasks
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { description: { contains: searchTerm } },
          { status: { contains: searchTerm } },
          { priority: { contains: searchTerm } },
          { tags: { contains: searchTerm } },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
      take: 10, // Limit results for performance
    });

    // Search projects
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { teamname: { contains: searchTerm } },
          { description: { contains: searchTerm } },
        ],
      },
      take: 10,
    });

    // Search users
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: searchTerm } },
          { email: { contains: searchTerm } },
        ],
      },
      take: 10,
    });

    // Search teams
    const teams = await prisma.team.findMany({
      where: {
        teamname: { contains: searchTerm },
      },
      include: {
        users: true,
      },
      take: 10,
    });

    res.json({ tasks, projects, users, teams });
  } catch (error: any) {
    console.error('Search error:', error);
    res
      .status(500)
      .json({ message: `Error performing search: ${error.message}` });
  }
};
