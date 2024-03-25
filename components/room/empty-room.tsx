export function EmptyRoom() {
  return (
    <div className="flex grow flex-col justify-center">
      <p className="p-4 text-center text-sm font-medium text-muted-foreground">
        Type something and press &apos;Enter&apos; to send your first message.
        <br /> Use &apos;Shift+Enter&apos; for a new line.
        <br />
      </p>
    </div>
  );
}
