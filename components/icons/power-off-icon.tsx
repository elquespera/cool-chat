import { SVGProps } from "react";

export function PowerOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 21A9 9 0 0 1 5.64 5.64a.74.74 0 0 1 1.06 0a.75.75 0 0 1 0 1.06a7.5 7.5 0 1 0 10.6 10.6a7.48 7.48 0 0 0 0-10.6a.75.75 0 0 1 0-1.06a.74.74 0 0 1 1.06 0A9 9 0 0 1 12 21"
      ></path>
      <path
        fill="currentColor"
        d="M12 12.75a.76.76 0 0 1-.75-.75V4a.75.75 0 0 1 1.5 0v8a.76.76 0 0 1-.75.75"
      ></path>
    </svg>
  );
}
