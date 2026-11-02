import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full max-w-[1320px]",
        "px-5 sm:px-8 lg:px-10",
        className
      )}
      {...props}
    />
  )
);
Container.displayName = "Container";

export { Container };
