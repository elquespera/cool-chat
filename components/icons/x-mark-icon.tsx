import { SVGProps } from "react";
import { HeroIconWrapper } from "./hero-icon-wrapper";

export function XMarkIcon(props: SVGProps<SVGSVGElement>) {
  return <HeroIconWrapper {...props} paths="M6 18 18 6M6 6l12 12" />;
}
