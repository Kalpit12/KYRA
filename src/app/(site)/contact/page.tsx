import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactPageContent } from "./contact-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Visit KYRA Platinum Imports on Brookside Drive, Spring Valley, Nairobi. Call +254 724 809 009 or book a private viewing, wrap consultation, or wash appointment.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact KYRA | Spring Valley, Nairobi",
    description:
      "Showroom on Brookside Drive. Imports, customs, and premium wash — by appointment.",
  },
};

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="section-padding bg-background">
          <div className="container-kyra py-24 text-center font-mono text-xs tracking-[0.12em] text-kyra-steel uppercase">
            Loading…
          </div>
        </div>
      }
    >
      <ContactPageContent />
    </Suspense>
  );
}
