import { kyraContact } from "@/lib/data/contact";
import { INSTAGRAM } from "@/lib/data/home";
import { CUSTOMS_INSTAGRAM } from "@/lib/data/wraps";
import { absoluteUrl, SITE_URL } from "@/lib/site-url";
import type { Vehicle } from "@/types";

/** JSON-LD for crawlers and AI tools that prefer structured page data. */
export function SiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "KYRA",
    legalName: "KYRA Group",
    url: SITE_URL,
    image: absoluteUrl("/instagram/DZ7UoDaNWHm.jpg"),
    logo: absoluteUrl("/kyra-wordmark.png"),
    description:
      "Kenya's premium automotive lifestyle brand — luxury imports, vehicle wraps, PPF, and car care in Nairobi.",
    telephone: kyraContact.phone,
    email: kyraContact.email,
    areaServed: {
      "@type": "City",
      name: "Nairobi",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Brookside Drive, Spring Valley",
      addressLocality: "Westlands",
      addressRegion: "Nairobi",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -1.2515445,
      longitude: 36.7865187,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:00",
        closes: "15:30",
      },
    ],
    sameAs: [INSTAGRAM.url, CUSTOMS_INSTAGRAM.url, kyraContact.whatsappHref],
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

export function VehicleJsonLd({ vehicle }: { vehicle: Vehicle }) {
  const name = `${vehicle.year} ${vehicle.brand} ${vehicle.model}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name,
    brand: { "@type": "Brand", name: vehicle.brand },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "KMT",
    },
    image: absoluteUrl(vehicle.image),
    url: absoluteUrl(`/imports/${vehicle.slug}`),
    description:
      vehicle.description ??
      `${name} available at KYRA Platinum Imports, Nairobi.`,
    fuelType: vehicle.fuel,
    vehicleTransmission: vehicle.transmission,
    itemCondition:
      vehicle.condition === "new"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/imports/${vehicle.slug}`),
      priceCurrency: "KES",
      price: vehicle.price,
      availability:
        vehicle.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      seller: {
        "@type": "AutoDealer",
        name: "KYRA Platinum Imports",
        url: SITE_URL,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
