import { Router } from "express";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount
} from "../controllers/notificationController";

const router = Router();

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:notificationId/read", markAsRead);
router.patch("/mark-all-read", markAllAsRead);
router.delete("/:notificationId", deleteNotification);

export default router;
