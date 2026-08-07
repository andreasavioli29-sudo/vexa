import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "We're building our careers page. In the meantime, reach us at hello@vexa.com to introduce yourself.",
};

export default function CareersPage() {
  return (
    <PlaceholderPage
      kicker="Careers"
      title="This page is being"
      emphasis="crafted."
      description="We're building our careers page. In the meantime, reach us at hello@vexa.com to introduce yourself."
    />
  );
}
