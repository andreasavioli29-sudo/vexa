import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Warranty",
  description:
    "Details of VEXA's warranty coverage are on their way. For any questions in the meantime, reach us at hello@vexa.com.",
};

export default function WarrantyPage() {
  return (
    <PlaceholderPage
      kicker="Warranty"
      title="This page is being"
      emphasis="crafted."
      description="Details of VEXA's warranty coverage are on their way. For any questions in the meantime, reach us at hello@vexa.com."
    />
  );
}
