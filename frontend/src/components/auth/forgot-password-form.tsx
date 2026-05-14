"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@afterglow/shared";
import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";

import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [done, setDone] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setFormError(null);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json()) as { message?: string };
    if (!res.ok) {
      setFormError(data.message ?? "Something went wrong.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <GlassCard className="space-y-4 rounded-scrapbook p-8 text-center shadow-lift">
        <p className="font-display text-2xl font-semibold text-foreground">
          Check your inbox
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          If an account exists for that email, we left a quiet note with a reset
          link. In development, the link is also printed in the API terminal.
        </p>
        <Button asChild variant="outline" className="mt-2 rounded-full">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </GlassCard>
    );
  }

  return (
    <GlassCard tone="rose" className="space-y-6 rounded-scrapbook p-8 shadow-lift">
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...form.register("email")}
          />
          {form.formState.errors.email?.message ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          className="w-full rounded-full shadow-lift"
          size="lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered the feeling?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Return to sign in
        </Link>
      </p>
    </GlassCard>
  );
}
