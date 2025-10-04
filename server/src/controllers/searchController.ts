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
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { status: { contains: searchTerm, mode: 'insensitive' } },
          { priority: { contains: searchTerm, mode: 'insensitive' } },
          { tags: { contains: searchTerm, mode: 'insensitive' } },
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
          { teamname: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });

    // Search users
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });

    // Search teams
    const teams = await prisma.team.findMany({
      where: {
        teamname: { contains: searchTerm, mode: 'insensitive' },
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
