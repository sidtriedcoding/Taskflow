import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        users: {
          select: {
            userId: true,
            username: true,
            email: true,
          },
        },
      },
    });

    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        let productOwner = null;

        if (team.productOwnerUserId) {
          productOwner = await prisma.user.findUnique({
            where: { userId: team.productOwnerUserId },
            select: { username: true },
          });
        }

        return {
          ...team,
          productOwnerUsername: productOwner?.username || null,
          userCount: team.users.length,
        };
      })
    );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};
