import Link from "next/link";
import Image from "next/image";
import {
  Car,
  MessageSquare,
  Droplets,
  Plus,
  ArrowUpRight,
  Star,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { getDashboardFeed } from "@/lib/admin/vehicles";
import { washPackages } from "@/lib/data/wash";
import { formatPrice, cn } from "@/lib/utils";

function washPackageLabel(packageId: string) {
  const pkg = washPackages.find((p) => p.id === packageId);
  return pkg ? pkg.name : packageId;
}

export const dynamic = "force-dynamic";

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-KE", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function AdminDashboardPage() {
  const { stats, recentVehicles, recentInquiries, recentBookings } =
    await getDashboardFeed();

  const today = new Intl.DateTimeFormat("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const attention = [
    stats.contactInquiries > 0
      ? {
          label: `${stats.contactInquiries} new inquir${stats.contactInquiries === 1 ? "y" : "ies"}`,
          href: "/admin/inquiries",
          tone: "alert" as const,
        }
      : null,
    stats.washBookings > 0
      ? {
          label: `${stats.washBookings} open wash booking${stats.washBookings === 1 ? "" : "s"}`,
          href: "/admin/bookings",
          tone: "alert" as const,
        }
      : null,
    stats.reserved > 0
      ? {
          label: `${stats.reserved} reserved vehicle${stats.reserved === 1 ? "" : "s"} awaiting follow-up`,
          href: "/admin/vehicles?status=reserved",
          tone: "warn" as const,
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string;
    tone: "alert" | "warn";
  }[];

  const cards = [
    {
      label: "Total vehicles",
      value: stats.total,
      href: "/admin/vehicles",
      icon: Car,
      note: `${stats.featured} featured`,
    },
    {
      label: "Available",
      value: stats.available,
      href: "/admin/vehicles?status=available",
      icon: CheckCircle2,
      note: "Ready to sell",
    },
    {
      label: "Reserved",
      value: stats.reserved,
      href: "/admin/vehicles?status=reserved",
      icon: Clock,
      note: "Pending handover",
    },
    {
      label: "Sold",
      value: stats.sold,
      href: "/admin/vehicles?status=sold",
      icon: Star,
      note: "Closed deals",
    },
    {
      label: "Wash bookings",
      value: stats.washBookings,
      href: "/admin/bookings",
      icon: Droplets,
      note: "Open / confirmed",
    },
    {
      label: "Inquiries",
      value: stats.contactInquiries,
      href: "/admin/inquiries",
      icon: MessageSquare,
      note: "Awaiting reply",
    },
  ];

  const quickActions = [
    {
      href: "/admin/vehicles/new",
      label: "Add vehicle",
      desc: "Create a new inventory listing",
      icon: Plus,
      primary: true,
    },
    {
      href: "/admin/vehicles",
      label: "Manage stock",
      desc: "Edit, feature, or remove units",
      icon: Car,
    },
    {
      href: "/admin/inquiries",
      label: "Review inquiries",
      desc: "Respond to contact messages",
      icon: MessageSquare,
    },
    {
      href: "/admin/bookings",
      label: "Wash schedule",
      desc: "Confirm or complete bookings",
      icon: Droplets,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
            Overview · {today}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold italic uppercase text-foreground">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back Admin. Here&apos;s what needs attention across KYRA.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-2 text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase transition hover:border-kyra-red hover:text-foreground"
        >
          View live site
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {attention.length > 0 ? (
        <div className="border border-kyra-red/25 bg-kyra-red/5 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-kyra-red" />
            <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
              Needs attention
            </p>
          </div>
          <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {attention.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-sm text-foreground transition hover:text-kyra-red"
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      item.tone === "alert" ? "bg-kyra-red" : "bg-amber-500"
                    )}
                  />
                  {item.label}
                  <ArrowUpRight size={14} className="opacity-50" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="border border-border bg-background p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 size={16} className="text-emerald-600" />
            All clear — no open inquiries or bookings waiting.
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group border border-border bg-background p-5 transition hover:border-kyra-red"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase">
                {card.label}
              </p>
              <card.icon
                size={16}
                className="text-kyra-steel transition group-hover:text-kyra-red"
              />
            </div>
            <p className="mt-3 font-hero text-3xl font-extrabold tracking-[-0.03em] text-foreground">
              {card.value}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{card.note}</p>
          </Link>
        ))}
      </div>

      <div>
        <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-steel uppercase">
          Quick actions
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "border p-4 transition",
                action.primary
                  ? "border-kyra-red bg-kyra-red text-white hover:bg-kyra-red-hover"
                  : "border-border bg-background hover:border-kyra-red"
              )}
            >
              <action.icon
                size={18}
                className={action.primary ? "text-white" : "text-kyra-red"}
              />
              <p
                className={cn(
                  "mt-3 text-sm font-semibold",
                  action.primary ? "text-white" : "text-foreground"
                )}
              >
                {action.label}
              </p>
              <p
                className={cn(
                  "mt-1 text-xs",
                  action.primary ? "text-white/80" : "text-muted-foreground"
                )}
              >
                {action.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
                Inventory
              </p>
              <h2 className="mt-0.5 font-display text-lg font-semibold italic uppercase">
                Recent vehicles
              </h2>
            </div>
            <Link
              href="/admin/vehicles"
              className="font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase hover:text-kyra-red"
            >
              View all
            </Link>
          </div>
          {recentVehicles.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">
              No vehicles yet.{" "}
              <Link href="/admin/vehicles/new" className="text-kyra-red hover:underline">
                Add the first one
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recentVehicles.map((vehicle) => (
                <li key={vehicle.id}>
                  <Link
                    href={`/admin/vehicles/${vehicle.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-muted/60"
                  >
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-muted">
                      <Image
                        src={vehicle.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {vehicle.brand} {vehicle.model}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] tracking-[0.08em] text-kyra-steel uppercase">
                        {vehicle.year} · {vehicle.status}
                        {vehicle.featured ? " · Featured" : ""}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-medium text-foreground">
                      {formatPrice(vehicle.price)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
                Inbox
              </p>
              <h2 className="mt-0.5 font-display text-lg font-semibold italic uppercase">
                Latest inquiries
              </h2>
            </div>
            <Link
              href="/admin/inquiries"
              className="font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase hover:text-kyra-red"
            >
              View all
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">
              No contact inquiries yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recentInquiries.map((item) => (
                <li key={item.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {item.email}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-kyra-steel">
                        {item.message}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] uppercase",
                        item.status === "new"
                          ? "bg-kyra-red/10 text-kyra-red"
                          : "bg-muted text-kyra-steel"
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-kyra-steel">
                    {formatWhen(item.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
              KYRA Wash
            </p>
            <h2 className="mt-0.5 font-display text-lg font-semibold italic uppercase">
              Recent bookings
            </h2>
          </div>
          <Link
            href="/admin/bookings"
            className="font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase hover:text-kyra-red"
          >
            View all
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            No wash bookings yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-muted font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase">
                <tr>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Package</th>
                  <th className="px-5 py-3">When</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">{booking.name}</p>
                      <p className="text-xs text-muted-foreground">{booking.phone}</p>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {washPackageLabel(booking.package_id)}
                      <span className="mt-0.5 block text-xs">{booking.vehicle}</span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {booking.booking_date}
                      <span className="mt-0.5 block text-xs">{booking.booking_time}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-[10px] tracking-[0.1em] text-kyra-steel uppercase">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
