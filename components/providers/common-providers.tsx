import { TooltipProvider } from "@/components/ui/tooltip";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme/theme-provider";

export function CommonProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
