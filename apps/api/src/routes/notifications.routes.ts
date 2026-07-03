import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET /api/notifications
router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: req.user!.userId },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where: { userId: req.user!.userId } }),
      prisma.notification.count({ where: { userId: req.user!.userId, isRead: false } }),
    ]);

    return res.json({ notifications, total, unreadCount, page: parseInt(page as string) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// PUT /api/notifications/:id/read
router.put("/:id/read", authenticate, async (req: Request, res: Response) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id, userId: req.user!.userId },
      data: { isRead: true },
    });
    return res.json({ read: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to mark as read" });
  }
});

// PUT /api/notifications/read-all
router.put("/read-all", authenticate, async (req: Request, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, isRead: false },
      data: { isRead: true },
    });
    return res.json({ readAll: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to mark all as read" });
  }
});

export default router;
