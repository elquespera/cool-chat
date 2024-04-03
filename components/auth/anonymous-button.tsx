"use client";

import { signUpAsAnonymous } from "@/lib/auth/sign-up-as-anonymous";
import { IconButton } from "../common/icon-button";
import { AnonymousIcon } from "../icons/anonymous-icon";
import { ComponentProps } from "react";

export function AnonymousButton(props: ComponentProps<typeof IconButton>) {
  return (
    <IconButton
      type="button"
      variant="outline"
      icon={<AnonymousIcon />}
      onClick={() => signUpAsAnonymous()}
      {...props}
    >
      Anonymous
    </IconButton>
  );
}
