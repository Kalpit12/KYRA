import { HeroSection } from "@/components/organisms/home/hero-section";
import { AllInOneSection } from "@/components/organisms/home/all-in-one-section";
import { MakesStrip } from "@/components/molecules/makes-strip";
import { FeaturedVehiclesSection } from "@/components/organisms/home/featured-vehicles-section";
import { WhyKyraSection } from "@/components/organisms/home/why-kyra-section";
import { FeaturedWrapsSection } from "@/components/organisms/home/featured-wraps-section";
import { TestimonialsSection } from "@/components/organisms/home/testimonials-section";
import { ContactCtaSection } from "@/components/organisms/home/contact-cta-section";
import { SiteJsonLd } from "@/components/atoms/site-json-ld";
import { getFeaturedVehicles } from "@/lib/admin/vehicles";

export const revalidate = 60;

export default async function HomePage() {
  const featured = await getFeaturedVehicles();

  return (
    <>
      <SiteJsonLd />
      <HeroSection />
      <MakesStrip centered />
      <FeaturedVehiclesSection vehicles={featured} />
      <AllInOneSection />
      <WhyKyraSection />
      <FeaturedWrapsSection />
      <TestimonialsSection />
      <ContactCtaSection />
    </>
  );
}
