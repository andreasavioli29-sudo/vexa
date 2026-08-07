import { Button } from "@/components/ui/button";

type PlaceholderPageProps = {
  /** The route's proper name — displayed uppercase via CSS, so pass natural case. */
  kicker: string;
  /** The plain lead-in clause of the headline. */
  title: string;
  /** The closing word/phrase, set in italic Fraunces — the sole display-font accent. */
  emphasis: string;
  description: string;
};

/**
 * Sprint 1 (Navigation Integrity) interim page — every nav/footer link
 * resolves to a real, on-brand page instead of a 404 while the real
 * destination (product page, editorial content, legal copy) is built in a
 * later sprint. Deliberately identical rhythm across every route: a
 * templated empty-state reads as intentional, nine improvised taglines
 * would not.
 */
export function PlaceholderPage({ kicker, title, emphasis, description }: PlaceholderPageProps) {
  return (
    <main className="flex flex-1 min-h-[calc(100svh-5rem)] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex items-center gap-3 text-copper-300/90">
        <span className="h-px w-8 bg-copper-400/50" />
        <span className="text-[10.5px] font-medium uppercase tracking-[0.42em] sm:text-xs">
          {kicker}
        </span>
        <span className="h-px w-8 bg-copper-400/50" />
      </div>

      <h1 className="mt-8 max-w-2xl text-[clamp(1.75rem,4.5vw,3rem)] font-light leading-[1.15] tracking-[-0.01em] text-white">
        {title}{" "}
        <span className="font-display italic font-normal text-copper-200">{emphasis}</span>
      </h1>

      <p className="mt-6 max-w-md text-sm leading-relaxed text-anthracite-300">{description}</p>

      <div className="mt-10">
        <Button href="/" variant="outline">
          Back to Home
        </Button>
      </div>
    </main>
  );
}
