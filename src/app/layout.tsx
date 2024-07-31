import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "@/styles/globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${GeistSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
