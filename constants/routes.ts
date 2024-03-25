export const publicRoutes = {
  welcome: "/welcome",

  signIn: "/signin",
  signUp: "/signup",
  github: "/auth/github",
  google: "/auth/google",
} as const;

export const privateRoutes = {
  home: "/",
  user: "/user",
  chat: "/chat",
  chatVideo: "/chat/video",
  chatAudio: "/chat/audio",

  assistant: "/api/assistant",
} as const;

export const routes = {
  ...publicRoutes,
  ...privateRoutes,
} as const;

export const ollamaURL = "http://localhost:11434/api/chat";
