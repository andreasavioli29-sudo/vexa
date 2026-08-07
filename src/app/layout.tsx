import type { Metadata, Viewport } from "next";
import { Geist, Fraunces } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { HeroAssetsProvider } from "@/components/providers/hero-assets-provider";
import { PremiumLoader } from "@/components/loader/premium-loader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vexa.sleep"),
  title: {
    default: "VEXA — The Art of Sleeping",
    template: "%s — VEXA",
  },
  description:
    "Not just a mattress. A new standard of sleep. Discover VEXA — precision-engineered sleep systems, ONE & SIGNATURE.",
  keywords: ["VEXA", "mattress", "sleep", "luxury sleep", "ONE", "SIGNATURE"],
  openGraph: {
    title: "VEXA — The Art of Sleeping",
    description: "Not just a mattress. A new standard of sleep.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-black text-white selection:bg-copper-400/30 selection:text-white">
        <SmoothScrollProvider>
          <HeroAssetsProvider>
            <PremiumLoader />
            {children}
          </HeroAssetsProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
