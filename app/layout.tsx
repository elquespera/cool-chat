import { CommonProviders } from "@/components/providers/common-providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cool Chat",
  description: "Cool Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CommonProviders>{children}</CommonProviders>
      </body>
    </html>
  );
}
