import type { Metadata } from "next";
import { CustomsContent } from "./customs-content";

export const metadata: Metadata = {
  title: "KYRA Customs",
  description:
    "Interactive wrap configurator and premium vehicle customization studio in Nairobi.",
};

export default function CustomsPage() {
  return <CustomsContent />;
}
