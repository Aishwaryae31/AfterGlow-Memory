"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Image, Loader2, Mic, Sparkles, Type, Upload, Video, X } from "lucide-react";
import ImageNext from "next/image";
import * as React from "react";
import { useForm } from "react-hook-form";

import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slideFromBottom } from "@/lib/motion-presets";
import {
  buildMetadataPayload,
  memoryFormSchema,
  type MemoryFormValues,
} from "@/lib/validation/memory-form";
import { cn } from "@/lib/utils";
import type { MemoryKind } from "@/types/memory";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const kinds: { id: MemoryKind; label: string; icon: typeof Image }[] = [
  { id: "photo", label: "Photo", icon: Image },
  { id: "video", label: "Video", icon: Video },
  { id: "voice", label: "Voice", icon: Mic },
  { id: "text", label: "Text", icon: Type },
];

export function MemoryUploadModal({ open, onClose, onCreated }: Props) {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<MemoryFormValues>({
    resolver: zodResolver(memoryFormSchema),
    defaultValues: {
      kind: "photo",
      title: "",
      description: "",
      memoryDate: new Date().toISOString().slice(0, 10),
      location: "",
      peopleText: "",
      emotionsText: "",
      tagsText: "",
      content: "",
    },
  });

  const kind = form.watch("kind");

  React.useEffect(() => {
    if (kind === "text") {
      setFile(null);
      setPreview(null);
    }
  }, [kind]);

  React.useEffect(() => {
    if (!file || kind === "text") {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, kind]);

  function resetState() {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setError(null);
    setBusy(false);
    form.reset({
      kind: "photo",
      title: "",
      description: "",
      memoryDate: new Date().toISOString().slice(0, 10),
      location: "",
      peopleText: "",
      emotionsText: "",
      tagsText: "",
      content: "",
    });
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function pickFiles(list: FileList | null) {
    if (!list?.[0]) return;
    setFile(list[0]);
    setError(null);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (kind === "text") return;
    pickFiles(e.dataTransfer.files);
  }

  async function submit(values: MemoryFormValues) {
    setError(null);
    setBusy(true);
    setProgress(0);
    try {
      if (values.kind === "text") {
        const res = await fetch("/api/memories/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildMetadataPayload(values)),
          credentials: "same-origin",
        });
        if (!res.ok) {
          const j = (await res.json()) as { message?: string };
          throw new Error(j.message ?? "Could not save text memory.");
        }
        onCreated();
        handleClose();
        return;
      }

      if (!file) {
        throw new Error("Choose a file to upload, or switch to Text.");
      }

      const meta = buildMetadataPayload(values);
      const fd = new FormData();
      fd.append("metadata", JSON.stringify(meta));
      fd.append("file", file);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/memories");
        xhr.withCredentials = true;
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            setProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else {
            try {
              const j = JSON.parse(xhr.responseText) as { message?: string };
              reject(new Error(j.message ?? "Upload failed."));
            } catch {
              reject(new Error("Upload failed."));
            }
          }
        };
        xhr.onerror = () => reject(new Error("Network error."));
        xhr.send(fd);
      });

      onCreated();
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }

  const accept =
    kind === "photo"
      ? "image/*"
      : kind === "video"
        ? "video/*"
        : kind === "voice"
          ? "audio/*"
          : "";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/35 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            variants={slideFromBottom}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative z-10 w-full max-w-lg"
          >
            <GlassCard className="max-h-[90dvh] overflow-y-auto rounded-scrapbook p-6 shadow-lift sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                    New memory
                  </p>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                    Tuck something into the glow
                  </h2>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-full"
                  onClick={handleClose}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {kinds.map((k) => {
                    const Icon = k.icon;
                    const active = kind === k.id;
                    return (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => form.setValue("kind", k.id)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-xs font-medium transition-all",
                          active
                            ? "border-primary bg-primary/15 text-foreground shadow-tape"
                            : "border-transparent bg-white/30 text-muted-foreground hover:bg-white/50 dark:bg-white/5",
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                        {k.label}
                      </button>
                    );
                  })}
                </div>

                {kind !== "text" ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    className={cn(
                      "relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors",
                      dragOver
                        ? "border-primary bg-primary/10"
                        : "border-primary/25 bg-white/25 hover:border-primary/40 dark:bg-white/5",
                    )}
                    role="presentation"
                    onClick={() => inputRef.current?.click()}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept={accept}
                      className="hidden"
                      onChange={(e) => pickFiles(e.target.files)}
                    />
                    <Upload className="mb-2 h-8 w-8 text-primary" aria-hidden />
                    <p className="text-sm font-medium text-foreground">
                      Drag & drop or tap to choose
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {kind === "photo" && "JPG, PNG, WEBP — up to 60MB"}
                      {kind === "video" && "MP4, MOV — up to 60MB"}
                      {kind === "voice" && "M4A, MP3, WAV — up to 60MB"}
                    </p>
                    {file ? (
                      <p className="mt-3 max-w-full truncate text-xs text-muted-foreground">
                        {file.name}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {preview && kind !== "text" ? (
                  <div className="relative mx-auto aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-white/50 shadow-inner">
                    {kind === "photo" ? (
                      <ImageNext
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <video
                        src={preview}
                        className="h-full w-full object-cover"
                        controls
                      />
                    )}
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="mem-title">Title</Label>
                  <Input id="mem-title" {...form.register("title")} />
                  {form.formState.errors.title?.message ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mem-desc">Description</Label>
                  <textarea
                    id="mem-desc"
                    rows={3}
                    className="flex w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm shadow-sm backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...form.register("description")}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mem-date">Memory date</Label>
                    <Input id="mem-date" type="date" {...form.register("memoryDate")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mem-loc">Location</Label>
                    <Input id="mem-loc" {...form.register("location")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mem-people">People (comma-separated)</Label>
                  <Input id="mem-people" {...form.register("peopleText")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mem-emotions">Emotions (comma-separated)</Label>
                  <Input id="mem-emotions" placeholder="nostalgic, hopeful…" {...form.register("emotionsText")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mem-tags">Tags</Label>
                  <Input id="mem-tags" {...form.register("tagsText")} />
                </div>

                {kind === "text" ? (
                  <div className="space-y-2">
                    <Label htmlFor="mem-content">Your words</Label>
                    <textarea
                      id="mem-content"
                      rows={6}
                      className="flex w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm shadow-sm backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...form.register("content")}
                    />
                    {form.formState.errors.content?.message ? (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.content.message}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {busy && progress > 0 ? (
                  <div className="space-y-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blush-400 via-primary to-blush-600 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-center text-xs text-muted-foreground">
                      Uploading… {progress}%
                    </p>
                  </div>
                ) : null}

                {error ? (
                  <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 rounded-full shadow-lift"
                    disabled={busy}
                  >
                    {busy ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Seal memory
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={handleClose}
                    disabled={busy}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
