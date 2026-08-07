import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Our Terms of Service are being finalized and reviewed. For any questions in the meantime, reach us at hello@vexa.com.",
};

export default function TermsPage() {
  return (
    <PlaceholderPage
      kicker="Terms of Service"
      title="This page is being"
      emphasis="finalized."
      description="Our Terms of Service are being finalized and reviewed. For any questions in the meantime, reach us at hello@vexa.com."
    />
  );
}
