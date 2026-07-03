import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate } from "../middleware/auth";

const router = Router();

// POST /api/connections - Send connection request
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { receiverId, type, message } = req.body;
    if (!receiverId || !type) return res.status(400).json({ error: "Receiver and type required" });
    if (receiverId === req.user!.userId) return res.status(400).json({ error: "Cannot connect to yourself" });

    const connection = await prisma.connection.create({
      data: { senderId: req.user!.userId, receiverId, type, message },
      include: {
        receiver: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
    });

    return res.status(201).json(connection);
  } catch {
    return res.status(409).json({ error: "Connection already exists" });
  }
});

// GET /api/connections - List my connections
router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { status = "ACCEPTED" } = req.query;
    const connections = await prisma.connection.findMany({
      where: {
        OR: [
          { senderId: req.user!.userId },
          { receiverId: req.user!.userId },
        ],
        status: status as any,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, role: true } },
        receiver: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch connections" });
  }
});

// GET /api/connections/pending - Pending requests
router.get("/pending", authenticate, async (req: Request, res: Response) => {
  try {
    const connections = await prisma.connection.findMany({
      where: { receiverId: req.user!.userId, status: "PENDING" },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch pending connections" });
  }
});

// PUT /api/connections/:id - Accept/reject
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const connection = await prisma.connection.findUnique({ where: { id: req.params.id } });
    if (!connection || connection.receiverId !== req.user!.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = await prisma.connection.update({
      where: { id: req.params.id },
      data: { status },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update connection" });
  }
});

// DELETE /api/connections/:id
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const connection = await prisma.connection.findUnique({ where: { id: req.params.id } });
    if (!connection || (connection.senderId !== req.user!.userId && connection.receiverId !== req.user!.userId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.connection.delete({ where: { id: req.params.id } });
    return res.json({ deleted: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete connection" });
  }
});

export default router;
