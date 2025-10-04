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

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  const { teamname, productOwnerUserId } = req.body;

  try {
    // Validate required fields
    if (!teamname) {
      res.status(400).json({
        message: "Missing required fields. Required: teamname",
      });
      return;
    }

    // Check if team already exists
    const existingTeam = await prisma.team.findFirst({
      where: { teamname },
    });

    if (existingTeam) {
      res.status(409).json({
        message: "Team already exists with this name",
      });
      return;
    }

    // Validate product owner if provided
    if (productOwnerUserId) {
      const productOwner = await prisma.user.findUnique({
        where: { userId: Number(productOwnerUserId) },
      });

      if (!productOwner) {
        res.status(400).json({
          message: "Product owner user not found",
        });
        return;
      }
    }

    // Create new team
    const newTeam = await prisma.team.create({
      data: {
        teamname,
        productOwnerUserId: productOwnerUserId ? Number(productOwnerUserId) : null,
      },
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

    // Get product owner username if exists
    let productOwnerUsername = null;
    if (newTeam.productOwnerUserId) {
      const productOwner = await prisma.user.findUnique({
        where: { userId: newTeam.productOwnerUserId },
        select: { username: true },
      });
      productOwnerUsername = productOwner?.username || null;
    }

    const teamWithDetails = {
      ...newTeam,
      productOwnerUsername,
      userCount: newTeam.users.length,
    };

    res.status(201).json(teamWithDetails);
  } catch (error: any) {
    console.error("Failed to create team:", error);
    res.status(500).json({
      message: "Error creating team.",
      error: error.message,
    });
  }
};
