import * as auth from "./schemas/auth";
import * as settings from "./schemas/settings";
import * as chats from "./schemas/chats";
import * as messages from "./schemas/messages";

export const schema = {
  ...auth,
  ...settings,
  ...chats,
  ...messages,
};
