import { CinematicHero } from "@/components/sections/cinematic-hero";
import { PremiumLoader } from "@/components/loader/premium-loader";

export default function Home() {
  return (
    <>
      <PremiumLoader />
      <main className="flex-1">
        <CinematicHero />
      </main>
    </>
  );
}
