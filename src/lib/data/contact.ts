export const kyraContact = {
  phone: "+254 724 809 009",
  phoneHref: "tel:+254724809009",
  phoneSecondary: "+254 758 999 888",
  phoneSecondaryHref: "tel:+254758999888",
  phones: [
    { label: "+254 724 809 009", href: "tel:+254724809009" },
    { label: "+254 758 999 888", href: "tel:+254758999888" },
  ],
  whatsappHref: "https://wa.me/254724809009",
  email: "kyracustoms.info@gmail.com",
  emailHref: "mailto:kyracustoms.info@gmail.com",
  gmailHref:
    "https://mail.google.com/mail/?view=cm&fs=1&to=kyracustoms.info@gmail.com",
  hours: "Mon – Sat: 9AM – 7:30PM\nSun: 9AM – 3:30PM",
  address:
    "Kyra Platinum Imports, Brookside Drive, Spring Valley, Westlands, Nairobi, Kenya",
  addressLines: [
    "Kyra Platinum Imports",
    "Brookside Drive, Spring Valley",
    "Westlands, Nairobi, Kenya",
  ],
  mapsHref:
    "https://www.google.com/maps/place/KYRA+PLATINUM+IMPORTS/@-1.2515445,36.7865187,17z",
} as const;

export const kyraShowroomLocation = {
  label: "Kyra Platinum Imports",
  address: kyraContact.address,
  mapQuery: "KYRA+PLATINUM+IMPORTS",
  embedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1016.8141208881525!2d36.78651868465981!3d-1.2515444993351612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17d4ab1a10d7%3A0xcba7eac3ccda679e!2sKYRA%20PLATINUM%20IMPORTS!5e1!3m2!1sen!2ske!4v1785179506892!5m2!1sen!2ske",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=KYRA+PLATINUM+IMPORTS,+Brookside+Drive,+Spring+Valley,+Westlands,+Nairobi,+Kenya",
} as const;

/** @deprecated Prefer kyraShowroomLocation — kept for any remaining Customs map refs */
export const kyraCustomsLocation = kyraShowroomLocation;
