"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@afterglow/shared";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";

import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [done, setDone] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: "", password: "" },
  });

  React.useEffect(() => {
    form.setValue("token", token);
  }, [token, form]);

  async function onSubmit(values: ResetPasswordInput) {
    setFormError(null);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json()) as { message?: string };
    if (!res.ok) {
      setFormError(data.message ?? "Unable to reset password.");
      return;
    }
    setDone(true);
  }

  if (!token) {
    return (
      <GlassCard className="space-y-4 rounded-scrapbook p-8 text-center shadow-lift">
        <p className="font-display text-2xl font-semibold text-foreground">
          Missing reset link
        </p>
        <p className="text-sm text-muted-foreground">
          This page needs a valid token from your email. Request a new link
          below.
        </p>
        <Button asChild className="rounded-full">
          <Link href="/forgot-password">Request reset</Link>
        </Button>
      </GlassCard>
    );
  }

  if (done) {
    return (
      <GlassCard className="space-y-4 rounded-scrapbook p-8 text-center shadow-lift">
        <p className="font-display text-2xl font-semibold text-foreground">
          Password updated
        </p>
        <p className="text-sm text-muted-foreground">
          Your archive is sealed with a new key. You can sign in now.
        </p>
        <Button asChild className="rounded-full shadow-lift">
          <Link href="/login">Sign in</Link>
        </Button>
      </GlassCard>
    );
  }

  return (
    <GlassCard tone="lilac" className="space-y-6 rounded-scrapbook p-8 shadow-lift">
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <input type="hidden" {...form.register("token")} />

        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters, letters + numbers"
            {...form.register("password")}
          />
          {form.formState.errors.password?.message ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.password.message}
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
          {form.formState.isSubmitting ? "Saving…" : "Save new password"}
        </Button>
      </form>
    </GlassCard>
  );
}
