import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthGlassShell } from "@/components/auth/auth-glass-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Return to your softly glowing archive.",
};

function LoginFallback() {
  return (
    <div className="rounded-scrapbook border border-[color:var(--glass-border)] bg-[var(--glass-bg)] p-10 text-center text-sm text-muted-foreground backdrop-blur-[var(--glass-blur)]">
      Unfolding your page…
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthGlassShell
      title="Welcome back to the glow."
      subtitle="Sign in"
      footer={
        <p className="text-muted-foreground">
          By continuing, you agree to care for your memories kindly — and to
          our future terms of service.
        </p>
      }
    >
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </AuthGlassShell>
  );
}
