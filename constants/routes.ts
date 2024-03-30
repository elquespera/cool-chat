export const publicRoutes = {
  welcome: "/welcome",
  attachments: "/attachments",

  signIn: "/signin",
  signUp: "/signup",
  github: "/auth/github",
  google: "/auth/google",
} as const;

export const privateRoutes = {
  home: "/",
  user: "/user",
  chat: "/chat",
  assistant: "/assistant",
  chatVideo: "/chat/video",
  chatAudio: "/chat/audio",

  getLivekitToken: "/api/get-livekit-token",

  apiAssistant: "/api/assistant",
} as const;

export const routes = {
  ...publicRoutes,
  ...privateRoutes,
} as const;

export const ollamaApiURL = process.env.OLLAMA_API_URL!;
