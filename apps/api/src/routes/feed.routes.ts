import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate, requireApproved } from "../middleware/auth";

const router = Router();

// GET /api/feed - Get feed (paginated, filters out hidden posts)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { type, page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = { isPublic: true, isHidden: false };
    if (type) where.type = type;

    const [posts, total] = await Promise.all([
      prisma.feedPost.findMany({
        where,
        include: {
          author: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, role: true, memberType: true } },
          hotel: { select: { id: true, name: true, logo: true } },
          _count: { select: { likes: true, comments: true } },
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: "desc" },
      }),
      prisma.feedPost.count({ where }),
    ]);

    return res.json({ posts, total, page: parseInt(page as string), totalPages: Math.ceil(total / parseInt(limit as string)) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch feed" });
  }
});

// POST /api/feed - Create post (approved members only)
router.post("/", authenticate, requireApproved, async (req: Request, res: Response) => {
  try {
    const { content, type, mediaUrls, hotelId, isPublic } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const post = await prisma.feedPost.create({
      data: {
        content, type: type || "GENERAL", mediaUrls: mediaUrls || [],
        hotelId, isPublic: isPublic !== false, authorId: req.user!.userId,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, role: true, memberType: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create post" });
  }
});

// GET /api/feed/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const post = await prisma.feedPost.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, role: true, memberType: true } },
        hotel: { select: { id: true, name: true, logo: true } },
        comments: {
          include: { author: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch post" });
  }
});

// POST /api/feed/:id/like
router.post("/:id/like", authenticate, async (req: Request, res: Response) => {
  try {
    await prisma.like.create({
      data: { userId: req.user!.userId, postId: req.params.id },
    });
    return res.status(201).json({ liked: true });
  } catch {
    return res.status(409).json({ error: "Already liked" });
  }
});

// DELETE /api/feed/:id/like
router.delete("/:id/like", authenticate, async (req: Request, res: Response) => {
  try {
    await prisma.like.delete({
      where: { userId_postId: { userId: req.user!.userId, postId: req.params.id } },
    });
    return res.json({ liked: false });
  } catch {
    return res.status(404).json({ error: "Like not found" });
  }
});

// POST /api/feed/:id/comments
router.post("/:id/comments", authenticate, async (req: Request, res: Response) => {
  try {
    const { content, parentId } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const comment = await prisma.comment.create({
      data: { content, authorId: req.user!.userId, postId: req.params.id, parentId },
      include: { author: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    });
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ error: "Failed to add comment" });
  }
});

// GET /api/feed/:id/comments
router.get("/:id/comments", async (req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: req.params.id, parentId: null },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        replies: {
          include: { author: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return res.json(comments);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// POST /api/feed/:id/save
router.post("/:id/save", authenticate, async (req: Request, res: Response) => {
  try {
    await prisma.savedPost.create({
      data: { userId: req.user!.userId, postId: req.params.id },
    });
    return res.status(201).json({ saved: true });
  } catch {
    return res.status(409).json({ error: "Already saved" });
  }
});

// DELETE /api/feed/:id/save
router.delete("/:id/save", authenticate, async (req: Request, res: Response) => {
  try {
    await prisma.savedPost.delete({
      where: { userId_postId: { userId: req.user!.userId, postId: req.params.id } },
    });
    return res.json({ saved: false });
  } catch {
    return res.status(404).json({ error: "Save not found" });
  }
});

export default router;
