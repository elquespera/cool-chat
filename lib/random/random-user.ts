import {
  uniqueNamesGenerator,
  colors,
  animals,
} from "unique-names-generator";
import { randomInt } from "./random-int";
import { randomAvatar } from "./random-avatar";
import { capitalizeStr } from "../utils";

const emailSeparator = "_";

export const randomUser = (avatar = false) => {
  const [part1, part2] = [
    uniqueNamesGenerator({ dictionaries: [colors], length: 1 }),
    uniqueNamesGenerator({ dictionaries: [animals], length: 1 }),
  ];

  const email = `${part1}${emailSeparator}${part2}${randomInt(10, 99)}@mail.com`;
  const username = `${capitalizeStr(part1)} ${capitalizeStr(part2)}`;
  const avatarUrl = avatar ? randomAvatar() : undefined;

  return { email, username, avatarUrl } as const;
};
