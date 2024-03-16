import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

type MessageTimestampProps = {
  createdAt: Date;
  updatedAt: Date;
};

export function MessageTimestamp({
  createdAt,
  updatedAt,
}: MessageTimestampProps) {
  return (
    <p className="text-sm text-muted-foreground">
      {timeAgo.format(createdAt.getTime())}
    </p>
  );
}
