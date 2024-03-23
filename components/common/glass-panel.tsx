import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type GlassPanelProps = {
  position?: "top" | "bottom";
} & ComponentProps<"div">;

export function GlassPanel({
  position = "top",
  children,
  className,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "absolute w-full from-background via-background/70 to-background/50 p-4 backdrop-blur-sm",
        position === "top" ? "bg-gradient-to-b" : "bottom-0 bg-gradient-to-t",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
