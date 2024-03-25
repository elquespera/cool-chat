type MediaRoomProps = {
  type: "video" | "audio";
};

export function MediaRoom({ type }: MediaRoomProps) {
  return <div className="flex grow flex-col justify-center">{type}</div>;
}
