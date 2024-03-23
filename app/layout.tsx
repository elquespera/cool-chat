import { CommonProviders } from "@/components/providers/common-providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { colorScript } from "@/constants/color-script";

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn("flex min-h-[100dvh] flex-col", inter.className)}>
        <Script id="color-script" strategy="beforeInteractive">
          {colorScript}
        </Script>
        <CommonProviders>{children}</CommonProviders>
      </body>
    </html>
  );
}
