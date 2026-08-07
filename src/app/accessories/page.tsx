import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Accessories",
  description: "VEXA's accessories collection is on its way.",
};

export default function AccessoriesPage() {
  return (
    <PlaceholderPage
      kicker="Accessories"
      title="This page is being"
      emphasis="crafted."
      description="VEXA's accessories collection is on its way."
    />
  );
}
