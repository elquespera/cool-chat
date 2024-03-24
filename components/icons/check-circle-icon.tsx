import { SVGProps } from "react";
import { HeroIconWrapper } from "./hero-icon-wrapper";

export function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <HeroIconWrapper
      {...props}
      paths="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  );
}
