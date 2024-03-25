import { PropsWithChildren } from "react";
import { CenteredMessage } from "./centered-message";

type NotFoundProps = { title?: string } & PropsWithChildren;

export function NotFound({ title = "Not Found", children }: NotFoundProps) {
  return (
    <CenteredMessage>
      <h2 className="mb-4 text-2xl font-bold tracking-tighter text-foreground">
        {title}
      </h2>
      <p>{children}</p>
    </CenteredMessage>
  );
}
