import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // DIAGNOSTIC STEP: The query has been simplified to its most basic form
    // by removing the `select` clause. If this works, the issue is with one of
    // the specific fields in the previous `select` statement. If the server
    // still crashes, the problem is likely with the database connection
    // or the Prisma Client setup itself.
    const users = await prisma.user.findMany({
      include: {
        team: {
          select: {
            id: true,
            teamname: true,
          },
        },
      },
    });

    res.json(users);
  } catch (error: any) {
    // Enhanced error logging to provide more details in the server console.
    console.error("Failed to retrieve users:", error);

    // Provide a more detailed error response to help with debugging
    res.status(500).json({
      message: "Error retrieving users.",
      error: error.message,
      // Adding the error code can help identify Prisma-specific issues
      code: error.code,
    });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, cognitoId, profilePictureUrl, teamId } = req.body;

  try {
    // Validate required fields
    if (!username || !email || !cognitoId) {
      res.status(400).json({
        message: "Missing required fields. Required: username, email, cognitoId",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
          { cognitoId },
        ],
      },
    });

    if (existingUser) {
      res.status(409).json({
        message: "User already exists with this username, email, or cognitoId",
      });
      return;
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        cognitoId,
        profilePictureUrl: profilePictureUrl || null,
        teamId: teamId ? Number(teamId) : null,
      },
      include: {
        team: {
          select: {
            id: true,
            teamname: true,
          },
        },
      },
    });

    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Failed to create user:", error);
    res.status(500).json({
      message: "Error creating user.",
      error: error.message,
    });
  }
};
