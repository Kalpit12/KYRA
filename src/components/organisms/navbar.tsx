"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";
import { KyraBrand, KyraCustomsBrand, KyraWashBrand } from "@/components/atoms/kyra-logo";

import { useMounted } from "@/lib/hooks/use-mounted";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";

const LOADER_SEEN_KEY = "kyra-loader-seen";

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
  const isCustoms = pathname === "/customs" || pathname.startsWith("/customs/");
  const isWash = pathname === "/wash" || pathname.startsWith("/wash/");

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 40);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useScrollLock(isMobileOpen);

  const navEnterDelay =
    typeof window !== "undefined" &&
    (() => {
      try {
        return sessionStorage.getItem(LOADER_SEEN_KEY) === "1";
      } catch {
        return false;
      }
    })()
      ? 0.12
      : 0.85;

  return (
    <>
      <motion.header
        initial={mounted ? { y: -100 } : false}
        animate={{ y: 0 }}
        transition={{
          duration: 0.7,
          delay: mounted ? navEnterDelay : 0,
          ease: [0.76, 0, 0.24, 1],
        }}
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
          isScrolled
            ? "border-b border-border bg-background py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="container-kyra flex items-center gap-6 px-6 md:gap-8 md:px-12 lg:gap-12 lg:px-20">
          <div className="relative z-10 shrink-0 pr-2">
            {isCustoms ? (
              <KyraCustomsBrand size="sm" priority showTagline />
            ) : isWash ? (
              <KyraWashBrand size="sm" priority showTagline />
            ) : (
              <KyraBrand
                size="sm"
                priority
                removeBackground
                showTagline
                inverted={lightOverHero}
              />
            )}
          </div>

          <div className="ml-auto hidden items-center gap-8 lg:flex xl:gap-10">
            <nav className="flex shrink-0 items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative whitespace-nowrap pb-1 text-[13px] font-semibold tracking-[0.05em] uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-kyra-red after:transition-all hover:after:w-full",
                    lightOverHero
                      ? "text-white/70 hover:text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Button href="/contact" variant="primary" size="sm">
              Book a Viewing
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="relative z-10 ml-auto flex h-11 w-11 min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5 lg:hidden"
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
