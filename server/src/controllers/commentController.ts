import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createNotification } from "./notificationController";

const prisma = new PrismaClient();

export const createComment = async (req: Request, res: Response): Promise<void> => {
    const { taskId, text, userId } = req.body;

    try {
        const comment = await prisma.comment.create({
            data: {
                text,
                taskId: Number(taskId),
                userId: Number(userId),
            },
            include: {
                task: {
                    include: {
                        author: true,
                        assignee: true,
                        project: true,
                    }
                },
                user: true,
            },
        });

        // Create notifications for task author and assignee (if different from commenter)
        const task = comment.task;
        const commenterId = Number(userId);

        // Notify the task author if they're not the commenter
        if (task.authorUserId !== commenterId) {
            await createNotification(
                `New comment on task "${task.title}"`,
                `${comment.user.username} commented: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`,
                'comment',
                task.authorUserId,
                task.id,
                task.projectId,
                undefined
            );
        }

        // Notify the task assignee if they exist and are not the commenter or author
        if (task.assignedUserId && task.assignedUserId !== commenterId && task.assignedUserId !== task.authorUserId) {
            await createNotification(
                `New comment on task "${task.title}"`,
                `${comment.user.username} commented: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`,
                'comment',
                task.assignedUserId,
                task.id,
                task.projectId,
                undefined
            );
        }

        res.status(201).json(comment);
    } catch (error: any) {
        res.status(500).json({ message: `Error creating comment: ${error.message}` });
    }
};

export const getComments = async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.query;

    try {
        const comments = await prisma.comment.findMany({
            where: {
                taskId: taskId ? Number(taskId) : undefined,
            },
            include: {
                user: true,
                task: true,
            },
            orderBy: {
                id: 'desc',
            },
        });
        res.json(comments);
    } catch (error: any) {
        res.status(500).json({ message: `Error retrieving comments: ${error.message}` });
    }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;

    try {
        await prisma.comment.delete({
            where: {
                id: Number(commentId),
            },
        });
        res.json({ message: 'Comment deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: `Error deleting comment: ${error.message}` });
    }
};
