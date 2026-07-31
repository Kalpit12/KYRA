import type { Metadata } from "next";
import { AboutContent } from "@/components/organisms/about/about-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "The KYRA story — premium automotive lifestyle brand in Spring Valley, Nairobi. Import, customize, and maintain with Kenya's performance car experts.",
};

export default function AboutPage() {
  return <AboutContent />;
}
