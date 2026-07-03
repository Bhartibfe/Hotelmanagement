import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET /api/messages/conversations - List conversations
router.get("/conversations", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Get latest message from each conversation
    const sent = await prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ["receiverId"],
    });
    const received = await prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ["senderId"],
    });

    const contactIds = new Set([
      ...sent.map((m) => m.receiverId),
      ...received.map((m) => m.senderId),
    ]);

    const conversations = await Promise.all(
      Array.from(contactIds).map(async (contactId) => {
        const [contact, lastMessage, unreadCount] = await Promise.all([
          prisma.user.findUnique({
            where: { id: contactId },
            select: { id: true, firstName: true, lastName: true, avatar: true, title: true },
          }),
          prisma.message.findFirst({
            where: {
              OR: [
                { senderId: userId, receiverId: contactId },
                { senderId: contactId, receiverId: userId },
              ],
            },
            orderBy: { createdAt: "desc" },
          }),
          prisma.message.count({
            where: { senderId: contactId, receiverId: userId, status: { not: "READ" } },
          }),
        ]);
        return { contact, lastMessage, unreadCount };
      })
    );

    conversations.sort((a, b) => {
      const aDate = a.lastMessage?.createdAt || new Date(0);
      const bDate = b.lastMessage?.createdAt || new Date(0);
      return bDate.getTime() - aDate.getTime();
    });

    return res.json(conversations);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// GET /api/messages/:userId - Get thread with user
router.get("/:userId", authenticate, async (req: Request, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user!.userId, receiverId: req.params.userId },
          { senderId: req.params.userId, receiverId: req.user!.userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    // Mark received messages as read
    await prisma.message.updateMany({
      where: { senderId: req.params.userId, receiverId: req.user!.userId, status: { not: "READ" } },
      data: { status: "READ" },
    });

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST /api/messages/:userId - Send message
router.post("/:userId", authenticate, async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.user!.userId,
        receiverId: req.params.userId,
      },
    });
    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
