import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate, requireApproved } from "../middleware/auth";
import { sendEmail } from "../services/email.service";
import { postLiked, postCommented } from "../templates/email.templates";

const router = Router();

// GET /api/feed - Get feed (paginated, filters out hidden posts)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { type, authorId, page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Optionally detect logged-in user
    let currentUserId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const { AUTH_CONFIG } = require("../config/auth");
        const decoded = jwt.verify(authHeader.split(" ")[1], AUTH_CONFIG.jwtSecret) as any;
        currentUserId = decoded.userId;
      } catch { /* anonymous */ }
    }

    const where: any = { isPublic: true, isHidden: false };
    if (type) where.type = type;
    if (authorId) where.authorId = authorId as string;

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

    // Add isLiked flag if user is logged in
    let postsWithLiked = posts as any[];
    if (currentUserId) {
      const postIds = posts.map((p) => p.id);
      const userLikes = await prisma.like.findMany({
        where: { userId: currentUserId, postId: { in: postIds } },
        select: { postId: true },
      });
      const likedSet = new Set(userLikes.map((l) => l.postId));
      postsWithLiked = posts.map((p) => ({ ...p, isLiked: likedSet.has(p.id) }));
    }

    return res.json({ posts: postsWithLiked, total, page: parseInt(page as string), totalPages: Math.ceil(total / parseInt(limit as string)) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch feed" });
  }
});

// GET /api/feed/my-posts - Get current user's posts
router.get("/my-posts", authenticate, async (req: Request, res: Response) => {
  try {
    const posts = await prisma.feedPost.findMany({
      where: { authorId: req.user!.userId },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, role: true, memberType: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// POST /api/feed - Create post (approved members only)
router.post("/", authenticate, requireApproved, async (req: Request, res: Response) => {
  try {
    const { title, brief, content, type, mediaUrls, youtubeUrl, thumbnailUrl, hotelId, isPublic } = req.body;

    if (!title || !title.trim()) return res.status(400).json({ error: "Title is required" });
    if (!brief || !brief.trim()) return res.status(400).json({ error: "Brief description is required" });
    if (!content || !content.trim()) return res.status(400).json({ error: "Content is required" });

    const hasMedia = (mediaUrls && mediaUrls.length > 0) || youtubeUrl;
    if (!hasMedia) return res.status(400).json({ error: "An image or YouTube URL is required" });

    const post = await prisma.feedPost.create({
      data: {
        title: title.trim(),
        brief: brief.trim(),
        content,
        type: type || "GENERAL",
        mediaUrls: mediaUrls || [],
        youtubeUrl: youtubeUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        hotelId,
        isPublic: isPublic !== false,
        authorId: req.user!.userId,
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
    // Optionally detect logged-in user (don't require auth)
    let currentUserId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const { AUTH_CONFIG } = require("../config/auth");
        const decoded = jwt.verify(authHeader.split(" ")[1], AUTH_CONFIG.jwtSecret) as any;
        currentUserId = decoded.userId;
      } catch {
        // invalid token, continue as anonymous
      }
    }

    const post = await prisma.feedPost.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, role: true, memberType: true } },
        hotel: { select: { id: true, name: true, logo: true } },
        comments: {
          where: { parentId: null },
          include: {
            author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
            replies: {
              include: { author: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
              orderBy: { createdAt: "asc" as const },
            },
          },
          orderBy: { createdAt: "asc" as const },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check if current user has liked this post
    let isLiked = false;
    if (currentUserId) {
      const like = await prisma.like.findUnique({
        where: { userId_postId: { userId: currentUserId, postId: post.id } },
      });
      isLiked = !!like;
    }

    return res.json({ ...post, isLiked });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch post" });
  }
});

// PUT /api/feed/:id - Edit own post
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const post = await prisma.feedPost.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.authorId !== req.user!.userId && req.user!.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized to edit this post" });
    }

    const { title, brief, content, type, mediaUrls, youtubeUrl, thumbnailUrl } = req.body;
    const data: any = {};
    if (title !== undefined) data.title = title.trim();
    if (brief !== undefined) data.brief = brief.trim();
    if (content !== undefined) data.content = content;
    if (type !== undefined) data.type = type;
    if (mediaUrls !== undefined) data.mediaUrls = mediaUrls;
    if (youtubeUrl !== undefined) data.youtubeUrl = youtubeUrl || null;
    if (thumbnailUrl !== undefined) data.thumbnailUrl = thumbnailUrl || null;

    const updated = await prisma.feedPost.update({
      where: { id: req.params.id },
      data,
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, role: true, memberType: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE /api/feed/:id - Delete own post
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const post = await prisma.feedPost.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.authorId !== req.user!.userId && req.user!.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { postId: req.params.id } }),
      prisma.like.deleteMany({ where: { postId: req.params.id } }),
      prisma.savedPost.deleteMany({ where: { postId: req.params.id } }),
      prisma.feedPost.delete({ where: { id: req.params.id } }),
    ]);

    return res.json({ deleted: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete post" });
  }
});

// POST /api/feed/:id/like
router.post("/:id/like", authenticate, async (req: Request, res: Response) => {
  try {
    await prisma.like.create({
      data: { userId: req.user!.userId, postId: req.params.id },
    });

    // Send email to post author
    const likedPost = await prisma.feedPost.findUnique({
      where: { id: req.params.id },
      select: { title: true, authorId: true, author: { select: { email: true, firstName: true } } },
    });
    if (likedPost && likedPost.authorId !== req.user!.userId) {
      const liker = await prisma.user.findUnique({ where: { id: req.user!.userId }, select: { firstName: true, lastName: true } });
      if (liker) {
        sendEmail(likedPost.author.email, "Someone liked your post - Hotel Sircle", postLiked(likedPost.author.firstName, `${liker.firstName} ${liker.lastName}`, likedPost.title || "your post"));
      }
    }

    return res.status(201).json({ liked: true });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "Already liked" });
    }
    return res.status(500).json({ error: "Failed to like post" });
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

    // Send email to post author
    const commentedPost = await prisma.feedPost.findUnique({
      where: { id: req.params.id },
      select: { title: true, authorId: true, author: { select: { email: true, firstName: true } } },
    });
    if (commentedPost && commentedPost.authorId !== req.user!.userId) {
      const preview = content.length > 100 ? content.substring(0, 100) + "..." : content;
      sendEmail(commentedPost.author.email, "New comment on your post - Hotel Sircle", postCommented(commentedPost.author.firstName, `${comment.author.firstName} ${comment.author.lastName}`, commentedPost.title || "your post", preview));
    }

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
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "Already saved" });
    }
    return res.status(500).json({ error: "Failed to save post" });
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
