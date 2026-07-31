import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { KyraBrand } from "@/components/atoms/kyra-logo";
import { INSTAGRAM } from "@/lib/data/home";
import { kyraContact } from "@/lib/data/contact";

const footerLinks = {
  divisions: [
    { label: "Platinum Imports", href: "/imports" },
    { label: "Customs", href: "/customs" },
    { label: "KYRA Wash", href: "/wash" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Book Consultation", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="section-padding pb-12">
        <div className="container-kyra">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <KyraBrand size="md" removeBackground showTagline />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Kenya&apos;s most premium automotive lifestyle brand. Import.
                Customize. Maintain.
              </p>
              <div className="mt-6 flex gap-4">
                <a
                  href={INSTAGRAM.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-kyra-steel transition-all hover:border-kyra-red hover:text-kyra-red"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-foreground/70">
                Divisions
              </h4>
              <ul className="mt-4 space-y-3">
                {footerLinks.divisions.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-foreground/70">
                Company
              </h4>
              <ul className="mt-4 space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-foreground/70">
                Contact
              </h4>
              <ul className="mt-4 space-y-4">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-kyra-red" />
                  <a
                    href={kyraContact.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    {kyraContact.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </a>
                </li>
                {kyraContact.phones.map((phone) => (
                  <li
                    key={phone.href}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <Phone size={16} className="shrink-0 text-kyra-red" />
                    <a href={phone.href} className="hover:text-foreground">
                      {phone.label}
                    </a>
                  </li>
                ))}
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail size={16} className="shrink-0 text-kyra-red" />
                  <a
                    href={kyraContact.gmailHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all hover:text-foreground"
                  >
                    {kyraContact.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} KYRA. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-kyra-red"
              >
                Admin
              </Link>
              <p className="text-xs text-muted-foreground">
                Crafted with precision by Nexora Digital
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
