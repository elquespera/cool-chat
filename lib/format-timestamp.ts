export function formatTimestamp(
  timestamp?: Date,
  style: "short" | "long" = "short",
) {
  if (!timestamp) return "";
  const rft = new Intl.RelativeTimeFormat("en", {
    style: style === "long" ? "long" : "narrow",
  });
  const now = new Date();
  const timeDiff = (now.getTime() - timestamp.getTime()) / 1000;

  if (timeDiff < 60) return "now";
  if (timeDiff < 3600) return rft.format(-Math.round(timeDiff / 60), "minute");
  if (timeDiff < 3600 * 12)
    return rft.format(-Math.round(timeDiff / 3600), "hours");

  if (now.toDateString() === timestamp.toDateString()) {
    return new Intl.DateTimeFormat("en", { timeStyle: "short" }).format(
      timestamp,
    );
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    hour: style === "long" ? "numeric" : undefined,
    minute: style === "long" ? "numeric" : undefined,
  }).format(timestamp);
}
