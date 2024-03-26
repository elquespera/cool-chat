import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import dynamic from "next/dynamic";
import { ComponentProps } from "react";

const BackgroundInternal = dynamic(() =>
  import("./background-internal").then((module) => ({
    default: module.BackgroundInternal,
  })),
);

type BackgroundProps = {
  asChild?: boolean;
} & ComponentProps<"div"> &
  ComponentProps<typeof BackgroundInternal>;

export function Background({
  type,
  preview,
  children,
  className,
  asChild,
  ...props
}: BackgroundProps) {
  const Component = asChild ? Slot : "div";
  return (
    <Component {...props} className={cn("relative overflow-hidden", className)}>
      <>
        <BackgroundInternal type={type} preview={preview} />
        {children}
      </>
    </Component>
  );
}
