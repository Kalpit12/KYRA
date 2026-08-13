import type { Metadata } from "next";
import {
  Syne,
  Barlow_Condensed,
  Plus_Jakarta_Sans,
  IBM_Plex_Mono,
} from "next/font/google";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KYRA | Premium Automotive Experiences",
    template: "%s | KYRA",
  },
  description:
    "Kenya's most premium automotive lifestyle brand. Import. Customize. Maintain. KYRA Platinum Imports, KYRA Customs, and KYRA Wash.",
  keywords: [
    "luxury cars Kenya",
    "car imports Kenya",
    "vehicle wrapping Nairobi",
    "premium car wash Kenya",
    "KYRA",
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "KYRA | Premium Automotive Experiences",
    description: "Import. Customize. Maintain.",
    type: "website",
    locale: "en_KE",
    siteName: "KYRA",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "KYRA | Premium Automotive Experiences",
    description: "Import. Customize. Maintain.",
  },
  robots: { index: true, follow: true },
};

export { viewport } from "./viewport";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${barlowCondensed.variable} ${syne.variable} ${ibmPlexMono.variable} bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
