"use client";

import { AnimatePresence, motion, useScroll, useMotionTemplate, useTransform } from "framer-motion";
import { Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#features", label: "Studio" },
  { href: "#how", label: "How it works" },
  { href: "#memories", label: "Memories" },
  { href: "#stories", label: "Stories" },
] as const;

type MeUser = { id: string; email: string; name: string };

export function SiteNavbar() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [me, setMe] = React.useState<MeUser | null | undefined>(undefined);
  const { setTheme, resolvedTheme } = useTheme();
  const { scrollY } = useScroll();
  const navBlur = useTransform(scrollY, [0, 80], [12, 20]);
  const navBg = useTransform(
    scrollY,
    [0, 120],
    ["rgba(255,255,255,0.35)", "rgba(255,255,255,0.55)"],
  );
  const navBgDark = useTransform(
    scrollY,
    [0, 120],
    ["rgba(24,18,26,0.45)", "rgba(24,18,26,0.72)"],
  );
  const borderOpacity = useTransform(scrollY, [0, 100], [0.35, 0.85]);
  const backdrop = useMotionTemplate`blur(${navBlur}px)`;

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = (await res.json()) as { user: MeUser | null };
        if (!cancelled) setMe(data.user ?? null);
      } catch {
        if (!cancelled) setMe(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <motion.header
      style={{
        backdropFilter: backdrop,
        WebkitBackdropFilter: backdrop,
      }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-[color:var(--glass-border)]",
        "supports-[backdrop-filter]:bg-transparent",
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 dark:hidden"
        style={{ backgroundColor: navBg }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
        style={{ backgroundColor: navBgDark }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent dark:via-primary/25"
        style={{ opacity: borderOpacity }}
      />

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 md:h-[4.25rem]">
        <Link
          href="/"
          className="group flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-[var(--glass-bg)] shadow-glass backdrop-blur-[var(--glass-blur)] transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
          </span>
          <span className="bg-gradient-to-r from-blush-500 via-primary to-blush-700 bg-clip-text text-transparent">
            Afterglow
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/50 hover:text-foreground dark:hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          {me === undefined ? null : me ? (
            <Link
              href="/dashboard"
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/50 hover:text-foreground dark:hover:bg-white/10"
            >
              Archive
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/50 hover:text-foreground dark:hover:bg-white/10"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-white/50 dark:hover:bg-white/10"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={mounted && resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
            onClick={toggleTheme}
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-[1.125rem] w-[1.125rem]" />
            ) : (
              <Moon className="h-[1.125rem] w-[1.125rem]" />
            )}
          </Button>

          <Button
            asChild
            variant="glass"
            size="sm"
            className="hidden rounded-full sm:inline-flex"
          >
            <Link href={me ? "/dashboard" : "/signup"}>
              {me ? "Open studio" : "Begin preserving"}
            </Link>
          </Button>

          <Button
            type="button"
            variant="glass"
            size="icon"
            className="rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-[color:var(--glass-border)] bg-[var(--glass-bg)]/95 backdrop-blur-xl md:hidden"
          >
            <motion.nav
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
              }}
              className="flex flex-col gap-1 px-4 py-4"
              aria-label="Mobile"
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-white/50 dark:hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {me === undefined
                ? null
                : me
                  ? (
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: -12 },
                          show: { opacity: 1, x: 0 },
                        }}
                      >
                        <Link
                          href="/dashboard"
                          className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-white/50 dark:hover:bg-white/10"
                          onClick={() => setOpen(false)}
                        >
                          Archive
                        </Link>
                      </motion.div>
                    )
                  : (
                      <>
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, x: -12 },
                            show: { opacity: 1, x: 0 },
                          }}
                        >
                          <Link
                            href="/login"
                            className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-white/50 dark:hover:bg-white/10"
                            onClick={() => setOpen(false)}
                          >
                            Sign in
                          </Link>
                        </motion.div>
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, x: -12 },
                            show: { opacity: 1, x: 0 },
                          }}
                        >
                          <Link
                            href="/signup"
                            className="block rounded-2xl px-4 py-3 text-base font-medium text-primary transition-colors hover:bg-white/50 dark:hover:bg-white/10"
                            onClick={() => setOpen(false)}
                          >
                            Sign up
                          </Link>
                        </motion.div>
                      </>
                    )}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  show: { opacity: 1, x: 0 },
                }}
                className="pt-2"
              >
                <Button asChild className="w-full rounded-full" size="lg">
                  <Link
                    href={me ? "/dashboard" : "/signup"}
                    onClick={() => setOpen(false)}
                  >
                    {me ? "Open studio" : "Begin preserving"}
                  </Link>
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
