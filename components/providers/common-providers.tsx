import { TooltipProvider } from "@/components/ui/tooltip";
import { PropsWithChildren } from "react";

export function CommonProviders({ children }: PropsWithChildren) {
  return <TooltipProvider delayDuration={0}>{children}</TooltipProvider>;
}
