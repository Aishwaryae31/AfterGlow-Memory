import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthGlassShell } from "@/components/auth/auth-glass-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Begin preserving what still shimmers.",
};

function SignupFallback() {
  return (
    <div className="rounded-scrapbook border border-[color:var(--glass-border)] bg-[var(--glass-bg)] p-10 text-center text-sm text-muted-foreground backdrop-blur-[var(--glass-blur)]">
      Gathering petals…
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthGlassShell
      title="Begin your archive in blush light."
      subtitle="Create account"
      footer={
        <p className="text-muted-foreground">
          Passwords need letters and numbers — like a diary lock with two kinds
          of tenderness.
        </p>
      }
    >
      <Suspense fallback={<SignupFallback />}>
        <SignupForm />
      </Suspense>
    </AuthGlassShell>
  );
}
