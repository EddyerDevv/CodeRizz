import ChatInput from "@/components/chat/ChatInput";
import Header from "@/components/chat/Header";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <slot className="size-full flex flex-col overflow-hidden">
      <Header />
      {children}
      <ChatInput />
    </slot>
  );
}
