import { ChatProvider } from "@/providers/chat.provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Rizz - Chat",
  description: "Chat with AI, Code Rizz",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex w-full h-dvh flex-row ">
      <ChatProvider>{children}</ChatProvider>
    </main>
  );
}
