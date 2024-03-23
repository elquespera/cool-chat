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
      <header className="sticky top-0 flex gap-4 bg-background/80 p-4 backdrop-blur-sm">
        <Link href={routes.home} className="mr-auto">
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <ChatDuoIcon className="shrink-0 text-primary" />
            CoolChat
          </h1>
        </Link>
        <IconButton variant="ghost" href={routes.signIn} reverse>
          Log In
        </IconButton>

        <IconButton href={routes.signUp} reverse>
          Sign Up
        </IconButton>
      </header>
      {children}
      <footer className="mt-8 p-4">
        <IconButton
          variant="link"
          target="_blank"
          href="https://pavelgrinkevich.com"
          navTransition={false}
        >
          Build by elquespera
        </IconButton>
        <span className="text-muted-foreground">{`/`}</span>
        <IconButton
          variant="link"
          target="_blank"
          href="https://github.com/elquespera/cool-chat"
          navTransition={false}
        >
          Github
        </IconButton>
      </footer>
    </>
  );
}
