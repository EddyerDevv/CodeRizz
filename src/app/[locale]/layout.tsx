import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "@/styles/globals.css";
import React from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Code Rizz",
  description:
    "Make someone fall in love with the help of the AI, Code Rizz, in charge of generating a love message based on your context and image.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
  },
  other: {
    "og:image": "/banner.png",
    "og:title": "Code Rizz",
    "og:description":
      "Make someone fall in love with the help of the AI, Code Rizz, in charge of generating a love message based on your context and image.",
    "og:site_name": "Code Rizz",
    "twitter:image": "/banner.png",
    "twitter:card": "summary_large_image",
    "twitter:site": "@coderizz",
    "twitter:creator": "@coderizz",
    "twitter:title": "Code Rizz",
    "twitter:description":
      "Make someone fall in love with the help of the AI, Code Rizz, in charge of generating a love message based on your context and image.",
    "twitter:image:alt": "Code Rizz",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  return (
    <html lang="en" className={`${inter.variable} ${GeistSans.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
