import type { Metadata } from "next";

import { AuthGlassShell } from "@/components/auth/auth-glass-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "A gentle path back into your archive.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthGlassShell
      title="Even soft things need a way home."
      subtitle="Forgot password"
      footer={
        <p className="text-muted-foreground">
          We will never shout your details across the room — only a quiet note,
          if the address belongs to someone here.
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthGlassShell>
  );
}
