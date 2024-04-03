import { nanoid } from "nanoid";

const randomIdLength = 10;

export const randomId = () => nanoid(randomIdLength);
