"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";
import { KyraBrand } from "@/components/atoms/kyra-logo";

import { useMounted } from "@/lib/hooks/use-mounted";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Platinum Imports", href: "/imports" },
  { label: "Customs", href: "/customs" },
  { label: "Wash", href: "/wash" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const mounted = useMounted();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const lightOverHero = pathname === "/" && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;

    const html = document.documentElement;
    html.classList.add("lenis-stopped");
    document.body.style.overflow = "hidden";

    return () => {
      html.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      <motion.header
        initial={mounted ? { y: -100 } : false}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: mounted ? 1.2 : 0, ease: [0.76, 0, 0.24, 1] }}
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
          isScrolled
            ? "border-b border-border bg-background py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="container-kyra flex items-center justify-between px-6 md:px-12 lg:px-20">
          <div
            className={cn(
              "relative z-10 shrink-0",
              lightOverHero &&
                "[&>a>span>span:last-child>span:first-child]:text-white [&>a>span>span:last-child_small]:text-white/55"
            )}
          >
            <KyraBrand size="sm" priority removeBackground showTagline />
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative pb-1 text-[13px] font-semibold tracking-[0.05em] uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-kyra-red after:transition-all hover:after:w-full",
                  lightOverHero
                    ? "text-white/70 hover:text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href="/contact" variant="primary" size="sm">
              Book a Viewing
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="relative z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <X size={22} className="text-foreground" />
            ) : (
              <>
                <span
                  className={cn(
                    "block h-0.5 w-6",
                    lightOverHero ? "bg-white" : "bg-foreground"
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-6",
                    lightOverHero ? "bg-white" : "bg-foreground"
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-6",
                    lightOverHero ? "bg-white" : "bg-foreground"
                  )}
                />
              </>
            )}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-background/98 backdrop-blur-xl lg:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex min-h-full flex-col items-center justify-center gap-8 px-6 py-24"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="font-display text-3xl font-semibold text-foreground/80 uppercase transition-colors hover:text-kyra-red"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                onClick={() => setIsMobileOpen(false)}
              >
                Book a Viewing
              </Button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
