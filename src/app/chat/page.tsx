"use client";
import { useState } from "react";
import { useChat } from "ai/react";
import ChatInput from "@/components/chat/ChatInput";
import Header from "@/components/chat/Header";
import ChatMessage from "@/components/chat/ChatMessage";
import Image from "next/image";

export const maxDuration = 30;

export default function Page() {
  const [streamingData, setStreamingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const { messages, append, handleSubmit, stop, setMessages } = useChat({
    onFinish: (message) => {
      setStreamingData(false);
    },
    onResponse(response) {
      setLoading(false);
    },
  });

  const handleSubmitInput = async (value: string) => {
    setLoading(true);
    setStreamingData(true);

    append({ content: value, role: "user" });
    handleSubmit();
  };

  const handleStopStreaming = () => {
    setStreamingData(false);
    setLoading(false);
    stop();
  };

  return (
    <slot className="w-vw h-dvh flex flex-col overflow-hidden justify-center items-center">
      <Header />
      <main className="flex-1 w-full max-w-[45rem] gap-4 flex flex-col px-4">
        {!messages.length && (
          <div className="flex flex-col items-center justify-center gap-2 mt-[10rem]">
            <header className="flex items-center justify-center gap-2">
              <Image
                src={"/logo.png"}
                alt="Code Rizz Logo"
                width={100}
                height={100}
                className="pointer-events-none size-[3.1rem] -rotate-[15deg]"
              />
              <span className="text-[2rem] font-bold">Code Rizz</span>
            </header>
            <p className="text-[1.25rem] font-normal text-neutral-200 max-md:text-[1.15rem] max-w-[35rem] text-center leading-[1.4rem]">
              Welcome, send a screenshot or a message like this: '“Reven: I
              don't love you anymore”, what do I tell him, help.'
            </p>
            <p className="text-[1rem] font-normal text-neutral-400 text-center">
              You currently have no messages in your history.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            message={m.content as string}
            role={m.role === "user" ? "user" : "assistant"}
          />
        ))}
        {loading && (
          <ChatMessage message="Loading..." role="assistant" withLoadingAI />
        )}
      </main>
      <ChatInput
        streamingData={streamingData}
        onSubmit={handleSubmitInput}
        onStop={handleStopStreaming}
      />
    </slot>
  );
}
