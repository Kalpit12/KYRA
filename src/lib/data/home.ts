import type { Vehicle, Testimonial, WrapProject } from "@/types";

export const featuredVehicles: Vehicle[] = [
  {
    id: "1",
    slug: "mercedes-amg-g63",
    brand: "Mercedes-Benz",
    model: "AMG G63",
    year: 2024,
    price: 28500000,
    transmission: "Automatic",
    fuel: "Petrol",
    mileage: 1200,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
    ],
    status: "available",
    featured: true,
    bodyType: "suv",
    description: "The definitive luxury SUV. Hand-selected and imported with full documentation.",
    features: ["AMG Performance Exhaust", "Burmester Sound", "Night Package", "Carbon Fiber Trim"],
    specifications: {
      Engine: "4.0L V8 Biturbo",
      Power: "577 HP",
      "0-100 km/h": "4.5s",
      Drivetrain: "AWD",
    },
  },
  {
    id: "2",
    slug: "bmw-m4-competition",
    brand: "BMW",
    model: "M4 Competition",
    year: 2023,
    price: 16800000,
    transmission: "Automatic",
    fuel: "Petrol",
    mileage: 3400,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
    ],
    status: "available",
    featured: true,
    bodyType: "coupe",
  },
  {
    id: "3",
    slug: "range-rover-autobiography",
    brand: "Land Rover",
    model: "Range Rover Autobiography",
    year: 2024,
    price: 32000000,
    transmission: "Automatic",
    fuel: "Hybrid",
    mileage: 800,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
    ],
    status: "reserved",
    featured: true,
    bodyType: "suv",
  },
];

export const latestVehicles: Vehicle[] = [
  ...featuredVehicles,
  {
    id: "4",
    slug: "porsche-cayenne-turbo",
    brand: "Porsche",
    model: "Cayenne Turbo",
    year: 2023,
    price: 22400000,
    transmission: "Automatic",
    fuel: "Petrol",
    mileage: 5600,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    ],
    status: "available",
    bodyType: "suv",
  },
  {
    id: "5",
    slug: "toyota-land-cruiser-300",
    brand: "Toyota",
    model: "Land Cruiser 300 ZX",
    year: 2024,
    price: 14200000,
    transmission: "Automatic",
    fuel: "Diesel",
    mileage: 2100,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80",
    ],
    status: "available",
    bodyType: "suv",
  },
  {
    id: "6",
    slug: "audi-rs7-sportback",
    brand: "Audi",
    model: "RS7 Sportback",
    year: 2023,
    price: 19500000,
    transmission: "Automatic",
    fuel: "Petrol",
    mileage: 4200,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1200&q=80",
    ],
    status: "sold",
    bodyType: "sedan",
  },
];

export const wrapProjects: WrapProject[] = [
  {
    id: "bmw-x6m-holographic",
    title: "Holographic Grey X6M",
    vehicle: "BMW X6M",
    finish: "Holographic",
    color: "Grey · Carbon Fiber",
    images: [
      "/wraps/bmw-x6m-holographic/01.jpg",
      "/wraps/bmw-x6m-holographic/02.jpg",
      "/wraps/bmw-x6m-holographic/03.jpg",
    ],
  },
  {
    id: "gt86-ghost-black-green",
    title: "Ghost Black Green GT 86",
    vehicle: "Toyota GT 86",
    finish: "Matte",
    color: "Ghost Black Green · Forged Carbon",
    images: [
      "/wraps/gt86-ghost-black-green/01.jpg",
      "/wraps/gt86-ghost-black-green/02.jpg",
      "/wraps/gt86-ghost-black-green/03.jpg",
    ],
  },
  {
    id: "porsche-911-ferrari-red",
    title: "Ferrari Red 911 Carrera",
    vehicle: "Porsche 911 Carrera",
    finish: "Gloss",
    color: "Ferrari Red",
    images: [
      "/wraps/porsche-911-ferrari-red/01.jpg",
      "/wraps/porsche-911-ferrari-red/02.jpg",
      "/wraps/porsche-911-ferrari-red/03.jpg",
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "James Mwangi",
    role: "Business Executive",
    quote:
      "KYRA transformed my G-Wagon with a flawless satin wrap. The attention to detail is unmatched in Kenya.",
    rating: 5,
  },
  {
    id: "2",
    name: "Sarah Wanjiku",
    role: "Entrepreneur",
    quote:
      "From import to delivery, KYRA Platinum made the entire process seamless. Premium service at every step.",
    rating: 5,
  },
  {
    id: "3",
    name: "David Ochieng",
    role: "Car Enthusiast",
    quote:
      "The wrap configurator helped me visualize exactly what I wanted. The final result exceeded expectations.",
    rating: 5,
  },
];

export const INSTAGRAM = {
  handle: "@kyra.platinum.imports",
  username: "kyra.platinum.imports",
  url: "https://www.instagram.com/kyra.platinum.imports/",
} as const;

export const instagramPosts = [
  {
    id: "DZ7UoDaNWHm",
    type: "reel" as const,
    href: "https://www.instagram.com/reel/DZ7UoDaNWHm/",
    thumbnail: "/instagram/DZ7UoDaNWHm.jpg",
    caption: "Lamborghini Urus — new arrival",
    alt: "KYRA Platinum Imports — Lamborghini Urus reel",
  },
  {
    id: "DU8nmhADfe3",
    type: "post" as const,
    href: "https://www.instagram.com/p/DU8nmhADfe3/",
    thumbnail: "/instagram/DU8nmhADfe3.jpg",
    caption: "2021 BMW M440i — black / red interior",
    alt: "KYRA Platinum Imports — BMW M440i post",
  },
  {
    id: "Da2tBnfoZ84",
    type: "reel" as const,
    href: "https://www.instagram.com/reel/Da2tBnfoZ84/",
    thumbnail: "/instagram/Da2tBnfoZ84.jpg",
    caption: "BMW M440i vs Mercedes-AMG CLA 45 S",
    alt: "KYRA Platinum Imports — M440i vs CLA 45 S reel",
  },
  {
    id: "DZCTN25CAGy",
    type: "post" as const,
    href: "https://www.instagram.com/p/DZCTN25CAGy/",
    thumbnail: "/instagram/DZCTN25CAGy.jpg",
    caption: "BMW M340i — yard feature",
    alt: "KYRA Platinum Imports — BMW M340i post",
  },
  {
    id: "DYJ6ObrNSVg",
    type: "reel" as const,
    href: "https://www.instagram.com/reel/DYJ6ObrNSVg/",
    thumbnail: "/instagram/DYJ6ObrNSVg.jpg",
    caption: "BMW XM — plug-in hybrid M",
    alt: "KYRA Platinum Imports — BMW XM reel",
  },
  {
    id: "Da4-qFWjgLq",
    type: "post" as const,
    href: "https://www.instagram.com/p/Da4-qFWjgLq/",
    thumbnail: "/instagram/Da4-qFWjgLq.jpg",
    caption: "Mercedes-Benz CLA 200d — stand out",
    alt: "KYRA Platinum Imports — Mercedes CLA 200d post",
  },
];

export const whyChooseKyra = [
  {
    title: "Curated Excellence",
    description:
      "Every vehicle is hand-selected, inspected, and imported to the highest international standards.",
    stat: "500+",
    statLabel: "Vehicles Delivered",
  },
  {
    title: "Master Craftsmanship",
    description:
      "Our wrap specialists use premium materials and precision techniques for flawless finishes.",
    stat: "1,200+",
    statLabel: "Wraps Completed",
  },
  {
    title: "White-Glove Service",
    description:
      "From consultation to aftercare, experience automotive service designed for discerning clients.",
    stat: "98%",
    statLabel: "Client Satisfaction",
  },
];

export const divisions = [
  {
    id: "imports",
    name: "KYRA Platinum Imports",
    tagline: "Curated luxury vehicles, imported with precision.",
    href: "/imports",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
  },
  {
    id: "customs",
    name: "KYRA Customs",
    tagline: "Transform your vehicle into a masterpiece.",
    href: "/customs",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
  },
  {
    id: "wash",
    name: "KYRA Wash",
    tagline: "Premium care for your most prized possession.",
    href: "/wash",
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1200&q=80",
  },
];

export const importsFaqs = [
  {
    q: "What is included in an import dossier?",
    a: "Full vehicle history, inspection reports, shipping and clearance documentation, and all paperwork needed for registration in Kenya — so you buy with complete transparency.",
  },
  {
    q: "Are listed prices all-in?",
    a: "Prices shown are for the vehicle as listed. Duties, clearance, and delivery are confirmed in your quote so there are no surprises at handover.",
  },
  {
    q: "How long does sourcing and delivery take?",
    a: "In-stock units can be reserved immediately. Sourced imports typically take several weeks depending on origin, shipping, and clearance timelines.",
  },
  {
    q: "Can I view a vehicle before buying?",
    a: "Yes. Book a private viewing at our Spring Valley showroom. We'll walk you through the unit, dossier, and next steps in person.",
  },
  {
    q: "Do you help with registration and transfer?",
    a: "Yes. Our white-glove process covers documentation support through registration so you collect a road-ready vehicle.",
  },
  {
    q: "Can you source a specific make or model?",
    a: "Absolutely. If it isn't in current stock, tell us your brief — brand, model, year, budget — and we'll source and import it to KYRA standards.",
  },
];
