export const randomInt = (min: number = 0, max: number = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
