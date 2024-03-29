export type MessageType = "only" | "first" | "middle" | "last";

const round = "16px";
const notRound = "2px";

const firstAndMiddle = [
  `${notRound} ${round} ${round} ${notRound}`,
  `${round} ${notRound} ${notRound} ${round}`,
];

const lastAndOnly = [
  `${notRound} ${round} ${round} ${round}`,
  `${round} ${notRound} ${round} ${round}`,
];

export const messageBorderRadii: Record<MessageType, string[]> = {
  first: firstAndMiddle,
  middle: firstAndMiddle,
  last: lastAndOnly,
  only: lastAndOnly,
};
