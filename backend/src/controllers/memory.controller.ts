import type { Express, Response } from "express";
import mongoose from "mongoose";

import {
  deleteCloudinaryAsset,
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
} from "../lib/cloudinary.js";
import {
  memoryMetadataCreateSchema,
  memoryUpdateSchema,
} from "../lib/memory-schemas.js";
import type { AuthedRequest } from "../middleware/auth.middleware.js";
import { Memory } from "../models/Memory.model.js";

function toYmd(d: Date) {
  return d.toISOString().slice(0, 10);
}

function startOfUtcDay(d: Date) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

function serializeMemory(doc: {
  _id: mongoose.Types.ObjectId;
  kind: string;
  title: string;
  description?: string;
  memoryDate: Date;
  location?: string;
  people?: string[];
  emotions?: string[];
  tags?: string[];
  content?: string;
  media?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: String(doc._id),
    kind: doc.kind,
    title: doc.title,
    description: doc.description ?? "",
    memoryDate: doc.memoryDate.toISOString(),
    location: doc.location ?? "",
    people: doc.people ?? [],
    emotions: doc.emotions ?? [],
    tags: doc.tags ?? [],
    content: doc.content ?? "",
    media: doc.media ?? null,
    createdAt: doc.createdAt?.toISOString() ?? null,
    updatedAt: doc.updatedAt?.toISOString() ?? null,
  };
}

export async function listMemories(req: AuthedRequest, res: Response) {
  const { userId } = req.auth;
  const limit = Math.min(Number(req.query.limit) || 24, 60);
  const items = await Memory.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  res.json({ memories: items.map(serializeMemory) });
}

export async function getStats(req: AuthedRequest, res: Response) {
  const { userId } = req.auth;
  const uid = new mongoose.Types.ObjectId(userId);
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const [total, thisMonth, byKind] = await Promise.all([
    Memory.countDocuments({ userId: uid }),
    Memory.countDocuments({ userId: uid, createdAt: { $gte: monthStart } }),
    Memory.aggregate<{ _id: string; count: number }>([
      { $match: { userId: uid } },
      { $group: { _id: "$kind", count: { $sum: 1 } } },
    ]),
  ]);

  const kindMap = Object.fromEntries(byKind.map((k) => [k._id, k.count]));

  res.json({
    total,
    thisMonth,
    byKind: {
      photo: kindMap.photo ?? 0,
      video: kindMap.video ?? 0,
      voice: kindMap.voice ?? 0,
      text: kindMap.text ?? 0,
    },
  });
}

export async function getOnThisDay(req: AuthedRequest, res: Response) {
  const { userId } = req.auth;
  const uid = new mongoose.Types.ObjectId(userId);
  const now = new Date();
  const month = Number(req.query.month ?? now.getUTCMonth() + 1);
  const day = Number(req.query.day ?? now.getUTCDate());
  if (!Number.isFinite(month) || !Number.isFinite(day)) {
    res.status(400).json({ message: "Invalid month or day." });
    return;
  }

  const md = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const memories = await Memory.find({
    userId: uid,
    $expr: {
      $eq: [
        {
          $dateToString: {
            format: "%m-%d",
            date: "$memoryDate",
            timezone: "UTC",
          },
        },
        md,
      ],
    },
  })
    .sort({ memoryDate: -1 })
    .limit(12)
    .lean();

  res.json({ memories: memories.map(serializeMemory) });
}

export async function getInsights(req: AuthedRequest, res: Response) {
  const { userId } = req.auth;
  const uid = new mongoose.Types.ObjectId(userId);
  const recent = await Memory.find({ userId: uid })
    .sort({ createdAt: -1 })
    .limit(40)
    .select({ emotions: 1, tags: 1 })
    .lean();

  const emotionCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();
  for (const m of recent) {
    for (const e of m.emotions ?? []) {
      emotionCounts.set(e, (emotionCounts.get(e) ?? 0) + 1);
    }
    for (const t of m.tags ?? []) {
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
    }
  }

  const topEmotions = [...emotionCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label, count]) => ({ label, count }));
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, count]) => ({ label, count }));

  let whisper = "Your archive is still gathering its first feelings.";
  if (topEmotions.length) {
    const lead = topEmotions[0]?.label ?? "soft light";
    whisper = `Lately your memories lean toward “${lead}” — tender, cinematic, yours.`;
  } else if (topTags.length) {
    whisper = `Threads like “${topTags[0]?.label}” keep returning, like a favorite ribbon in a scrapbook.`;
  }

  res.json({ topEmotions, topTags, whisper });
}

export async function getStreak(req: AuthedRequest, res: Response) {
  const { userId } = req.auth;
  const uid = new mongoose.Types.ObjectId(userId);
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 400);
  since.setUTCHours(0, 0, 0, 0);

  const docs = await Memory.find({
    userId: uid,
    memoryDate: { $gte: since },
  })
    .select({ memoryDate: 1 })
    .lean();

  const days = new Set<string>();
  for (const d of docs) {
    days.add(toYmd(startOfUtcDay(new Date(d.memoryDate))));
  }

  let streak = 0;
  for (let i = 0; i < 400; i += 1) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = toYmd(startOfUtcDay(d));
    if (days.has(key)) streak += 1;
    else break;
  }

  res.json({ streak, daysWithMemories: days.size });
}

export async function createMemory(req: AuthedRequest, res: Response) {
  try {
    const { userId } = req.auth;
    const rawMeta = req.body?.metadata;
    if (typeof rawMeta !== "string") {
      res.status(400).json({ message: "Missing metadata JSON." });
      return;
    }
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawMeta);
    } catch {
      res.status(400).json({ message: "Invalid metadata JSON." });
      return;
    }
    const parsed = memoryMetadataCreateSchema.safeParse(parsedJson);
    if (!parsed.success) {
      res.status(400).json({
        message: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const meta = parsed.data;

    const file = (req as AuthedRequest & { file?: Express.Multer.File }).file;

    if (meta.kind === "text") {
      if (!meta.content?.trim()) {
        res.status(400).json({ message: "Text memories need content." });
        return;
      }
      const doc = await Memory.create({
        userId,
        kind: "text",
        title: meta.title,
        description: meta.description,
        memoryDate: meta.memoryDate,
        location: meta.location,
        people: meta.people,
        emotions: meta.emotions,
        tags: meta.tags,
        content: meta.content,
      });
      res.status(201).json({ memory: serializeMemory(doc.toObject()) });
      return;
    }

    if (!file) {
      res.status(400).json({ message: "A file is required for this memory type." });
      return;
    }

    if (!isCloudinaryConfigured()) {
      res.status(503).json({
        message:
          "Media uploads are not configured. Set CLOUDINARY_* environment variables.",
      });
      return;
    }

    const rt =
      meta.kind === "photo"
        ? "image"
        : meta.kind === "video"
          ? "video"
          : "raw";

    const uploaded = await uploadBufferToCloudinary(file.buffer, {
      folder: `afterglow/${userId}`,
      resource_type: rt === "image" ? "image" : rt === "video" ? "video" : "raw",
    });

    const doc = await Memory.create({
      userId,
      kind: meta.kind,
      title: meta.title,
      description: meta.description,
      memoryDate: meta.memoryDate,
      location: meta.location,
      people: meta.people,
      emotions: meta.emotions,
      tags: meta.tags,
      content: "",
      media: {
        publicId: uploaded.public_id,
        secureUrl: uploaded.secure_url,
        resourceType: uploaded.resource_type as "image" | "video" | "raw",
        format: uploaded.format ?? "",
        bytes: uploaded.bytes ?? file.size,
        duration: uploaded.duration,
      },
    });

    res.status(201).json({ memory: serializeMemory(doc.toObject()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed." });
  }
}

export async function createTextMemory(req: AuthedRequest, res: Response) {
  const parsed = memoryMetadataCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed.",
      issues: parsed.error.flatten().fieldErrors,
    });
    return;
  }
  const meta = parsed.data;
  if (meta.kind !== "text") {
    res.status(400).json({ message: "Use multipart upload for media memories." });
    return;
  }
  if (!meta.content?.trim()) {
    res.status(400).json({ message: "Text memories need content." });
    return;
  }

  const doc = await Memory.create({
    userId: req.auth.userId,
    kind: "text",
    title: meta.title,
    description: meta.description,
    memoryDate: meta.memoryDate,
    location: meta.location,
    people: meta.people,
    emotions: meta.emotions,
    tags: meta.tags,
    content: meta.content,
  });

  res.status(201).json({ memory: serializeMemory(doc.toObject()) });
}

export async function updateMemory(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid id." });
    return;
  }
  const parsed = memoryUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed.",
      issues: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const doc = await Memory.findOne({ _id: id, userId: req.auth.userId });
  if (!doc) {
    res.status(404).json({ message: "Memory not found." });
    return;
  }

  const patch = parsed.data;
  if (patch.title !== undefined) doc.title = patch.title;
  if (patch.description !== undefined) doc.description = patch.description;
  if (patch.memoryDate !== undefined) doc.memoryDate = patch.memoryDate;
  if (patch.location !== undefined) doc.location = patch.location;
  if (patch.people !== undefined) doc.people = patch.people;
  if (patch.emotions !== undefined) doc.emotions = patch.emotions;
  if (patch.tags !== undefined) doc.tags = patch.tags;
  if (patch.content !== undefined) doc.content = patch.content;

  await doc.save();
  res.json({ memory: serializeMemory(doc.toObject()) });
}

export async function deleteMemory(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid id." });
    return;
  }
  const doc = await Memory.findOne({ _id: id, userId: req.auth.userId });
  if (!doc) {
    res.status(404).json({ message: "Memory not found." });
    return;
  }

  if (doc.media?.publicId && isCloudinaryConfigured()) {
    try {
      await deleteCloudinaryAsset(
        doc.media.publicId,
        doc.media.resourceType as "image" | "video" | "raw",
      );
    } catch {
      /* still delete DB record */
    }
  }

  await doc.deleteOne();
  res.json({ ok: true });
}
