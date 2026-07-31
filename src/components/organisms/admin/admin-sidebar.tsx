"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  Droplets,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { KyraBrand } from "@/components/atoms/kyra-logo";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/bookings", label: "Wash bookings", icon: Droplets },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const links = (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {nav.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-kyra-red text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={logout}
        className="mt-auto flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <LogOut size={18} />
        Log out
      </button>
    </nav>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
        <KyraBrand size="sm" href="/admin" showTagline={false} />
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center border border-border"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-background lg:hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <KyraBrand size="sm" href="/admin" showTagline={false} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center border border-border"
            >
              <X size={18} />
            </button>
          </div>
          {links}
        </div>
      )}

      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
        <div className="border-b border-border px-4 py-5">
          <KyraBrand size="sm" href="/admin" showTagline={false} />
          <p className="mt-2 font-mono text-[10px] tracking-[0.14em] text-kyra-steel uppercase">
            Admin
          </p>
        </div>
        {links}
      </aside>
    </>
  );
}
