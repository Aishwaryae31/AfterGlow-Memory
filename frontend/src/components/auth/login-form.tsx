"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@afterglow/shared";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";

import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = React.useState<string | null>(null);
  const googleEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setFormError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json()) as { message?: string };
    if (!res.ok) {
      setFormError(data.message ?? "Unable to sign in.");
      return;
    }
    const next = searchParams.get("next") ?? "/dashboard";
    router.replace(next);
    router.refresh();
  }

  async function onGoogleCredential(credential: string) {
    setFormError(null);
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    const data = (await res.json()) as { message?: string };
    if (!res.ok) {
      setFormError(data.message ?? "Google sign-in failed.");
      return;
    }
    const next = searchParams.get("next") ?? "/dashboard";
    router.replace(next);
    router.refresh();
  }

  return (
    <GlassCard tone="rose" className="space-y-8 rounded-scrapbook p-8 shadow-lift">
      {googleEnabled ? (
        <div className="flex flex-col items-center gap-3">
          <GoogleLogin
            onSuccess={(cred) => {
              if (cred.credential) void onGoogleCredential(cred.credential);
            }}
            onError={() =>
              setFormError("Google could not finish signing you in.")
            }
            useOneTap={false}
            theme="filled_blue"
            shape="pill"
            size="large"
            text="continue_with"
          />
          <p className="text-xs text-muted-foreground">
            Or continue with the email you keep like a pressed flower.
          </p>
        </div>
      ) : null}

      {googleEnabled ? (
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 top-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="relative bg-[var(--glass-bg)] px-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Email
          </span>
        </div>
      ) : null}

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

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
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
          {form.formState.isSubmitting ? "Signing you in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </GlassCard>
  );
}
