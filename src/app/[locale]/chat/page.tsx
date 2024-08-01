"use client";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import Header from "@/components/chat/Header";
import { RefreshCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Message, useChat } from "ai/react";
import Image from "next/image";

export default function Page() {
  const [streamingData, setStreamingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { messages, append, handleSubmit, stop, reload, error, setMessages } =
    useChat({
      onFinish: () => {
        setStreamingData(false);
      },
      onResponse() {
        setLoading(false);
      },
    });

  const handleReloadResponse = async () => {
    setLoading(true);
    setStreamingData(true);
    await reload();
  };

  const handleSubmitInput = async ({
    promptValue,
    imageFile,
  }: {
    promptValue: string;
    imageFile?: File;
  }) => {
    setLoading(true);
    setStreamingData(true);

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        if (base64String) {
          append({
            id: generateId(),
            role: "user",
            content: promptValue,
            experimental_attachments: [
              {
                name: "image.png",
                contentType: "image/png",
                url: base64String,
              },
            ],
          });

          handleSubmit();
        }
      };

      reader.readAsDataURL(imageFile);
    } else {
      await append({ content: promptValue, role: "user" });

      handleSubmit();
    }
  };

  const handleStopStreaming = () => {
    setLoading(true);
    setStreamingData(false);
    stop();
  };

  const isUltimateMessage = (id: string) => {
    const assistantMessages = messages.filter((m) => m.role === "assistant");
    const index = assistantMessages.findIndex((m) => m.id === id);
    return index === assistantMessages.length - 1;
  };

  const setMessagesLocal = (messages: Message[]) => {
    localStorage.setItem("messages", JSON.stringify(messages));
  };

  const getMessages = () => {
    const messages = localStorage.getItem("messages");
    if (messages) return JSON.parse(messages);
    return [];
  };

  const clearMessages = () => {
    localStorage.removeItem("messages");
    setMessages([]);
  };

  const handleReloadMessages = () => {
    setLoadingData(true);
    setMessages([]);
    clearMessages();
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessagesLocal(messages);
    }
  }, [messages]);

  useEffect(() => {
    const messages = getMessages();
    if (messages.length > 0) {
      setLoadingData(true);
      setMessages(messages);
      setLoadingData(false);
    } else {
      setLoadingData(false);
    }
  }, [handleReloadMessages]);

  return (
    <slot className="w-vw h-dvh flex flex-col overflow-hidden justify-center items-center">
      <Header onReloadChat={handleReloadMessages} />
      <main
        className="flex-1 w-full gap-4 flex flex-col px-4 max-h-max items-center overflow-auto "
        style={{
          scrollbarWidth: "thin",
        }}
      >
        <section className="w-full flex items-center justify-start flex-col gap-4 h-full max-w-[45rem]">
          {messages.length > 0 ? null : (
            <div className="flex flex-col items-center justify-center gap-1 mt-[10rem]">
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
              {loadingData && (
                <p className="text-[1rem] font-medium text-neutral-200 text-center">
                  Loading messages...
                </p>
              )}
            </div>
          )}
          {messages.map((m, i) => {
            const isUltimate = isUltimateMessage(m.id);

            const hasImage =
              m.experimental_attachments &&
              m.experimental_attachments.length > 0;
            const filteredOnlyImage = m.experimental_attachments?.filter((f) =>
              f.contentType?.startsWith("image")
            );
            const file = hasImage ? filteredOnlyImage?.[0] : undefined;
            const url = file ? file.url : undefined;

            return (
              <ChatMessage
                key={i}
                withImage={hasImage}
                imageUrl={url}
                onClickReload={isUltimate ? handleReloadResponse : undefined}
                isUltimateMessage={isUltimate}
                message={m.content as string}
                role={m.role === "user" ? "user" : "assistant"}
              />
            );
          })}
          {loading && (
            <ChatMessage message="Loading..." role="assistant" withLoadingAI />
          )}
        </section>
      </main>
      {error ? (
        <footer className="w-full min-h-[4rem] flex flex-col items-center justify-end py-2 gap-1 px-4">
          <div className="w-full items-center justify-center flex relative flex-col gap-2">
            <header className="flex flex-col justify-center items-center animate-fade-in-up animate-delay-200">
              <h1 className="text-[1.1rem] font-medium leading-[1.05rem]">
                Something went wrong, please try again.
              </h1>
              <p className="text-[0.9rem] font-normal text-neutral-400 text-center leading-[1.05rem]">
                If the problem persists, please contact us.
              </p>
            </header>
            <div className="flex flex-row mb-2">
              <button
                className="flex items-center justify-center gap-2 rounded-full px-5 py-1 text-black bg-white ease-out max-md:px-4 max-md:py-1 animate-fade-in-up animate-delay-500"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <RefreshCcwIcon
                  className="size-[1.5rem] text-black"
                  absoluteStrokeWidth
                  strokeWidth={2}
                />
                <span className="text-black font-medium text-[1rem] leading-[0] mr-2">
                  Reload
                </span>
              </button>
            </div>
          </div>
        </footer>
      ) : (
        <ChatInput
          streamingData={streamingData}
          onSubmit={handleSubmitInput}
          onStop={handleStopStreaming}
        />
      )}
    </slot>
  );
}

const generateId = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "");
