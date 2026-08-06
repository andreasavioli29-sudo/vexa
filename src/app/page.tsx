import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CinematicHero } from "@/components/sections/cinematic-hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <CinematicHero />
      </main>
      <Footer />
    </>
  );
}
