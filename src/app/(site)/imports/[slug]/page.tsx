import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { VehicleCard } from "@/components/molecules/vehicle-card";
import { SectionHeading } from "@/components/molecules/section-heading";
import { TradeBand } from "@/components/molecules/trade-band";
import { VehicleGallery } from "@/components/organisms/imports/vehicle-gallery";
import { VehicleInquiryBar } from "@/components/organisms/imports/vehicle-inquiry-bar";
import { getVehicleBySlug, getVehicles } from "@/lib/admin/vehicles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicle Not Found" };

  return {
    title: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    description:
      vehicle.description ??
      `${vehicle.brand} ${vehicle.model} available at KYRA Platinum Imports.`,
    openGraph: {
      title: `${vehicle.brand} ${vehicle.model}`,
      description: formatPrice(vehicle.price),
      images: [{ url: vehicle.image }],
    },
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [vehicle, allVehicles] = await Promise.all([
    getVehicleBySlug(slug),
    getVehicles(),
  ]);
  if (!vehicle) notFound();

  const related = allVehicles
    .filter((v) => v.slug !== slug && v.brand === vehicle.brand)
    .slice(0, 3);

  const galleryImages =
    vehicle.images?.length > 0
      ? Array.from(new Set([vehicle.image, ...vehicle.images].filter(Boolean)))
      : [vehicle.image].filter(Boolean);

  const overviewSpecs = [
    { label: "Year", value: String(vehicle.year) },
    vehicle.trim ? { label: "Trim", value: vehicle.trim } : null,
    vehicle.condition
      ? {
          label: "Condition",
          value: vehicle.condition === "new" ? "New" : "Used",
        }
      : null,
    { label: "Transmission", value: vehicle.transmission },
    { label: "Fuel", value: vehicle.fuel },
    { label: "Mileage", value: `${vehicle.mileage.toLocaleString()} km` },
    vehicle.drivetrain
      ? { label: "Drivetrain", value: vehicle.drivetrain }
      : null,
    vehicle.bodyType
      ? {
          label: "Body",
          value: vehicle.bodyType.replace(/^\w/, (c) => c.toUpperCase()),
        }
      : null,
    vehicle.exteriorColor
      ? { label: "Exterior", value: vehicle.exteriorColor }
      : null,
    vehicle.interiorColor
      ? { label: "Interior", value: vehicle.interiorColor }
      : null,
    vehicle.seats != null
      ? { label: "Seats", value: String(vehicle.seats) }
      : null,
    vehicle.doors != null
      ? { label: "Doors", value: String(vehicle.doors) }
      : null,
    vehicle.vin ? { label: "VIN", value: vehicle.vin } : null,
    vehicle.stockNumber
      ? { label: "Stock #", value: vehicle.stockNumber }
      : null,
    vehicle.warranty ? { label: "Warranty", value: vehicle.warranty } : null,
    { label: "Status", value: vehicle.status },
  ].filter(Boolean) as { label: string; value: string }[];

  const techSpecs: Record<string, string> = {
    ...(vehicle.engine ? { Engine: vehicle.engine } : {}),
    ...(vehicle.horsepower ? { Power: vehicle.horsepower } : {}),
    ...(vehicle.torque ? { Torque: vehicle.torque } : {}),
    ...(vehicle.drivetrain ? { Drivetrain: vehicle.drivetrain } : {}),
    ...(vehicle.specifications ?? {}),
  };

  return (
    <>
      <section className="pt-24 pb-12 md:pt-[110px] md:pb-16">
        <div className="container-kyra px-6 md:px-12 lg:px-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <VehicleGallery
              images={galleryImages}
              alt={`${vehicle.brand} ${vehicle.model}`}
            />

            <div className="flex flex-col justify-center pb-24 md:pb-0">
              <Eyebrow>{vehicle.brand}</Eyebrow>
              <h1 className="font-hero mt-3 text-[clamp(2rem,4vw,3rem)] leading-[0.98] text-foreground">
                {vehicle.model}
                {vehicle.trim ? (
                  <span className="mt-1 block font-display text-lg font-semibold italic text-kyra-steel normal-case">
                    {vehicle.trim}
                  </span>
                ) : null}
              </h1>
              <p className="mt-3 font-mono text-2xl font-bold text-foreground">
                {formatPrice(vehicle.price)}
              </p>
              <span className="mt-1 font-mono text-[10px] text-kyra-steel">
                Incl. import dossier
              </span>

              <div className="mt-6 space-y-2">
                {overviewSpecs.map((spec) => (
                  <div key={spec.label} className="spec-row">
                    <span>{spec.label}</span>
                    <b className="font-normal text-foreground capitalize">
                      {spec.value}
                    </b>
                  </div>
                ))}
              </div>

              {vehicle.description && (
                <p className="mt-6 text-sm leading-relaxed text-kyra-steel">
                  {vehicle.description}
                </p>
              )}

              <VehicleInquiryBar
                brand={vehicle.brand}
                model={vehicle.model}
                year={vehicle.year}
                price={vehicle.price}
                className="mt-8"
              />
            </div>
          </div>

          {Object.keys(techSpecs).length > 0 && (
            <div className="mt-20 border-t border-border pt-16">
              <SectionHeading label="Performance" title="Technical specifications." />
              <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(techSpecs).map(([key, value]) => (
                  <div key={key} className="bg-muted p-6">
                    <p className="font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase">
                      {key}
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold text-foreground uppercase">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vehicle.features && vehicle.features.length > 0 && (
            <div className="mt-16">
              <SectionHeading label="Equipment" title="Included features." />
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {vehicle.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 border-b border-dashed border-border pb-2 text-sm text-kyra-steel"
                  >
                    <span className="text-lg leading-none text-kyra-red">›</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-20 pb-8">
              <SectionHeading label="Similar Stock" title="Related vehicles." />
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((v, i) => (
                  <VehicleCard key={v.id} vehicle={v} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <TradeBand />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Car",
            name: `${vehicle.brand} ${vehicle.model}`,
            brand: vehicle.brand,
            model: vehicle.model,
            vehicleModelDate: vehicle.year,
            vehicleIdentificationNumber: vehicle.vin,
            color: vehicle.exteriorColor,
            vehicleInteriorColor: vehicle.interiorColor,
            vehicleTransmission: vehicle.transmission,
            fuelType: vehicle.fuel,
            bodyType: vehicle.bodyType,
            vehicleSeatingCapacity: vehicle.seats,
            numberOfDoors: vehicle.doors,
            mileageFromOdometer: {
              "@type": "QuantitativeValue",
              value: vehicle.mileage,
              unitCode: "KMT",
            },
            offers: {
              "@type": "Offer",
              price: vehicle.price,
              priceCurrency: "KES",
              availability:
                vehicle.status === "available"
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />
    </>
  );
}
