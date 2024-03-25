import { nanoid } from "nanoid";

const randomIdLength = 10;

export function randomId() {
  return nanoid(randomIdLength);
}
