import { PropsWithChildren } from "react";
import { SocketProvider } from "./socket/socket-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const CommonProviders = ({ children }: PropsWithChildren) => {
  return (
    <SocketProvider>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SocketProvider>
  );
};
