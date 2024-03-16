import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";

type MessageTimestampProps = {
  createdAt: Date;
  updatedAt: Date;
};

const updateInterval = 10000;

export function MessageTimestamp({
  createdAt,
  updatedAt,
}: MessageTimestampProps) {
  const [ago, setAgo] = useState(formatAgo(createdAt));

  useEffect(() => {
    const interval = setInterval(
      () => setAgo(formatAgo(createdAt)),
      updateInterval,
    );

    return () => clearInterval(interval);
  }, [createdAt]);

  return <p className="text-sm text-muted-foreground">{ago}</p>;
}

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const formatAgo = (date: Date) =>
  timeAgo.format(date.getTime(), "twitter-minute-now");
