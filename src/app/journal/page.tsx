import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Journal",
  description: "Field notes on sleep, craft, and design from VEXA — our journal is on its way.",
};

export default function JournalPage() {
  return (
    <PlaceholderPage
      kicker="Journal"
      title="This page is being"
      emphasis="crafted."
      description="Field notes on sleep, craft, and design from VEXA — our journal is on its way."
    />
  );
}
