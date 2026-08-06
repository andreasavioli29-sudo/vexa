import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs font-medium uppercase tracking-[0.16em] transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-copper-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black hover:bg-anthracite-100 active:scale-[0.98]",
        outline:
          "border border-white/25 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/5 active:scale-[0.98]",
        copper:
          "bg-copper-400 text-black hover:bg-copper-300 active:scale-[0.98]",
        ghost:
          "text-anthracite-200 hover:text-white",
        link: "text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8",
        sm: "h-10 px-6 text-[11px]",
        lg: "h-14 px-10",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
