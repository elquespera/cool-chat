import { CommonProviders } from "@/components/providers/common-providers";
import { defaultSettings } from "@/constants";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CoolChat",
  description: "CoolChat - your ultimate chat messenger.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        defaultSettings.color,
        GeistSans.variable,
        GeistMono.variable,
      )}
    >
      <body className="flex min-h-[100dvh] flex-col">
        <CommonProviders>{children}</CommonProviders>
      </body>
    </html>
  );
}
