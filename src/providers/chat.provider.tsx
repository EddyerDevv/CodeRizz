"use client";
import { ChatRequestOptions } from "ai";
import { CreateMessage, Message, useChat } from "ai/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export interface ChatContextProps {
  state: {
    isMobile: boolean;
    isSidebar: boolean;
    isStreaming: boolean;
    isLoading: boolean;
    isLoadingMessages: boolean;
  };
  setState: React.Dispatch<React.SetStateAction<ChatContextProps["state"]>>;
  handleSidebar: () => void;
  handleSubmitInput: ({
    promptValue,
    imageFile,
  }: {
    promptValue: string;
    imageFile?: File;
  }) => void;
  messages: Message[];
  conversations: Conversations[];
  error: any;

  conversationId: string | null;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  stop: () => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void;
  handleReloadResponse: () => void;
  handleStopStreaming: () => void;
  handleDeleteLastMessage: () => void;
  updateUrlWithChatId: (id: string) => void;
  createChatUrl: (id: string) => string;
  startNewChat: () => void;
  deleteConversation: (conversationId: string) => void;
}

export interface Conversations {
  id: string;
  title: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
}

const ChatContext = createContext<ChatContextProps | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    isMobile: false,
    isSidebar: true,
    isStreaming: false,
    isLoading: false,
    isLoadingMessages: false,
  });
  const [conversations, setConversations] = useState<Conversations[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { messages, append, handleSubmit, stop, reload, error, setMessages } =
    useChat({
      onFinish: async () => {
        handleIsStreaming(false);
      },
      onResponse() {
        handleIsLoading(false);
      },
    });
  const t = useTranslations("ChatPage");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleStorage = () => {
    const conversations = localStorage.getItem("conversations");
    if (conversations) return;

    localStorage.setItem("conversations", JSON.stringify([]));
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    getConversations();
    deleteParams();
  };

  const existsConversation = (conversationId: string) => {
    handleStorage();

    const conversations: Conversation[] = JSON.parse(
      localStorage.getItem("conversations") || "[]"
    );

    if (!conversations || conversations.length === 0) return false;

    const conversationIndex = conversations.findIndex(
      (c) => c.id === conversationId
    );

    startNewChat();
    return conversationIndex >= 0;
  };

  const getMessagesWithConversation = (conversationId: string) => {
    handleStorage();
    const conversations: Conversation[] = JSON.parse(
      localStorage.getItem("conversations") || "[]"
    );

    if (!conversations || conversations.length === 0) return [];

    const conversationIndex = conversations.findIndex(
      (c) => c.id === conversationId
    );

    if (conversationIndex >= 0)
      return conversations[conversationIndex].messages;

    return [];
  };

  const updateConversation = async (
    conversationId: string,
    messages: Message[]
  ) => {
    const conversations: Conversation[] = JSON.parse(
      localStorage.getItem("conversations") || "[]"
    );

    const conversationIndex = conversations.findIndex(
      (c) => c.id === conversationId
    );

    if (conversationIndex >= 0) {
      const conversation = conversations[conversationIndex];
      conversation.messages = messages;
      conversations[conversationIndex] = conversation;
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }
  };

  const setConversation = async (conversationId: string) => {
    handleIsLoadingMessages(true);

    setConversationId(conversationId);
    const messages = getMessagesWithConversation(conversationId);
    setMessages(messages);

    handleIsLoadingMessages(false);
    getConversations();
  };

  const getConversations = () => {
    const conversations: Conversations[] = JSON.parse(
      localStorage.getItem("conversations") || "[]"
    );

    const onlyIdAndTitle = conversations.map((c) => ({
      id: c.id,
      title: c.title,
      createdAt: c.createdAt,
    }));

    setConversations(onlyIdAndTitle);
  };

  const createChatUrl = (id: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("chatId", id);

    return params.toString();
  };

  const updateUrlWithChatId = (id: string) => {
    const newSearchParams = createChatUrl(id);
    router.replace(`${pathname}?${newSearchParams.toString()}`, {
      scroll: false,
    });
  };

  const deleteParams = () => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.delete("chatId");

    router.replace(`${pathname}?${newSearchParams.toString()}`, {
      scroll: false,
    });
  };

  const setNewConvesation = async (message: Message) => {
    const conversations: Conversation[] = JSON.parse(
      localStorage.getItem("conversations") || "[]"
    );

    const newId = generateId();

    if (conversations.length > 0) {
      for (let i = 0; i < conversations.length; i++) {
        if (conversations[i].id === newId) {
          setNewConvesation(message);
          return;
        }
      }
    }

    updateUrlWithChatId(newId);

    const conversation = {
      id: newId,
      title: t("newConversation"),
      messages: [message],
      createdAt: new Date(),
    };

    conversations.push(conversation);

    localStorage.setItem("conversations", JSON.stringify(conversations));

    const msg = [
      {
        ...message,
      },
    ];

    setConversationId(newId);
    getConversations();

    const newTitle = await fetch("/api/title", {
      body: JSON.stringify({ messages: msg }),
      method: "POST",
    })
      .then((res) => res.text())
      .catch((err) => err);

    if (newTitle) {
      updateConversationTitle(newId, newTitle);
    }
  };

  const handleReloadResponse = async () => {
    handleIsLoading(true);
    handleIsStreaming(true);
    await reload();

    return;
  };

  const handleStopStreaming = async () => {
    handleIsLoading(true);
    handleIsStreaming(false);
    stop();
  };

  const handleDeleteLastMessage = async () => {
    if (!conversationId) return;

    const lastMessageIndex = [...messages]
      .reverse()
      .findIndex((message) => message.role === "user");

    if (lastMessageIndex === -1) return;
    const indexToRemove = messages.length - 1 - lastMessageIndex;
    const updatedMessages = messages.filter(
      (_, index) => index !== indexToRemove
    );

    setMessages(updatedMessages);
    updateConversation(conversationId, updatedMessages);
  };

  const updateConversationTitle = async (
    conversationId: string,
    newTitle: string
  ) => {
    if (!conversationId) return;

    const conversations: Conversation[] = JSON.parse(
      localStorage.getItem("conversations") || "[]"
    );
    const conversationIndex = conversations.findIndex(
      (c) => c.id === conversationId
    );

    if (conversationIndex >= 0) {
      conversations[conversationIndex].title = newTitle;
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }

    getConversations();
  };

  const deleteConversation = (conversationId: string) => {
    const conversations: Conversation[] = JSON.parse(
      localStorage.getItem("conversations") || "[]"
    );

    const conversationIndex = conversations.findIndex(
      (c) => c.id === conversationId
    );

    if (conversationIndex >= 0) {
      conversations.splice(conversationIndex, 1);
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }

    getConversations();
  };

  /************/
  const handleIsStreaming = (payload: boolean) => {
    setState((prevState) => ({
      ...prevState,
      isStreaming: payload,
    }));
  };

  const handleIsLoading = (payload: boolean) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: payload,
    }));
  };

  const handleIsLoadingMessages = (payload: boolean) => {
    setState((prevState) => ({
      ...prevState,
      isLoadingMessages: payload,
    }));
  };

  const handleResize = () => {
    if (window.innerWidth >= 900) {
      setState((prevState) => ({
        ...prevState,
        isMobile: false,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isMobile: true,
      }));
    }
  };

  const handleSidebar = () => {
    setState((prevState) => ({
      ...prevState,
      isSidebar: !prevState.isSidebar,
    }));
  };

  /* Handle Submit Input */
  const handleSubmitInput = async ({
    promptValue,
    imageFile,
  }: {
    promptValue: string;
    imageFile?: File;
  }) => {
    handleIsLoading(true);
    handleIsStreaming(true);

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = e.target?.result as string;
        if (base64String) {
          const message: Message = {
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
          };

          await append(message);
          if (!conversationId) setNewConvesation(message);

          handleSubmit();
        }
      };

      reader.readAsDataURL(imageFile);
    } else {
      let message: Message = {
        id: generateId(),
        role: "user",
        content: promptValue,
      };

      await append(message);
      if (!conversationId) setNewConvesation(message);

      handleSubmit();
    }
  };
  /* Handle Submit Input */

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const chatId = searchParams.get("chatId");
    if (!chatId) return;

    if (existsConversation(chatId)) {
      setConversation(chatId);
      updateUrlWithChatId(chatId);
    } else {
      startNewChat();
      deleteParams();
    }

    return () => setConversationId(null);
  }, [searchParams]);

  useEffect(() => {
    if (conversationId && messages.length > 0) {
      updateConversation(conversationId, messages);
    }

    return () => {};
  }, [messages, conversationId]);

  useEffect(() => {
    getConversations();
    return () => getConversations();
  }, [conversationId]);

  return (
    <ChatContext.Provider
      value={{
        state: state,
        error: error,
        messages: messages,
        conversations: conversations,
        conversationId: conversationId,
        setState: setState,
        handleSidebar: handleSidebar,
        handleSubmitInput: handleSubmitInput,
        append: append,
        stop: stop,
        reload: reload,
        setMessages: setMessages,
        handleReloadResponse: handleReloadResponse,
        handleStopStreaming: handleStopStreaming,
        handleDeleteLastMessage: handleDeleteLastMessage,
        updateUrlWithChatId: updateUrlWithChatId,
        createChatUrl: createChatUrl,
        startNewChat: startNewChat,
        deleteConversation: deleteConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function generateId(length: number = 16) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function useChatHook() {
  const context = useContext(ChatContext);

  if (context === null) {
    throw new Error("useChatHook must be used within a ChatProvider");
  }

  return context;
}
