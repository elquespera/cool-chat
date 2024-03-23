import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type InputWrapperProps = ComponentProps<"div">;

export function InputWrapper({
  children,
  className,
  ...props
}: InputWrapperProps) {
  return (
    <div
      className={cn(
        "group relative isolate flex items-center gap-2 overflow-hidden rounded-3xl bg-accent px-2 py-1 text-accent-foreground transition-colors",
        "before:absolute before:inset-0 before:-z-10 before:bg-background before:transition-colors",
        "after:absolute after:inset-0 after:-z-10 after:bg-accent after:transition-colors focus-within:after:bg-primary/10 dark:focus-within:after:bg-primary/30",
        "[&_input]:w-0 [&_input]:min-w-0 [&_input]:bg-transparent [&_input]:outline-none [&_input]:outline-transparent",
        "focus-within:[&_input]:placeholder:text-primary/70 dark:focus-within:[&_input]:placeholder:text-foreground/50",
        "focus-within:[&_textarea]:placeholder:text-primary/70 dark:focus-within:[&_textarea]:placeholder:text-foreground/50",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
