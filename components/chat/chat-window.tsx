import { ScrollArea } from "../ui/scroll-area";

export function ChatWindow() {
  return (
    <div className="relative grow bg-muted">
      <ScrollArea className="inset-0" style={{ position: "absolute" }}>
        <ul className="p-4 pt-24"></ul>
      </ScrollArea>
    </div>
  );
}
