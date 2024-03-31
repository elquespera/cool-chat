/*** AUTH ***/
export const redirectURIKey = "redirectURI";
export const authMessageKey = "message";
export const userIdLength = 15;
export const emailMatcher = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const passwordMatcher =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const defaultSettings = {
  sound: true,
  color: "blue",
  background: "circuit-board",
  resizeAttachments: true,
} as const;

export const attachmentDir = process.env.ATTACHMENT_DIR!;
