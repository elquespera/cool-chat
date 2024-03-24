import { SVGProps } from "react";
import { HeroIconWrapper } from "./hero-icon-wrapper";

export function EllipsisVerticalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <HeroIconWrapper
      {...props}
      paths="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
    />
  );
}
