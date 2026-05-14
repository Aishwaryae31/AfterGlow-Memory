import { SiteNavbar } from "@/components/landing/site-navbar";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteNavbar />
      {children}
    </>
  );
}
