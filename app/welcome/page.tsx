import { IconButton } from "@/components/common/icon-button";
import { ChatDuoIcon } from "@/components/icons/chat-icon";
import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import peopleChat from "@/assets/images/people-chat.svg";
import Image from "next/image";

export default async function WelcomePage() {
  const { user } = await getAuth();
  if (user) redirect(routes.home);

  return (
    <>
      <header className="sticky top-0 flex gap-4 bg-background/80 p-4 backdrop-blur-sm">
        <h1 className="mr-auto flex items-center gap-2 text-xl font-bold tracking-tight">
          <ChatDuoIcon className="shrink-0 text-primary" />
          CoolChat
        </h1>
        <IconButton variant="ghost" href={routes.signIn} reverse>
          Log In
        </IconButton>

        <IconButton href={routes.signUp} reverse>
          Sign Up
        </IconButton>
      </header>
      <main className="mx-auto flex max-w-[800px] flex-col items-center px-4 py-8">
        <h1 className="mb-12 text-center text-4xl font-bold leading-tight tracking-tighter">
          <span className="text-primary">Connect</span> with your{" "}
          <span className="text-muted-foreground">friends</span> with CoolChat
          anytime, anywhere for <span className="text-primary">free</span>
        </h1>
        <p className="mb-8 text-center">
          Elevate your conversations with CoolChat. Chat with your friends or
          talk to a digital assistant never leaving the window.
        </p>
        <IconButton
          href={routes.signUp}
          icon={<ArrowRightIcon className="ml-1" />}
          reverse
        >
          Sign Up
        </IconButton>
        <Image
          src={peopleChat}
          alt="People chatting"
          className="mt-16 w-auto max-w-sm"
          width={7842}
          height={6961}
        />
      </main>
      <footer className="mt-8 p-4">
        <IconButton
          variant="link"
          target="_blank"
          href="https://pavelgrinkevich.com"
          navTransition={false}
        >
          Build by elquespera
        </IconButton>
        {`/`}
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
