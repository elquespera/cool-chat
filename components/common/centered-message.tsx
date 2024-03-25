import { PropsWithChildren } from "react";

export function CenteredMessage({ children }: PropsWithChildren) {
  return (
    <div className="flex grow flex-col justify-center p-4 text-center text-sm font-medium text-muted-foreground">
      {children}
    </div>
  );
}
