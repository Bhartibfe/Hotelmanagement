import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate } from "../middleware/auth";
import { sendEmail } from "../services/email.service";
import { newMessageReceived } from "../templates/email.templates";

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
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user!.userId, receiverId: req.params.userId },
          { senderId: req.params.userId, receiverId: req.user!.userId },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: limit,
      skip: (page - 1) * limit,
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

    // Send email to receiver
    const [receiver, sender] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.params.userId }, select: { email: true, firstName: true } }),
      prisma.user.findUnique({ where: { id: req.user!.userId }, select: { firstName: true, lastName: true } }),
    ]);
    if (receiver && sender) {
      const preview = content.length > 150 ? content.substring(0, 150) + "..." : content;
      sendEmail(receiver.email, `New message from ${sender.firstName} - Hotel Sircle`, newMessageReceived(receiver.firstName, `${sender.firstName} ${sender.lastName}`, preview));
    }

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
