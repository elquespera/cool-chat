import { Background } from "@/components/background/background";
import { IconButton } from "@/components/common/icon-button";
import { ChatDuoIcon } from "@/components/icons/chat-icon";
import { routes } from "@/constants/routes";
import Link from "next/link";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Background
        type="circuit-board"
        className="fixed inset-0 -z-10 grow overflow-auto"
      />
      <header className="sticky top-0 flex items-center gap-4 bg-background/80 p-6 shadow-sm backdrop-blur-sm">
        <Link href={routes.welcome} className="mr-auto">
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
            <ChatDuoIcon className="h-[1.5em] w-[1.5em] shrink-0 text-primary" />
            CoolChat
          </h1>
        </Link>
        <IconButton variant="ghost" href={routes.signIn}>
          Log In
        </IconButton>

        <IconButton href={routes.signUp}>Sign Up</IconButton>
      </header>
      {children}
      <footer className="mt-8 p-4">
        <IconButton
          variant="link"
          href="https://pavelgrinkevich.com"
          navTransition={false}
        >
          Build by elquespera
        </IconButton>
        <span className="text-muted-foreground">{`/`}</span>
        <IconButton
          variant="link"
          href="https://github.com/elquespera/cool-chat"
          navTransition={false}
        >
          Github
        </IconButton>
      </footer>
    </>
  );
}
