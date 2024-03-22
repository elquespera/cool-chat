import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const wait = async (time = 1000) =>
  new Promise((resolve) => setTimeout(resolve, time));

export function randomInt(min: number = 0, max: number = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
