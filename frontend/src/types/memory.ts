export type MemoryKind = "photo" | "video" | "voice" | "text";

export type MemoryMedia = {
  publicId: string;
  secureUrl: string;
  resourceType: "image" | "video" | "raw";
  format: string;
  bytes: number;
  duration?: number;
} | null;

export type MemoryRecord = {
  id: string;
  kind: MemoryKind;
  title: string;
  description: string;
  memoryDate: string;
  location: string;
  people: string[];
  emotions: string[];
  tags: string[];
  content: string;
  media: MemoryMedia;
  createdAt: string | null;
  updatedAt: string | null;
};

export type MemoryStats = {
  total: number;
  thisMonth: number;
  byKind: Record<MemoryKind, number>;
};

export type MemoryInsights = {
  topEmotions: { label: string; count: number }[];
  topTags: { label: string; count: number }[];
  whisper: string;
};

export type MemoryStreak = {
  streak: number;
  daysWithMemories: number;
};
