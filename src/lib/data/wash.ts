export type WashPackageId = "essential" | "premium" | "platinum";

export const washTagline = {
  lines: ["Clean.", "Shine.", "Elevate."],
  subtitle: "Premium care for every drive.",
  motto: "Premium service. Premium results.",
  cta: "Book your detail today — experience the KYRA difference.",
};

export interface WashService {
  id: string;
  title: string;
  description: string;
}

export const washServices: WashService[] = [
  {
    id: "exterior-wash",
    title: "Exterior Wash",
    description: "Thorough hand wash for a spotless finish.",
  },
  {
    id: "interior-detailing",
    title: "Interior Detailing",
    description: "Deep cleaning for a fresh and comfortable ride.",
  },
  {
    id: "wax-protection",
    title: "Wax & Protection",
    description: "Premium wax for long-lasting shine and protection.",
  },
  {
    id: "paint-protection",
    title: "Paint Protection",
    description: "Advanced coatings to protect and enhance your paint.",
  },
  {
    id: "wheel-tire-care",
    title: "Wheel & Tire Care",
    description: "Deep clean and shine for a complete look.",
  },
];

export interface WashPackage {
  id: WashPackageId;
  name: string;
  price: number;
  duration: string;
  tagline: string;
  bestFor: string;
  features: string[];
  popular?: boolean;
  tier: "essential" | "premium" | "platinum";
}

export const washPackages: WashPackage[] = [
  {
    id: "essential",
    tier: "essential",
    name: "Essential",
    price: 3500,
    duration: "45 min",
    tagline: "Spotless exterior refresh",
    bestFor: "Daily drivers",
    features: [
      "Exterior Hand Wash",
      "Wheel & Tire Care",
      "Window & Mirror Clean",
      "Tire Dressing",
    ],
  },
  {
    id: "premium",
    tier: "premium",
    name: "Premium",
    price: 7500,
    duration: "90 min",
    tagline: "Interior & exterior detail",
    bestFor: "Weekly upkeep",
    popular: true,
    features: [
      "Exterior Hand Wash",
      "Interior Detailing",
      "Wax & Protection",
      "Wheel & Tire Care",
      "Dashboard & Leather Treatment",
    ],
  },
  {
    id: "platinum",
    tier: "platinum",
    name: "Platinum",
    price: 15000,
    duration: "3 hours",
    tagline: "Showroom-grade restoration",
    bestFor: "Luxury & exotic vehicles",
    features: [
      "Exterior Hand Wash",
      "Full Interior Detailing",
      "Premium Wax & Protection",
      "Advanced Paint Protection",
      "Wheel & Tire Care",
      "Clay Bar & Paint Decontamination",
      "Ozone Treatment",
    ],
  },
];

export const washProcessSteps = [
  {
    step: "01",
    title: "Book",
    description: "Select your package and preferred appointment slot.",
  },
  {
    step: "02",
    title: "Arrive",
    description: "Pull in at your scheduled time — no waiting room rush.",
  },
  {
    step: "03",
    title: "Detail",
    description: "Our technicians work to KYRA standards, start to finish.",
  },
  {
    step: "04",
    title: "Handover",
    description: "Walk-around inspection before you drive away flawless.",
  },
];

export const washFaqs = [
  {
    q: "What services does KYRA Wash offer?",
    a: "Exterior hand wash, interior detailing, wax and protection, advanced paint protection, and wheel and tire care — delivered to KYRA standards on every visit.",
  },
  {
    q: "How long does a Premium detail take?",
    a: "Approximately 90 minutes. We never rush — quality is our priority.",
  },
  {
    q: "Do I need to book in advance?",
    a: "We recommend booking 24–48 hours ahead, especially for Platinum packages.",
  },
  {
    q: "What products do you use?",
    a: "Only premium, pH-neutral products safe for all paint types and interiors.",
  },
  {
    q: "Do you service luxury and exotic vehicles?",
    a: "Yes. Platinum packages are designed for high-value paintwork and interiors.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Reschedule at least 12 hours ahead. Late cancellations may incur a booking fee.",
  },
];

export function getWashPackage(id: WashPackageId) {
  return washPackages.find((pkg) => pkg.id === id)!;
}

export interface WashResult {
  id: string;
  title: string;
  vehicle: string;
  package: string;
  beforeImage: string;
  afterImage: string;
}

export const washResults: WashResult[] = [
  {
    id: "g63-platinum",
    title: "Paint decontamination",
    vehicle: "Mercedes-AMG G63",
    package: "Platinum",
    beforeImage: "/customs/gallery/g350d-03.jpg",
    afterImage: "/customs/gallery/g350d-01.jpg",
  },
  {
    id: "m4-premium",
    title: "Interior & exterior detail",
    vehicle: "BMW M4 Competition",
    package: "Premium",
    beforeImage: "/customs/gallery/c63s-02.jpg",
    afterImage: "/customs/gallery/c63s-01.jpg",
  },
  {
    id: "range-essential",
    title: "Exterior refresh",
    vehicle: "Range Rover Sport",
    package: "Essential",
    beforeImage: "/customs/gallery/mist-blue-02.jpg",
    afterImage: "/customs/gallery/mist-blue-01.jpg",
  },
];

export interface WashStudioShot {
  id: string;
  src: string;
  caption: string;
}

export const washStudioShots: WashStudioShot[] = [
  {
    id: "bay",
    src: "/video/posters/car-wash-hero.jpg",
    caption: "KYRA Wash bay",
  },
  {
    id: "interior",
    src: "/Interior%20conditioning.jpg",
    caption: "Interior conditioning",
  },
  {
    id: "wheels",
    src: "/customs/gallery/crown-rs-01.jpg",
    caption: "Wheel & paint care",
  },
];

export const washProductBrands = [
  "Gyeon",
  "Koch Chemie",
  "Swissvax",
  "Chemical Guys",
  "Meguiar's",
  "Colourlock",
];

export const washTrustStats = [
  { value: 1200, suffix: "+", label: "Details completed" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
  { value: 15, suffix: "+", label: "Luxury marques" },
];

export interface WashTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  vehicle: string;
  rating: number;
}

export const washTestimonials: WashTestimonial[] = [
  {
    id: "wash-1",
    quote:
      "My G-Wagon looks better than the day I collected it. The Platinum detail is worth every shilling.",
    name: "James M.",
    role: "Platinum client",
    vehicle: "Mercedes-AMG G63",
    rating: 5,
  },
  {
    id: "wash-2",
    quote:
      "KYRA Wash is the only place I trust with my M4's paint. Meticulous, unhurried, and spotless every time.",
    name: "Sarah K.",
    role: "Premium member",
    vehicle: "BMW M4 Competition",
    rating: 5,
  },
  {
    id: "wash-3",
    quote:
      "Booking online is seamless and the handover walk-around gives real confidence. True white-glove service.",
    name: "David O.",
    role: "Repeat client",
    vehicle: "Range Rover Sport",
    rating: 5,
  },
];
