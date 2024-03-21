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
  const [created, setCreated] = useState(formatAgo(createdAt));
  const [updated, setUpdated] = useState(formatAgo(updatedAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setCreated(formatAgo(createdAt));
      setUpdated(formatAgo(updatedAt));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [createdAt, updatedAt]);

  return (
    <span className={cn("select-none text-sm italic", className)} {...props}>
      {created}
      {createdAt.getTime() !== updatedAt.getTime() && `, edited ${updated}`}
    </span>
  );
}

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const formatAgo = (created: Date) =>
  timeAgo.format(created.getTime(), "twitter-minute-now");
