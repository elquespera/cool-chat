import { cn } from "@/lib/utils";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { ComponentProps, useEffect, useState } from "react";

type MessageTimestampProps = {
  createdAt: Date;
  updatedAt: Date;
} & ComponentProps<"span">;

const updateInterval = 10000;

export function MessageTimestamp({
  createdAt,
  updatedAt,
  className,
  ...props
}: MessageTimestampProps) {
  const [ago, setAgo] = useState(formatAgo(createdAt));

  useEffect(() => {
    const interval = setInterval(
      () => setAgo(formatAgo(createdAt)),
      updateInterval,
    );

    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <span className={cn("text-sm italic", className)} {...props}>
      {ago}
    </span>
  );
}

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const formatAgo = (date: Date) =>
  timeAgo.format(date.getTime(), "twitter-minute-now");
