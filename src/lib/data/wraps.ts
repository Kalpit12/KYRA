export const customsFaqs = [
  {
    q: "What wrap finishes do you offer?",
    a: "Matte, satin, gloss, chrome, carbon fiber, and paint protection film (PPF) — all applied with premium materials in our Nairobi studio.",
  },
  {
    q: "How long does a full wrap take?",
    a: "Most full wraps take 3–5 days depending on vehicle size and finish complexity. Partial wraps and accents can be completed faster.",
  },
  {
    q: "Will wrapping damage my original paint?",
    a: "No. Professional vinyl wraps protect factory paint and are fully removable when applied and removed correctly by our specialists.",
  },
  {
    q: "Can I preview my wrap before committing?",
    a: "Yes. Use our interactive configurator on this page to visualize colors and finishes on your vehicle type, then book a studio consultation.",
  },
  {
    q: "Do you offer PPF and window tint?",
    a: "Yes. We install clear and tinted PPF plus precision window tint as standalone services or alongside a full wrap.",
  },
  {
    q: "How do I get a quote?",
    a: "Configure your look in the simulator, then contact us with your vehicle and preferred finish. We'll confirm pricing after a short inspection.",
  },
];

export const CUSTOMS_INSTAGRAM = {
  handle: "@kyracustoms.ke",
  username: "kyracustoms.ke",
  url: "https://www.instagram.com/kyracustoms.ke/",
} as const;

export const customsHighlights = [
  {
    id: "mercedes-e200-soul-red",
    tag: "Before & after",
    title: "Mercedes E200 — Soul Red",
    description: "Full wrap in Soul Red for a clean, showroom-ready look.",
    src: "/customs/mercedes-e200-soul-red.mp4",
    poster: "/customs/posters/mercedes-e200-soul-red.jpg",
  },
  {
    id: "ppf-from-kyra",
    tag: "Behind the scenes",
    title: "PPF has to be from KYRA",
    description: "Studio breakdown — why paint protection film matters.",
    src: "/customs/ppf-from-kyra.mp4",
    poster: "/customs/posters/ppf-from-kyra.jpg",
  },
  {
    id: "subaru-vab-forged-carbon",
    tag: "Customer project",
    title: "Subaru VAB — forged carbon",
    description: "Custom wrap paired with forged carbon fiber accents.",
    src: "/customs/subaru-vab-forged-carbon.mp4",
    poster: "/customs/posters/subaru-vab-forged-carbon.jpg",
  },
] as const;

export type CustomsGalleryImage = {
  id: string;
  src: string;
  alt: string;
};

export type CustomsGalleryProject = {
  id: string;
  vehicle: string;
  title: string;
  finish: string;
  images: CustomsGalleryImage[];
};

export const customsGalleryProjects: CustomsGalleryProject[] = [
  {
    id: "mist-blue",
    vehicle: "Range Rover",
    title: "Ultra Gloss Mist Blue",
    finish: "Full wrap · Forged carbon accents",
    images: [
      {
        id: "mist-blue-04",
        src: "/customs/gallery/mist-blue-04.jpg",
        alt: "Range Rover Mist Blue wrap — headlight detail",
      },
      {
        id: "mist-blue-05",
        src: "/customs/gallery/mist-blue-05.jpg",
        alt: "Range Rover Mist Blue wrap — studio three-quarter",
      },
      {
        id: "mist-blue-01",
        src: "/customs/gallery/mist-blue-01.jpg",
        alt: "Range Rover Mist Blue wrap — front detail",
      },
      {
        id: "mist-blue-02",
        src: "/customs/gallery/mist-blue-02.jpg",
        alt: "Range Rover Mist Blue wrap — side profile",
      },
      {
        id: "mist-blue-03",
        src: "/customs/gallery/mist-blue-03.jpg",
        alt: "Range Rover Mist Blue wrap — forged carbon accents",
      },
    ],
  },
  {
    id: "crown-rs",
    vehicle: "Toyota Crown RS",
    title: "Gloss PPF finish",
    finish: "Paint protection film",
    images: [
      {
        id: "crown-rs-04",
        src: "/customs/gallery/crown-rs-04.jpg",
        alt: "Toyota Crown RS — gloss PPF studio reveal",
      },
      {
        id: "crown-rs-03",
        src: "/customs/gallery/crown-rs-03.jpg",
        alt: "Toyota Crown RS — front grille detail",
      },
      {
        id: "crown-rs-01",
        src: "/customs/gallery/crown-rs-01.jpg",
        alt: "Toyota Crown RS — side reflection",
      },
      {
        id: "crown-rs-02",
        src: "/customs/gallery/crown-rs-02.jpg",
        alt: "Toyota Crown RS — wheel and body finish",
      },
    ],
  },
  {
    id: "gt86",
    vehicle: "Toyota GT 86 / BRZ",
    title: "Ghost Black Green",
    finish: "Full wrap · Forged carbon racing stripes",
    images: [
      {
        id: "gt86-02",
        src: "/customs/gallery/gt86-02.jpg",
        alt: "GT 86 Ghost Black Green — forged carbon hood stripes",
      },
      {
        id: "gt86-01",
        src: "/customs/gallery/gt86-01.jpg",
        alt: "GT 86 Ghost Black Green — studio wrap",
      },
    ],
  },
  {
    id: "g350d",
    vehicle: "Mercedes-Benz G350d",
    title: "Protecting perfection",
    finish: "PPF treatment",
    images: [
      {
        id: "g350d-04",
        src: "/customs/gallery/g350d-04.jpg",
        alt: "Mercedes G350d — rear three-quarter after PPF",
      },
      {
        id: "g350d-01",
        src: "/customs/gallery/g350d-01.jpg",
        alt: "Mercedes G350d — front studio shot",
      },
      {
        id: "g350d-02",
        src: "/customs/gallery/g350d-02.jpg",
        alt: "Mercedes G350d — side profile",
      },
      {
        id: "g350d-03",
        src: "/customs/gallery/g350d-03.jpg",
        alt: "Mercedes G350d — detail finish",
      },
    ],
  },
  {
    id: "c63s",
    vehicle: "Mercedes-AMG C63 S",
    title: "Soul Red studio build",
    finish: "Full wrap · Racing stripe",
    images: [
      {
        id: "c63s-04",
        src: "/customs/gallery/c63s-04.jpg",
        alt: "Mercedes-AMG C63 S — Soul Red wrap studio",
      },
      {
        id: "c63s-05",
        src: "/customs/gallery/c63s-05.jpg",
        alt: "Mercedes-AMG C63 S — front grille",
      },
      {
        id: "c63s-01",
        src: "/customs/gallery/c63s-01.jpg",
        alt: "Mercedes-AMG C63 S — detail shot",
      },
      {
        id: "c63s-02",
        src: "/customs/gallery/c63s-02.jpg",
        alt: "Mercedes-AMG C63 S — side view",
      },
      {
        id: "c63s-03",
        src: "/customs/gallery/c63s-03.jpg",
        alt: "Mercedes-AMG C63 S — studio lighting",
      },
    ],
  },
];

export const customsGalleryFlat = customsGalleryProjects.flatMap((project) =>
  project.images.map((image) => ({
    ...image,
    projectId: project.id,
    vehicle: project.vehicle,
    title: project.title,
    finish: project.finish,
  }))
);

export const customsInstagramPosts = [
  {
    id: "DRsAJhTDfni",
    type: "post" as const,
    href: "https://www.instagram.com/p/DRsAJhTDfni/",
    thumbnail: "/instagram/DRsAJhTDfni.jpg",
    caption: "Mercedes-AMG — red studio reveal",
    alt: "KYRA Customs — red Mercedes-AMG studio post",
  },
  {
    id: "DRkTxNbjffs",
    type: "reel" as const,
    href: "https://www.instagram.com/reel/DRkTxNbjffs/",
    thumbnail: "/instagram/DRkTxNbjffs.jpg",
    caption: "Mercedes-AMG E63 S — matte black",
    alt: "KYRA Customs — Mercedes E63 S matte black reel",
  },
  {
    id: "DPOKlOoiG7X",
    type: "post" as const,
    href: "https://www.instagram.com/p/DPOKlOoiG7X/",
    thumbnail: "/instagram/DPOKlOoiG7X.jpg",
    caption: "Range Rover — powder blue finish",
    alt: "KYRA Customs — Range Rover powder blue post",
  },
  {
    id: "DZp2oVyttwc",
    type: "reel" as const,
    href: "https://www.instagram.com/reel/DZp2oVyttwc/",
    thumbnail: "/instagram/DZp2oVyttwc.jpg",
    caption: "Colored PPF — studio install",
    alt: "KYRA Customs — colored PPF install reel",
  },
  {
    id: "DOYElN0iNkF",
    type: "reel" as const,
    href: "https://www.instagram.com/reel/DOYElN0iNkF/",
    thumbnail: "/instagram/DOYElN0iNkF.jpg",
    caption: "Matte orange wrap — gloss black accents",
    alt: "KYRA Customs — matte orange wrap reel",
  },
  {
    id: "DMdCL3yiyve",
    type: "post" as const,
    href: "https://www.instagram.com/p/DMdCL3yiyve/",
    thumbnail: "/instagram/DMdCL3yiyve.jpg",
    caption: "Motorsport wrap — on the road",
    alt: "KYRA Customs — motorsport wrap post",
  },
];
