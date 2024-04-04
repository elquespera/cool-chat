import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const wait = async (time = 1000) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const capitalizeStr = (str?: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : undefined;
