import type { Metadata } from "next";
import { AboutContent } from "@/components/organisms/about/about-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "The KYRA Group story — luxury imports, customs, and premium wash from Brookside Drive, Spring Valley, Nairobi.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
