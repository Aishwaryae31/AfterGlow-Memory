import { AfterglowGoogleProvider } from "@/components/auth/google-auth-provider";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AfterglowGoogleProvider>{children}</AfterglowGoogleProvider>;
}
