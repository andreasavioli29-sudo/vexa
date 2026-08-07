import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Our Privacy Policy is being finalized and reviewed. For any questions in the meantime, reach us at hello@vexa.com.",
};

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      kicker="Privacy Policy"
      title="This page is being"
      emphasis="finalized."
      description="Our Privacy Policy is being finalized and reviewed. For any questions in the meantime, reach us at hello@vexa.com."
    />
  );
}
