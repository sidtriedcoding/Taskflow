import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.query;

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId: userId ? Number(userId) : undefined,
            },
            include: {
                task: true,
                project: true,
                team: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: `Error retrieving notifications: ${error.message}` });
    }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    const { notificationId } = req.params;

    try {
        const notification = await prisma.notification.update({
            where: {
                id: Number(notificationId),
            },
            data: {
                isRead: true,
            },
        });
        res.json(notification);
    } catch (error: any) {
        res.status(500).json({ message: `Error marking notification as read: ${error.message}` });
    }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;

    try {
        await prisma.notification.updateMany({
            where: {
                userId: Number(userId),
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
        res.json({ message: 'All notifications marked as read' });
    } catch (error: any) {
        res.status(500).json({ message: `Error marking all notifications as read: ${error.message}` });
    }
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
    const { notificationId } = req.params;

    try {
        await prisma.notification.delete({
            where: {
                id: Number(notificationId),
            },
        });
        res.json({ message: 'Notification deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: `Error deleting notification: ${error.message}` });
    }
};

export const createNotification = async (
    title: string,
    message: string,
    type: string,
    userId: number,
    taskId?: number,
    projectId?: number,
    teamId?: number
): Promise<void> => {
    try {
        await prisma.notification.create({
            data: {
                title,
                message,
                type,
                userId,
                taskId,
                projectId,
                teamId,
            },
        });
    } catch (error: any) {
        console.error('Error creating notification:', error);
    }
};

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.query;

    try {
        const count = await prisma.notification.count({
            where: {
                userId: userId ? Number(userId) : undefined,
                isRead: false,
            },
        });
        res.json({ count });
    } catch (error: any) {
        res.status(500).json({ message: `Error getting unread count: ${error.message}` });
    }
};
