import { ChatPanel } from "@/components/chat/chat-panel";
import { ContactPanel } from "@/components/contact/contact-panel";
import { ChatProviders } from "@/components/providers/chat-providers";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { UserPanel } from "@/components/user/user-panel";
import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  return (
    <ChatProviders>
      <main className="flex grow flex-col">
        <ResizablePanelGroup className="grow" direction="horizontal">
          <ResizablePanel
            className="relative flex grow flex-col"
            defaultSize={35}
            minSize={10}
          >
            <ContactPanel />
            <UserPanel />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={65} className="flex flex-col">
            <ChatPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </ChatProviders>
  );
}
