import { SVGProps } from "react";
import { HeroIconWrapper } from "./hero-icon-wrapper";

export function PowerOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <HeroIconWrapper
      {...props}
      paths="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
    />
  );
}
