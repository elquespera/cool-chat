import { randomInt } from "./random-int";

export const randomEmail = () => `test${randomInt(20, 1000)}@mail.com`;
