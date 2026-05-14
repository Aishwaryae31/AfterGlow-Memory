import { z } from "zod";

export const memoryKindSchema = z.enum(["photo", "video", "voice", "text"]);

export const memoryMetadataCreateSchema = z.object({
  kind: memoryKindSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(8000).optional().default(""),
  memoryDate: z.coerce.date(),
  location: z.string().max(500).optional().default(""),
  people: z.array(z.string().max(120)).max(80).optional().default([]),
  emotions: z.array(z.string().max(40)).max(40).optional().default([]),
  tags: z.array(z.string().max(40)).max(60).optional().default([]),
  content: z.string().max(20000).optional().default(""),
});

export const memoryUpdateSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(8000).optional(),
    memoryDate: z.coerce.date().optional(),
    location: z.string().max(500).optional(),
    people: z.array(z.string().max(120)).max(80).optional(),
    emotions: z.array(z.string().max(40)).max(40).optional(),
    tags: z.array(z.string().max(40)).max(60).optional(),
    content: z.string().max(20000).optional(),
  })
  .strict();

export type MemoryMetadataCreate = z.infer<typeof memoryMetadataCreateSchema>;
export type MemoryUpdate = z.infer<typeof memoryUpdateSchema>;
