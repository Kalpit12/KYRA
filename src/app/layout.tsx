import type { Metadata } from "next";
import {
  Syne,
  Barlow_Condensed,
  Plus_Jakarta_Sans,
  IBM_Plex_Mono,
  Outfit,
  Saira_Extra_Condensed,
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

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const sairaExtraCondensed = Saira_Extra_Condensed({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "KYRA | Luxury Car Imports, Wraps & Premium Wash in Nairobi",
    template: "%s | KYRA",
  },
  description:
    "KYRA Group in Spring Valley, Nairobi — luxury car imports, vehicle wraps, PPF, and premium car wash. KYRA Platinum Imports, KYRA Customs, and KYRA Wash.",
  keywords: [
    "KYRA Kenya",
    "KYRA Platinum Imports",
    "luxury car imports Nairobi",
    "car wrapping Nairobi",
    "PPF Kenya",
    "premium car wash Nairobi",
    "Spring Valley Westlands",
    "kyragroup.co.ke",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KYRA | Luxury Car Imports, Wraps & Premium Wash in Nairobi",
    description:
      "Import. Customize. Maintain. Showroom on Brookside Drive, Spring Valley, Nairobi.",
    type: "website",
    locale: "en_KE",
    siteName: "KYRA",
    url: SITE_URL,
    images: [{ url: "/instagram/DZ7UoDaNWHm.jpg", width: 1200, height: 630, alt: "KYRA Platinum Imports" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KYRA | Luxury Car Imports, Wraps & Premium Wash in Nairobi",
    description:
      "Import. Customize. Maintain. Showroom on Brookside Drive, Spring Valley, Nairobi.",
    images: ["/instagram/DZ7UoDaNWHm.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#e2131f",
      },
    ],
  },
};

export { viewport } from "./viewport";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-KE" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${barlowCondensed.variable} ${syne.variable} ${ibmPlexMono.variable} ${outfit.variable} ${sairaExtraCondensed.variable} bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
