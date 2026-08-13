import { SITE_URL } from "@/lib/site-url";

/** JSON-LD for crawlers and AI tools that prefer structured page data. */
export function SiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "KYRA",
    url: SITE_URL,
    description:
      "Kenya's premium automotive lifestyle brand — imports, vehicle wraps, and car care in Nairobi.",
    areaServed: "Nairobi, Kenya",
    sameAs: [],
    department: [
      {
        "@type": "AutoDealer",
        name: "KYRA Platinum Imports",
        url: `${SITE_URL}/imports`,
      },
      {
        "@type": "AutoRepair",
        name: "KYRA Customs",
        url: `${SITE_URL}/customs`,
      },
      {
        "@type": "AutoWash",
        name: "KYRA Premium Wash",
        url: `${SITE_URL}/wash`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
