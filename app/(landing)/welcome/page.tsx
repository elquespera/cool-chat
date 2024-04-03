import peopleChat from "@/assets/images/people-chat.svg";
import { IconButton } from "@/components/common/icon-button";
import { ArrowUpIcon } from "@/components/icons/arrow-up-icon";
import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
  const { user } = await getAuth();
  if (user) redirect(routes.home);

  return (
    <main className="mx-auto flex max-w-[800px] grow flex-col items-center px-4 py-8">
      <h1 className="mb-12 text-center text-4xl font-bold leading-tight tracking-tighter">
        <span className="text-primary">Connect</span> with your{" "}
        <span className="text-muted-foreground">friends</span> with{" "}
        <span className="text-primary">CoolChat</span> anytime, anywhere for{" "}
        <span className="text-muted-foreground">free</span>.
      </h1>
      <p className="mb-8 text-center text-xl font-medium text-muted-foreground">
        Elevate your conversations with CoolChat. Chat with your{" "}
        <span className="text-foreground">friends</span> or talk to a{" "}
        <span className="text-foreground">digital assistant</span> never leaving
        the app.
      </p>
      <IconButton
        href={routes.signUp}
        icon={<ArrowUpIcon className="ml-1 rotate-90" />}
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
  );
}
