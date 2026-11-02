import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "container",
        className
      )}
      {...props}
    />
  )
);
Container.displayName = "Container";

export { Container };
