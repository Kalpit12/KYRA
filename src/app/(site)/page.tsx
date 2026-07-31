import { HeroSection } from "@/components/organisms/home/hero-section";
import { AllInOneSection } from "@/components/organisms/home/all-in-one-section";
import { MakesStrip } from "@/components/molecules/makes-strip";
import { FeaturedVehiclesSection } from "@/components/organisms/home/featured-vehicles-section";
import { DivisionsSection } from "@/components/organisms/home/divisions-section";
import { WhyKyraSection } from "@/components/organisms/home/why-kyra-section";
import { FeaturedWrapsSection } from "@/components/organisms/home/featured-wraps-section";
import { LatestVehiclesSection } from "@/components/organisms/home/latest-vehicles-section";
import { TestimonialsSection } from "@/components/organisms/home/testimonials-section";
import { InstagramSection } from "@/components/organisms/home/instagram-section";
import { TradeBand } from "@/components/molecules/trade-band";
import { ContactCtaSection } from "@/components/organisms/home/contact-cta-section";
import { getFeaturedVehicles, getVehicles } from "@/lib/admin/vehicles";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    getFeaturedVehicles(),
    getVehicles(),
  ]);

  return (
    <>
      <HeroSection />
      <MakesStrip centered />
      <FeaturedVehiclesSection vehicles={featured} />
      <AllInOneSection />
      <DivisionsSection />
      <WhyKyraSection />
      <FeaturedWrapsSection />
      <LatestVehiclesSection vehicles={latest} />
      <TestimonialsSection />
      <InstagramSection />
      <TradeBand />
      <ContactCtaSection />
    </>
  );
}
