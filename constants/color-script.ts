import { colorKey, defaultColor } from ".";

export const colorScript = `
  const color = localStorage.getItem("${colorKey}") || "${defaultColor}";
  document.documentElement.classList.add(color);
`;
