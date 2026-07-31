import type { Metadata } from "next";
import { WashContent } from "./wash-content";

export const metadata: Metadata = {
  title: "KYRA Wash",
  description:
    "KYRA Premium Carwash in Nairobi — Clean. Shine. Elevate. Exterior wash, interior detailing, wax, paint protection, and wheel care by appointment.",
};

export default function WashPage() {
  return <WashContent />;
}
