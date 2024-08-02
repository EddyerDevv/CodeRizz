"use client";
import {RefreshCcwIcon} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {Message, useChat} from "ai/react";
import {useTranslations} from "next-intl";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import Header from "@/components/chat/Header";
import Image from "next/image";
import Modal from "@/components/feat/Modal";

export default function Page() {
    const [streamingData, setStreamingData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [currentConversationId, setCurrentConversationId] = useState<string>();
    const [modalStartOver, setModalStartOver] = useState({
        open: false,
        close: () => {
        },
    });
    const t = useTranslations("ChatPage");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {messages, append, handleSubmit, stop, reload, error, setMessages} =
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

    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        const savedConversations = JSON.parse(localStorage.getItem("conversations") || "[]");
        setConversations(savedConversations);
    }, []);


    const handleSubmitInput = async ({
                                         promptValue,
                                         imageFile,
                                     }: {
        promptValue: string;
        imageFile?: File;
    }) => {
        setLoading(true);
        setStreamingData(true);

        if (isFirstMessage(messages)) {
            await fetch("/api/title", {
                body: JSON.stringify({messages}),
                method: "POST",
            }).then(res => res.text());

            updateConversationTitle(currentConversationId!, promptValue);
        }

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
            await append({id: generateId(), role: "user", content: promptValue});
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

    const updateConversationTitle = (conversationId: string, newTitle: string) => {
        const conversations: Conversation[] = JSON.parse(localStorage.getItem("conversations") || "[]");
        const conversationIndex = conversations.findIndex(c => c.id === conversationId);

        if (conversationIndex >= 0) {
            conversations[conversationIndex].title = newTitle;
            localStorage.setItem("conversations", JSON.stringify(conversations));
        }
    };

    const getMessages = () => {
        const messages = localStorage.getItem("messages");
        if (messages) return JSON.parse(messages);
        return [];
    };

    const deleteUltimateMessageUser = () => {
        const lastUserMessageIndex = [...messages]
            .reverse()
            .findIndex((message) => message.role === "user");

        if (lastUserMessageIndex === -1) return;
        const indexToRemove = messages.length - 1 - lastUserMessageIndex;
        const updatedMessages = messages.filter(
            (_, index) => index !== indexToRemove
        );

        setMessages(updatedMessages);
        setMessagesLocal(updatedMessages);
    };

    const clearMessages = () => {
        localStorage.removeItem("messages");
        setMessages([]);
    };

    const handleReloadMessages = () => {
        setLoadingData(true);
        setMessages([]);
        clearMessages();
        setLoadingData(false);
    };

    interface Conversation {
        id: string;
        title?: string;
        messages: Message[];
    }

    const saveConversation = (conversation: Conversation) => {
        const conversations: Conversation[] = JSON.parse(localStorage.getItem("conversations") || "[]");
        const conversationIndex = conversations.findIndex(c => c.id === conversation.id);

        console.log(conversations.at(conversationIndex));
        console.log(conversation);

        if (conversationIndex >= 0) {
            conversations[conversationIndex] = conversation;
        } else {
            conversations.push(conversation);
        }

        localStorage.setItem("conversations", JSON.stringify(conversations));
    };

    useEffect(() => {
        if (currentConversationId) {
            saveConversation({
                id: currentConversationId,
                messages,
            })
        }
    }, [messages, currentConversationId]);

    useEffect(() => {
        const messages = getMessages();
        if (messages.length > 0) {
            setLoadingData(true);
            setMessages(messages);
            setLoadingData(false);

            if (messagesEndRef.current) messagesEndRef.current.scrollIntoView();
        } else {
            setLoadingData(false);
        }
    }, [messagesEndRef]);

    const handleStartOver = () => {
        setModalStartOver((prevState) => ({
            ...prevState,
            open: true,
        }));
    };

    const isFirstMessage = (messages: Message[]) => messages.length === 0;

    const handleSetConversation = (conversationId: string) => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            setMessages(conversation.messages);
            setCurrentConversationId(conversationId);
        } else {
            console.error('Conversation not found');
        }
    };

    const handleCloseStartOver = (fn: () => void) => {
        setModalStartOver((prevState) => ({
            ...prevState,
            close: fn,
        }));
    };

    useEffect(() => {
        if (error) deleteUltimateMessageUser();

        return () => {
            if (error) deleteUltimateMessageUser();
        };
    }, [error]);

    return (
        <slot
            className="w-vw h-dvh flex flex-col overflow-hidden justify-center items-center"
            id="app_chat"
        >
            <Header onReloadChat={() => handleStartOver()} previousChats={conversations}
                    handleSetConversation={handleSetConversation}/>
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
                                {t("directions")}
                            </p>
                            <p className="text-[1rem] font-normal text-neutral-400 text-center">
                                {t("noHistory")}
                            </p>
                            {loadingData && (
                                <p className="text-[1rem] font-medium text-neutral-200 text-center">
                                    {t("loading")}
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
                                scrollRef={messagesEndRef}
                                onClickReload={isUltimate ? handleReloadResponse : undefined}
                                isUltimateMessage={isUltimate}
                                message={m.content as string}
                                role={m.role === "user" ? "user" : "assistant"}
                            />
                        );
                    })}
                    {loading && (
                        <ChatMessage
                            message={t("loading")}
                            role="assistant"
                            withLoadingAI
                        />
                    )}
                    <div ref={messagesEndRef}/>
                </section>
            </main>
            {error ? (
                <footer className="w-full min-h-[4rem] flex flex-col items-center justify-end py-2 gap-1 px-4">
                    <div className="w-full items-center justify-center flex relative flex-col gap-2">
                        <header
                            className="flex flex-col justify-center items-center animate-fade-in-up animate-delay-200">
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
                    streamingData={streamingData}
                    onSubmit={handleSubmitInput}
                    onStop={handleStopStreaming}
                />
            )}
            <Modal
                state={{
                    open: modalStartOver.open,
                    setOpen: setModalStartOver,
                }}
                toPortal="app_chat"
                modalClose={handleCloseStartOver}
            >
                <div className="flex flex-col items-start justify-start gap-4 w-[19rem] h-full ">
                    <header className="flex items-start justify-start flex-col gap-[0.3rem]">
                        <h1 className="text-[1.1rem] font-semibold leading-[1.125rem]">
                            {t("modals.startOver.title")}
                        </h1>
                        <p className="text-[0.9rem] font-normal text-neutral-400 leading-[.9rem]">
                            {t("modals.startOver.description")}
                        </p>
                    </header>
                    <div className="flex flex-row items-center justify-end w-full gap-2 mt-3">
                        <button
                            className="flex items-center justify-center gap-2 rounded-lg px-3 h-[2.1rem] text-black bg-white ease-out max-md:px-4 max-md:py-1"
                            onClick={() => {
                                modalStartOver.close();
                                handleReloadMessages();
                            }}
                        >
              <span className="text-black font-semibold text-[1.1rem] leading-[0]">
                {t("modals.startOver.button")}
              </span>
                        </button>
                    </div>
                </div>
            </Modal>
        </slot>
    );
}

const generateId = () =>
    Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "");
