import { z } from "zod";

const kind = z.enum(["photo", "video", "voice", "text"]);

export const memoryFormSchema = z
  .object({
    kind: kind,
    title: z.string().min(1).max(200),
    description: z.string().max(8000).optional().default(""),
    memoryDate: z.string().min(1),
    location: z.string().max(500).optional().default(""),
    peopleText: z.string().max(2000).optional().default(""),
    emotionsText: z.string().max(2000).optional().default(""),
    tagsText: z.string().max(2000).optional().default(""),
    content: z.string().max(20000).optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.kind === "text" && !data.content.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Write something for this memory.",
        path: ["content"],
      });
    }
  });

export type MemoryFormValues = z.infer<typeof memoryFormSchema>;

export function splitList(s: string) {
  return s
    .split(/[,|]/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function buildMetadataPayload(values: MemoryFormValues) {
  return {
    kind: values.kind,
    title: values.title,
    description: values.description,
    memoryDate: new Date(values.memoryDate).toISOString(),
    location: values.location,
    people: splitList(values.peopleText),
    emotions: splitList(values.emotionsText),
    tags: splitList(values.tagsText),
    content: values.content,
  };
}
