import { CommonProviders } from "@/components/providers/common-providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" suppressHydrationWarning className="blue">
      <body className={cn("flex min-h-[100dvh] flex-col", inter.className)}>
        <CommonProviders>{children}</CommonProviders>
      </body>
    </html>
  );
}
