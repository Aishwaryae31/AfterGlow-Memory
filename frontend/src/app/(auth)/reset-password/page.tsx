import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthGlassShell } from "@/components/auth/auth-glass-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Seal your archive with a new key.",
};

function ResetFallback() {
  return (
    <div className="rounded-scrapbook border border-[color:var(--glass-border)] bg-[var(--glass-bg)] p-10 text-center text-sm text-muted-foreground backdrop-blur-[var(--glass-blur)]">
      Finding your ribbon…
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthGlassShell
      title="Choose a new password, softly."
      subtitle="Reset password"
      footer={
        <p className="text-muted-foreground">
          Links expire after an hour — like polaroid chemistry settling into its
          final blush.
        </p>
      }
    >
      <Suspense fallback={<ResetFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthGlassShell>
  );
}
