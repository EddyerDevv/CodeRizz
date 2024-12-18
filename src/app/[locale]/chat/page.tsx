"use client";
import { RefreshCcwIcon } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useChatHook } from "@/providers/chat.provider";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import Header from "@/components/chat/Header";
import Image from "next/image";
import AsideBar from "@/components/Asidebar";

export default function Page() {
  const {
    state: { isStreaming, isLoading, isLoadingMessages },
    messages,
    error,
    handleReloadResponse,
    handleSubmitInput,
    handleStopStreaming,
    handleDeleteLastMessage,
  } = useChatHook();

  const t = useTranslations("ChatPage");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLastMessage = (id: string) => {
    const assistantMessages = messages.filter((m) => m.role === "assistant");
    const index = assistantMessages.findIndex((m) => m.id === id);
    return index === assistantMessages.length - 1;
  };

  useEffect(() => {
    const handleResize = () => {
      if (messagesEndRef.current)
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
        });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [messagesEndRef]);

  useEffect(() => {
    if (error) handleDeleteLastMessage();

    return () => {
      if (error) handleDeleteLastMessage();
    };
  }, [error]);

  return (
    <Fragment>
      <AsideBar />
      <slot
        className="w-full h-dvh flex flex-col overflow-hidden justify-start items-center"
        id="app_chat"
      >
        <Header />
        <main
          className="flex-1 w-full gap-4 flex flex-col px-4 max-h-max items-center overflow-auto mb-auto"
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
                  {t("directions")}
                </p>
                <p className="text-[1rem] font-normal text-neutral-400 text-center">
                  {t("noHistory")}
                </p>
                {isLoadingMessages && (
                  <p className="text-[1rem] font-medium text-neutral-200 text-center">
                    {t("loading")}
                  </p>
                )}
              </div>
            )}
            {messages.map((m, i) => {
              const isLast = isLastMessage(m.id);

              const hasImage =
                m.experimental_attachments &&
                m.experimental_attachments.length > 0;
              const filteredOnlyImage = m.experimental_attachments?.filter(
                (f) => f.contentType?.startsWith("image")
              );
              const file = hasImage ? filteredOnlyImage?.[0] : undefined;
              const url = file ? file.url : undefined;

              return (
                <ChatMessage
                  key={i}
                  withImage={hasImage}
                  imageUrl={url}
                  scrollRef={messagesEndRef}
                  onClickReload={isLast ? handleReloadResponse : undefined}
                  isUltimateMessage={isLast}
                  message={m.content as string}
                  role={m.role === "user" ? "user" : "assistant"}
                />
              );
            })}
            {isLoading && (
              <ChatMessage
                message={t("loading")}
                role="assistant"
                withLoadingAI
              />
            )}
            <div ref={messagesEndRef} />
          </section>
        </main>
        {error ? (
          <footer className="w-full min-h-[4rem] flex flex-col items-center justify-end py-2 gap-1 px-4">
            <div className="w-full items-center justify-center flex relative flex-col gap-2">
              <header className="flex flex-col justify-center items-center animate-fade-in-up animate-delay-200">
                <h1 className="text-[1.1rem] font-medium leading-[1.05rem]">
                  {t("error.message")}
                </h1>
                <p className="text-[0.9rem] font-normal text-neutral-400 text-center leading-[1.05rem]">
                  {t("error.description")}
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
                    {t("actions.reload")}
                  </span>
                </button>
              </div>
            </div>
          </footer>
        ) : (
          <ChatInput
            streamingData={isStreaming}
            onSubmit={handleSubmitInput}
            onStop={handleStopStreaming}
          />
        )}
      </slot>
    </Fragment>
  );
}
