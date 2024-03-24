import { SVGProps } from "react";
import { HeroIconWrapper } from "./hero-icon-wrapper";

export function SendIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <HeroIconWrapper
      {...props}
      paths="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
    />
  );
}
