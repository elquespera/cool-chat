import peopleChat from "@/assets/images/people-chat.svg";
import { IconButton } from "@/components/common/icon-button";
import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
  const { user } = await getAuth();
  if (user) redirect(routes.home);

  return (
    <>
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
          priority
          src={peopleChat}
          alt="People chatting"
          className="mt-16 w-auto max-w-sm"
          width={7842}
          height={6961}
        />
      </main>
    </>
  );
}
