import { SVGProps } from "react";

export function MagicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        d="M11 4l-.5-1l-.5 1l-1 .125l.834.708L9.5 6l1-.666l1 .666l-.334-1.167l.834-.708zm8.334 10.666L18.5 13l-.834 1.666l-1.666.209l1.389 1.181L16.834 18l1.666-1.111L20.166 18l-.555-1.944L21 14.875zM6.667 6.333L6 5l-.667 1.333L4 6.5l1.111.944L4.667 9L6 8.111L7.333 9l-.444-1.556L8 6.5zM3.414 17c0 .534.208 1.036.586 1.414L5.586 20c.378.378.88.586 1.414.586s1.036-.208 1.414-.586L20 8.414c.378-.378.586-.88.586-1.414S20.378 5.964 20 5.586L18.414 4c-.756-.756-2.072-.756-2.828 0L4 15.586c-.378.378-.586.88-.586 1.414zM17 5.414L18.586 7L15 10.586L13.414 9L17 5.414z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
