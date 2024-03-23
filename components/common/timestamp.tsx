"use client";

import { formatTimestamp } from "@/lib/format-timestamp";
import { ComponentProps, useEffect, useState } from "react";

type TimestampProps = {
  time?: Date;
  style?: "short" | "long";
  updateInterval?: number;
} & ComponentProps<"span">;

export function Timestamp({
  time,
  style = "short",
  updateInterval = 20,
  ...props
}: TimestampProps) {
  const [formattedTime, setFormattedTime] = useState(
    formatTimestamp(time, style),
  );

  useEffect(() => {
    if (!updateInterval) return;

    const interval = setInterval(() => {
      setFormattedTime(formatTimestamp(time, style));
    }, updateInterval * 1000);

    return () => clearInterval(interval);
  }, [time, style, updateInterval]);

  return formattedTime ? <span {...props}>{formattedTime}</span> : null;
}
