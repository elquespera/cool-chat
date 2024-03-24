import { SVGProps } from "react";
import { HeroIconWrapper } from "./hero-icon-wrapper";

export function MagnifyingGlassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <HeroIconWrapper
      {...props}
      paths="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  );
}
