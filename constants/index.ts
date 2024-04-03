/*** AUTH ***/
export const redirectURIKey = "redirectURI";
export const userIdLength = 15;
export const emailMatcher = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const usernameMatcher = /^\w{4,}$/;
export const passwordMatcher =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const defaultSettings = {
  sound: true,
  color: "picton-blue",
  background: "circuit-board",
  resizeAttachments: true,
} as const;

export const attachmentDir = process.env.ATTACHMENT_DIR!;
