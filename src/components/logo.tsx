import { cn } from "@/lib/utils";

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <circle
        cx="16"
        cy="16"
        r="12.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.35"
      />
      <circle cx="16" cy="4" r="2.25" className="fill-copper-400" />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  showMark?: boolean;
};

export function Logo({
  className,
  markClassName,
  wordmarkClassName,
  showMark = true,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {showMark && <LogoMark className={cn("h-4 w-4", markClassName)} />}
      <span
        className={cn(
          "font-sans font-medium uppercase tracking-[0.28em]",
          wordmarkClassName,
        )}
      >
        Vexa
      </span>
    </span>
  );
}

export { LogoMark };
