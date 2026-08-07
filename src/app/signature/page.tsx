import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Signature",
  description:
    "VEXA SIGNATURE's full story — specifications, materials, and how to bring it home — is on its way.",
};

export default function SignaturePage() {
  return (
    <PlaceholderPage
      kicker="VEXA Signature"
      title="This page is being"
      emphasis="crafted."
      description="VEXA SIGNATURE's full story — specifications, materials, and how to bring it home — is on its way."
    />
  );
}
