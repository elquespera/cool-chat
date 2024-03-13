import { PropsWithChildren } from "react";
import { SocketProvider } from "./socket/socket-provider";

export const CommonProviders = ({ children }: PropsWithChildren) => {
  return <SocketProvider>{children}</SocketProvider>;
};
