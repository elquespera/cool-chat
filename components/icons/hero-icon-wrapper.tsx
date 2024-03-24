import { SVGProps } from "react";

type HeroIconWrapperProps = {
  paths: string | string[];
  solid?: boolean;
} & SVGProps<SVGSVGElement>;

export function HeroIconWrapper({ paths, ...props }: HeroIconWrapperProps) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      {(Array.isArray(paths) ? paths : [paths]).map((value) => (
        <path
          key={value}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d={value}
        />
      ))}
    </svg>
  );
}
