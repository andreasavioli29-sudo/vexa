import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "ONE",
  description:
    "VEXA ONE's full story — specifications, materials, and how to bring it home — is on its way.",
};

export default function OnePage() {
  return (
    <PlaceholderPage
      kicker="VEXA One"
      title="This page is being"
      emphasis="crafted."
      description="VEXA ONE's full story — specifications, materials, and how to bring it home — is on its way."
    />
  );
}
