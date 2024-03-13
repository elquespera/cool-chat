import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <ResizablePanelGroup className="grow" direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={35}>
          list
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65}>Chat</ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
