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
    const users = await prisma.user.findMany();

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
