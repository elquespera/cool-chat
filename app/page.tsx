import { SocketIndicator } from "@/components/common/socket-indicator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { routes } from "@/constants/routes";
import { getAuth } from "@/lib/auth/get-auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { user } = await getAuth();
  if (!user) redirect(routes.welcome);

  return (
    <main className="flex grow flex-col">
      <ResizablePanelGroup className="grow" direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={35}>
          list
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65}>
          <SocketIndicator /> Chat
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
