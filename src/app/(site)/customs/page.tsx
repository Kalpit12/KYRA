import type { Metadata } from "next";
import { CustomsContent } from "./customs-content";

export const metadata: Metadata = {
  title: "Customs — Wraps & PPF",
  description:
    "KYRA Customs in Nairobi — vehicle wraps, PPF, window tint, and an interactive wrap configurator. Studio in Spring Valley, Westlands.",
  alternates: { canonical: "/customs" },
};

export default function CustomsPage() {
  return <CustomsContent />;
}
