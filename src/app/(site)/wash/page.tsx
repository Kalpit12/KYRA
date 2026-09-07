import type { Metadata } from "next";
import { WashContent } from "./wash-content";

export const metadata: Metadata = {
  title: "Premium Car Wash",
  description:
    "KYRA Premium Carwash in Nairobi — exterior wash, interior detailing, wax, paint protection, and wheel care by appointment in Spring Valley.",
  alternates: { canonical: "/wash" },
};

export default function WashPage() {
  return <WashContent />;
}
