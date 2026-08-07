import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Craftsmanship",
  description:
    "The story behind how VEXA is made — materials, process, provenance — is on its way.",
};

export default function CraftsmanshipPage() {
  return (
    <PlaceholderPage
      kicker="Craftsmanship"
      title="This page is being"
      emphasis="crafted."
      description="The story behind how VEXA is made — materials, process, provenance — is on its way."
    />
  );
}
