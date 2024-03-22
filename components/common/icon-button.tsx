"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  ComponentPropsWithoutRef,
  MouseEventHandler,
  ReactNode,
  forwardRef,
  useTransition,
} from "react";
import { UrlObject } from "url";
import { Hint } from "./hint";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Spinner } from "./spinner";

type IconButtonProps = {
  href?: string | UrlObject;
  prefetch?: boolean;
  icon?: ReactNode;
  target?: string;
  reverse?: boolean;
  pending?: boolean;
  pendingIcon?: ReactNode;
  toolTip?: ReactNode;
  toolTipSide?: "top" | "right" | "bottom" | "left";
  toolTipOffset?: number;
  navTransition?: boolean;
} & ComponentPropsWithoutRef<typeof Button>;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      href,
      prefetch,
      target,
      icon,
      reverse,
      pending,
      pendingIcon,
      className,
      children,
      size,
      toolTip,
      toolTipSide,
      toolTipOffset,
      navTransition = true,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      if (navTransition && href) {
        startTransition(() => router.push(href.toString()));
      }
      if (onClick) onClick(event);
    };

    const actualIcon =
      isPending || pending ? (
        pendingIcon ? (
          pendingIcon
        ) : (
          <Spinner className="w-4" />
        )
      ) : (
        icon
      );

    const content = (
      <>
        {actualIcon}
        {children && (
          <span
            className={cn(
              "inline-flex",
              actualIcon && (reverse ? "pr-1" : "pl-1"),
            )}
          >
            {children}
          </span>
        )}
      </>
    );

    return (
      <Hint value={toolTip} side={toolTipSide} sideOffset={toolTipOffset}>
        <Button
          ref={ref}
          size={size ?? (icon && !children ? "icon" : "default")}
          className={cn(
            "inline-flex items-center",
            reverse && "flex-row-reverse",
            className,
          )}
          asChild={!!href}
          onClick={handleClick}
          {...props}
        >
          {href ? (
            <Link
              prefetch={prefetch}
              href={href}
              target={target}
              rel={target === "_blank" ? "noopener" : undefined}
            >
              {content}
            </Link>
          ) : (
            content
          )}
        </Button>
      </Hint>
    );
  },
);
IconButton.displayName = "IconButton";
