import { ContactUser } from "@/db/schemas/auth";
import Link from "next/link";
import { MouseEventHandler, ReactNode, useEffect, useRef } from "react";

import { routes } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { UserInfo } from "../user/user-info";
import { useSoundEffect } from "@/lib/hooks/use-sound-effect";

type ContactItemProps = {
  contact: ContactUser;
  href: string;
  selected?: boolean;
  status?: UserStatus | null;
  secondLine?: ReactNode;
  endDecoration?: ReactNode;
};

export function ContactItem({
  contact,
  href,
  selected,
  status,
  secondLine,
  endDecoration,
}: ContactItemProps) {
  const router = useRouter();
  const ref = useRef<HTMLAnchorElement>(null);
  const playClick = useSoundEffect("click");

  const handleClick: MouseEventHandler = (event) => {
    playClick();
    if (!selected) return;
    event.preventDefault();
    router.push(routes.home);
  };

  useEffect(() => {
    if (selected && ref.current) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selected]);

  return (
    <Link
      ref={ref}
      href={selected ? "#" : href}
      role="option"
      aria-selected={selected}
      className="group block w-full px-3 py-1 sm:px-5"
      onClickCapture={handleClick}
    >
      <div className="relative flex items-center justify-between gap-8 rounded-lg bg-message px-4 py-3 transition-colors group-hover:bg-accent group-hover:text-accent-foreground group-aria-selected:bg-message-own group-aria-selected:text-message-own-foreground">
        <UserInfo
          user={contact}
          size="lg"
          oneLine
          status={status ?? undefined}
          secondLine={secondLine}
        />
        {endDecoration}
      </div>
    </Link>
  );
}
