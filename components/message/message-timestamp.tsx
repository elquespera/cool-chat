import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

type MessageTimestampProps = {
  createdAt: Date;
  updatedAt: Date;
};

const updateInterval = 10000;

export function MessageTimestamp({
  createdAt,
  updatedAt,
}: MessageTimestampProps) {
  const format = () =>
    timeAgo.format(createdAt.getTime(), "twitter-minute-now");
  const [ago, setAgo] = useState(format());

  useEffect(() => {
    const interval = setInterval(() => setAgo(format()), updateInterval);

    return () => clearInterval(interval);
  }, []);

  return <p className="text-sm text-muted-foreground">{ago}</p>;
}
