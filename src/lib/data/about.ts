import { kyraContact, kyraShowroomLocation } from "@/lib/data/contact";

export const aboutIntro = {
  label: "Spring Valley, Nairobi",
  title: "Kyra Platinum Imports",
  body: [
    "Kyra Platinum Imports, located in Nairobi's Spring Valley, is your premier destination for exceptional motor vehicles.",
    "As trusted performance car import experts, we are dedicated to delivering vehicles that meet the highest standards of quality.",
    "Experience a superior selection of meticulously sourced and high-quality cars, curated to elevate your driving experience.",
  ],
  pullQuote: "Meticulously sourced. Performance-grade. Curated for you.",
  image:
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
  imageAlt: "KYRA Platinum Imports showroom — Spring Valley, Nairobi",
};

export const aboutAnimatedStats = [
  { value: 500, suffix: "+", label: "Vehicles Delivered" },
  { value: 1200, suffix: "+", label: "Wraps Completed" },
] as const;

export const aboutFoundedStat = {
  display: "2018",
  label: "Founded in Nairobi",
} as const;

export const aboutMissionVision = [
  {
    label: "Purpose",
    title: "Mission",
    body: "To elevate Kenya's automotive landscape by delivering world-class import, customization, and maintenance services that exceed international standards.",
  },
  {
    label: "Future",
    title: "Vision",
    body: "To become East Africa's definitive automotive lifestyle brand — where luxury, craftsmanship, and innovation converge.",
  },
] as const;

export const aboutTimeline = [
  {
    year: "2018",
    event: "KYRA founded in Nairobi with a vision to redefine automotive luxury in Kenya.",
    tag: "Brand",
  },
  {
    year: "2019",
    event: "Launched KYRA Platinum Imports — curated vehicle import division.",
    tag: "Imports",
  },
  {
    year: "2021",
    event: "Opened KYRA Customs studio with state-of-the-art wrap facilities.",
    tag: "Customs",
  },
  {
    year: "2023",
    event: "Introduced KYRA Wash — premium detailing and maintenance services.",
    tag: "Wash",
  },
  {
    year: "2025",
    event: "500+ vehicles delivered. 1,200+ wraps completed. Kenya's automotive benchmark.",
    tag: "Milestone",
  },
] as const;

export const aboutLocation = {
  label: "Find us",
  title: "Spring Valley showroom.",
  subtitle:
    "Visit KYRA in Spring Valley, Nairobi — by appointment for viewings, consultations, and handovers.",
  address: kyraContact.address,
  phone: kyraContact.phone,
  phoneHref: kyraContact.phoneHref,
  email: kyraContact.email,
  emailHref: kyraContact.emailHref,
  hours: kyraContact.hours,
  embedUrl: kyraShowroomLocation.embedUrl,
  directionsUrl: kyraShowroomLocation.directionsUrl,
  mapsHref: kyraContact.mapsHref,
} as const;

export const aboutCta = {
  eyebrow: "By Appointment",
  title: "Visit Spring Valley.",
  highlight: "Experience KYRA.",
  subtitle:
    "Book a private viewing at our Spring Valley showroom — whether you're importing, wrapping, or detailing your next drive.",
  primaryLabel: "Book a Viewing",
  primaryHref: "/contact",
  secondaryLabel: "Get Directions",
  secondaryHref: kyraShowroomLocation.directionsUrl,
} as const;

/** Compact closer band — brand standards (not trade-in) */
export const aboutStandard = {
  eyebrow: "The KYRA Standard",
  title: "How we work.",
  subtitle:
    "Every import, wrap, and wash is held to the same bar — deliberate process, honest advice, and finish you can feel.",
  pillars: [
    {
      id: "01",
      title: "Curated intake",
      body: "Vehicles and materials are selected with dossier-level scrutiny — not marketplace volume.",
    },
    {
      id: "02",
      title: "Studio craft",
      body: "Wraps, tint, and detailing executed in-house under controlled studio conditions.",
    },
    {
      id: "03",
      title: "Aftercare",
      body: "Handover support and maintenance pathways so the car stays as sharp as day one.",
    },
  ],
  ctaLabel: "Talk to the team",
  ctaHref: "/contact",
} as const;
