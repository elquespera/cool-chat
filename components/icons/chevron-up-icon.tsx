import { SVGProps } from "react";
import { HeroIconWrapper } from "./hero-icon-wrapper";

export function ChevronUpIcon(props: SVGProps<SVGSVGElement>) {
  return <HeroIconWrapper {...props} paths="m4.5 15.75 7.5-7.5 7.5 7.5" />;
}
