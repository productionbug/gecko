import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "HPui Playground",
  description: "Playground for HPui components"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en">{children}</html>;
}
