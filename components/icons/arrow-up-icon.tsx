import { SVGProps } from "react";
import { HeroIconWrapper } from "./hero-icon-wrapper";

export function ArrowUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <HeroIconWrapper {...props} paths="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
  );
}
