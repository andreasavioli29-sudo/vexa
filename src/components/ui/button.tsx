import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-[6px] text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-copper-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer",
  {
    variants: {
      variant: {
        default: "border border-white/60 hover:border-white",
        outline: "border border-white/20 hover:border-white/45",
        ghost: "border border-transparent text-anthracite-200 hover:text-white",
      },
      size: {
        default: "h-13 px-8",
        sm: "h-10 px-6 text-[10px]",
        lg: "h-14 px-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonOwnProps = {
  href?: string;
  icon?: boolean;
  children: React.ReactNode;
};

type ButtonProps = ButtonOwnProps &
  VariantProps<typeof buttonVariants> &
  Omit<React.ComponentProps<"button">, "children">;

function ButtonContent({ children, icon }: { children: React.ReactNode; icon?: boolean }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
      />
      <span className="relative flex items-center gap-2 text-white [mix-blend-mode:difference]">
        {children}
        {icon && (
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        )}
      </span>
    </>
  );
}

function Button({
  className,
  variant,
  size,
  href,
  icon = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }));

  if (href) {
    return (
      <Link href={href} className={classes}>
        <ButtonContent icon={icon}>{children}</ButtonContent>
      </Link>
    );
  }

  return (
    <button data-slot="button" className={classes} {...props}>
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </button>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
