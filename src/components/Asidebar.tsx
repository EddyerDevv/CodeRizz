"use client";

import { useChatHook, Conversations } from "@/providers/chat.provider";
import { MessageSquarePlus, PanelLeftIcon, TrashIcon } from "lucide-react";
import React, { Fragment, useCallback, useEffect, useRef } from "react";
import { Tooltip } from "react-tooltip";
import { tooltipProps } from "./chat/ChatMessage";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {
  format,
  isToday,
  isYesterday,
  isWithinInterval,
  subDays,
} from "date-fns";

interface GroupedConversations {
  today: Conversations[];
  yesterday: Conversations[];
  last7Days: Conversations[];
  last30Days: Conversations[];
  months: {
    [key: string]: Conversations[];
  };
}

export default function AsideBar() {
  const {
    state: { isMobile, isSidebar },
    conversations,
    conversationId,
    setState,
    handleSidebar,
    startNewChat,
    deleteConversation,
  } = useChatHook();
  const asideRef = useRef<HTMLElement>(null);
  const locale = useLocale();
  const t = useTranslations("ChatPage");

  const setIsOpen = useCallback(
    (isOpen: boolean) => {
      setState((prevState) => ({
        ...prevState,
        isSidebar: isOpen,
      }));
    },
    [setState]
  );

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else if (!isMobile) {
      setIsOpen(true);
    }

    return () => setIsOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const aside = asideRef.current;
    if (!(aside instanceof HTMLElement)) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!aside.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (!isMobile) {
      document.removeEventListener("mousedown", handleClickOutside);
    } else if (isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  const groupConversationsByDate = (): GroupedConversations => {
    const grouped: GroupedConversations = {
      today: [],
      yesterday: [],
      last7Days: [],
      last30Days: [],
      months: {},
    };

    conversations.forEach((conversation: Conversations) => {
      const conversationDate = new Date(conversation.createdAt);

      if (isToday(conversationDate)) {
        grouped.today.push(conversation);
      } else if (isYesterday(conversationDate)) {
        grouped.yesterday.push(conversation);
      } else if (
        isWithinInterval(conversationDate, {
          start: subDays(new Date(), 7),
          end: new Date(),
        })
      ) {
        grouped.last7Days.push(conversation);
      } else if (
        isWithinInterval(conversationDate, {
          start: subDays(new Date(), 30),
          end: subDays(new Date(), 7),
        })
      ) {
        grouped.last30Days.push(conversation);
      } else {
        const monthYearKey = format(conversationDate, "MMMM yyyy");
        if (!grouped.months[monthYearKey]) {
          grouped.months[monthYearKey] = [];
        }
        grouped.months[monthYearKey].push(conversation);
      }
    });

    return grouped;
  };

  const groupedConversations = groupConversationsByDate();

  const handleDeleteConversation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const conversationId = e.currentTarget.getAttribute("data-conversation-id");
    if (!conversationId) return;

    deleteConversation(conversationId);
  };

  return (
    <aside
      className={`flex flex-col min-w-[17rem] w-[17rem] max-w-[17rem] h-full bg-neutral-900 px-3 py-1 gap-2 transition-[margin] duration-[500ms] max-[768px]:absolute z-40 relative ${
        isSidebar ? "ml-[0rem]" : "-ml-[17rem]"
      }`}
      ref={asideRef}
    >
      <header className="flex items-center justify-between h-[3rem]">
        <button
          className={`flex items-center justify-center size-[2.4rem] rounded-lg hover:bg-white/5 cursor-pointer z-30 relative backdrop-blur transition-[transform,background-color,color] duration-[500ms] ease-out hover:text-neutral-100 text-neutral-400 ${
            isSidebar ? "translate-x-[0rem]" : "translate-x-[16.825rem]"
          }`}
          data-tooltip-id="open-new-chat"
          onClick={startNewChat}
        >
          <MessageSquarePlus className="size-[1.5rem] pointer-events-none" />
        </button>
        <Tooltip id="open-new-chat" {...tooltipProps}>
          {t("actions.newChat")}
        </Tooltip>
        <button
          className={`flex items-center justify-center size-[2.4rem] rounded-lg hover:bg-white/5 cursor-pointer z-30 relative backdrop-blur transition-[transform,background-color,color] duration-[500ms] ease-out hover:text-neutral-100 text-neutral-400 ${
            isSidebar ? "translate-x-[0rem]" : "translate-x-[6.25rem]"
          }`}
          data-tooltip-id="open-asidebar-button"
          onClick={handleSidebar}
        >
          <PanelLeftIcon className="size-[1.5rem] pointer-events-none" />
        </button>
        <Tooltip id="open-asidebar-button" {...tooltipProps}>
          {isSidebar ? t("actions.closeSidebar") : t("actions.openSidebar")}
        </Tooltip>
      </header>
      <nav className="flex flex-col w-full gap-1">
        {conversations.length === 0 && (
          <div className="text-neutral-400 text-center font-medium text-[.9rem] font-geistSans">
            {t("noConversations")}
          </div>
        )}

        {groupedConversations.today.length > 0 && (
          <Fragment>
            <h2 className="text-neutral-300 font-normal text-[0.8rem]">
              {t("dates.today")}
            </h2>
            {groupedConversations.today.map((conversation: Conversations) => (
              <div
                key={conversation.id}
                className="flex flex-row items-center justify-start w-full relative"
              >
                <Link
                  data-tooltip-id={`${conversation.id}-tooltip`}
                  href={`/${locale}/chat?chatId=${conversation.id}`}
                  className={`flex w-full items-center justify-start gap-2 rounded-md px-3 h-[2.25rem] hover:bg-white/5 cursor-pointer transition-colors duration-300 ease-out hover:text-neutral-100 text-neutral-400 ${
                    conversationId === conversation.id
                      ? "!bg-white/5 !text-neutral-100"
                      : ""
                  }`}
                >
                  <span className="font-normal text-[.925rem] font-geistSans truncate w-[88%]">
                    {conversation.title}
                  </span>
                </Link>
                <div className="absolute flex items-center justify-center right-[0.1rem]">
                  <button
                    className="border bg-white/5 border-white/5 rounded-md size-[2rem] transition-colors duration-300 ease-out text-neutral-400 hover:text-white flex items-center justify-center hover:bg-white/105 hover:border-white/10"
                    data-tooltip-id={`${conversation.id}-delete-tooltip`}
                    data-conversation-id={conversation.id}
                    onClick={handleDeleteConversation}
                  >
                    <TrashIcon
                      className="size-[1.25rem] pointer-events-none"
                      absoluteStrokeWidth
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
                <Tooltip id={`${conversation.id}-tooltip`} {...tooltipProps}>
                  {conversation.title}
                </Tooltip>
                <Tooltip
                  id={`${conversation.id}-delete-tooltip`}
                  {...tooltipProps}
                >
                  {t("deleteConversation")}
                </Tooltip>
              </div>
            ))}
          </Fragment>
        )}
        {groupedConversations.yesterday.length > 0 && (
          <Fragment>
            <h2 className="text-neutral-300 font-normal text-[0.8rem]">
              {t("dates.yesterday")}
            </h2>
            {groupedConversations.yesterday.map(
              (conversation: Conversations) => (
                <div
                  key={conversation.id}
                  className="flex flex-row items-center justify-start w-full relative"
                >
                  <Link
                    data-tooltip-id={`${conversation.id}-tooltip`}
                    href={`/${locale}/chat?chatId=${conversation.id}`}
                    className={`flex w-full items-center justify-start gap-2 rounded-md px-3 h-[2.25rem] hover:bg-white/5 cursor-pointer transition-colors duration-300 ease-out hover:text-neutral-100 text-neutral-400 ${
                      conversationId === conversation.id
                        ? "!bg-white/5 !text-neutral-100"
                        : ""
                    }`}
                  >
                    <span className="font-normal text-[.925rem] font-geistSans truncate w-[88%]">
                      {conversation.title}
                    </span>
                  </Link>
                  <div className="absolute flex items-center justify-center right-[0.1rem]">
                    <button
                      className="border bg-white/5 border-white/5 rounded-md size-[2rem] transition-colors duration-300 ease-out text-neutral-400 hover:text-white flex items-center justify-center hover:bg-white/105 hover:border-white/10"
                      data-tooltip-id={`${conversation.id}-delete-tooltip`}
                      data-conversation-id={conversation.id}
                      onClick={handleDeleteConversation}
                    >
                      <TrashIcon
                        className="size-[1.25rem] pointer-events-none"
                        absoluteStrokeWidth
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>
                  <Tooltip id={`${conversation.id}-tooltip`} {...tooltipProps}>
                    {conversation.title}
                  </Tooltip>
                  <Tooltip
                    id={`${conversation.id}-delete-tooltip`}
                    {...tooltipProps}
                  >
                    {t("deleteConversation")}
                  </Tooltip>
                </div>
              )
            )}
          </Fragment>
        )}

        {groupedConversations.last7Days.length > 0 && (
          <Fragment>
            <h2 className="text-neutral-300 font-normal text-[0.8rem]">
              {t("dates.last7Days")}
            </h2>
            {groupedConversations.last7Days.map(
              (conversation: Conversations) => (
                <div
                  key={conversation.id}
                  className="flex flex-row items-center justify-start w-full relative"
                >
                  <Link
                    data-tooltip-id={`${conversation.id}-tooltip`}
                    href={`/${locale}/chat?chatId=${conversation.id}`}
                    className={`flex w-full items-center justify-start gap-2 rounded-md px-3 h-[2.25rem] hover:bg-white/5 cursor-pointer transition-colors duration-300 ease-out hover:text-neutral-100 text-neutral-400 ${
                      conversationId === conversation.id
                        ? "!bg-white/5 !text-neutral-100"
                        : ""
                    }`}
                  >
                    <span className="font-normal text-[.925rem] font-geistSans truncate w-[88%]">
                      {conversation.title}
                    </span>
                  </Link>
                  <div className="absolute flex items-center justify-center right-[0.1rem]">
                    <button
                      className="border bg-white/5 border-white/5 rounded-md size-[2rem] transition-colors duration-300 ease-out text-neutral-400 hover:text-white flex items-center justify-center hover:bg-white/105 hover:border-white/10"
                      data-tooltip-id={`${conversation.id}-delete-tooltip`}
                      data-conversation-id={conversation.id}
                      onClick={handleDeleteConversation}
                    >
                      <TrashIcon
                        className="size-[1.25rem] pointer-events-none"
                        absoluteStrokeWidth
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>
                  <Tooltip id={`${conversation.id}-tooltip`} {...tooltipProps}>
                    {conversation.title}
                  </Tooltip>
                  <Tooltip
                    id={`${conversation.id}-delete-tooltip`}
                    {...tooltipProps}
                  >
                    {t("deleteConversation")}
                  </Tooltip>
                </div>
              )
            )}
          </Fragment>
        )}

        {groupedConversations.last30Days.length > 0 && (
          <Fragment>
            <h2 className="text-neutral-300 font-normal text-[0.8rem]">
              {t("dates.last30Days")}
            </h2>
            {groupedConversations.last30Days.map(
              (conversation: Conversations) => (
                <div
                  key={conversation.id}
                  className="flex flex-row items-center justify-start w-full relative"
                >
                  <Link
                    data-tooltip-id={`${conversation.id}-tooltip`}
                    href={`/${locale}/chat?chatId=${conversation.id}`}
                    className={`flex w-full items-center justify-start gap-2 rounded-md px-3 h-[2.25rem] hover:bg-white/5 cursor-pointer transition-colors duration-300 ease-out hover:text-neutral-100 text-neutral-400 ${
                      conversationId === conversation.id
                        ? "!bg-white/5 !text-neutral-100"
                        : ""
                    }`}
                  >
                    <span className="font-normal text-[.925rem] font-geistSans truncate w-[88%]">
                      {conversation.title}
                    </span>
                  </Link>
                  <div className="absolute flex items-center justify-center right-[0.1rem]">
                    <button
                      className="border bg-white/5 border-white/5 rounded-md size-[2rem] transition-colors duration-300 ease-out text-neutral-400 hover:text-white flex items-center justify-center hover:bg-white/105 hover:border-white/10"
                      data-tooltip-id={`${conversation.id}-delete-tooltip`}
                      data-conversation-id={conversation.id}
                      onClick={handleDeleteConversation}
                    >
                      <TrashIcon
                        className="size-[1.25rem] pointer-events-none"
                        absoluteStrokeWidth
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>
                  <Tooltip id={`${conversation.id}-tooltip`} {...tooltipProps}>
                    {conversation.title}
                  </Tooltip>
                  <Tooltip
                    id={`${conversation.id}-delete-tooltip`}
                    {...tooltipProps}
                  >
                    {t("deleteConversation")}
                  </Tooltip>
                </div>
              )
            )}
          </Fragment>
        )}

        {Object.keys(groupedConversations.months).map((monthYear: string) => (
          <div key={monthYear}>
            <h2 className="text-neutral-500 font-semibold text-sm">
              {monthYear === "january"
                ? t("dates.months.january")
                : monthYear === "february"
                ? t("dates.months.february")
                : monthYear === "march"
                ? t("dates.months.march")
                : monthYear === "april"
                ? t("dates.months.april")
                : monthYear === "may"
                ? t("dates.months.may")
                : monthYear === "june"
                ? t("dates.months.june")
                : monthYear === "july"
                ? t("dates.months.july")
                : monthYear === "august"
                ? t("dates.months.august")
                : monthYear === "september"
                ? t("dates.months.september")
                : monthYear === "october"
                ? t("dates.months.october")
                : monthYear === "november"
                ? t("dates.months.november")
                : monthYear === "december"
                ? t("dates.months.december")
                : ""}
            </h2>
            {groupedConversations.months[monthYear].map(
              (conversation: Conversations) => (
                <div
                  key={conversation.id}
                  className="flex flex-row items-center justify-start w-full relative"
                >
                  <Link
                    data-tooltip-id={`${conversation.id}-tooltip`}
                    href={`/${locale}/chat?chatId=${conversation.id}`}
                    className={`flex w-full items-center justify-start gap-2 rounded-md px-3 h-[2.25rem] hover:bg-white/5 cursor-pointer transition-colors duration-300 ease-out hover:text-neutral-100 text-neutral-400 ${
                      conversationId === conversation.id
                        ? "!bg-white/5 !text-neutral-100"
                        : ""
                    }`}
                  >
                    <span className="font-normal text-[.925rem] font-geistSans truncate w-[88%]">
                      {conversation.title}
                    </span>
                  </Link>
                  <div className="absolute flex items-center justify-center right-[0.1rem]">
                    <button
                      className="border bg-white/5 border-white/5 rounded-md size-[2rem] transition-colors duration-300 ease-out text-neutral-400 hover:text-white flex items-center justify-center hover:bg-white/105 hover:border-white/10"
                      data-tooltip-id={`${conversation.id}-delete-tooltip`}
                      data-conversation-id={conversation.id}
                      onClick={handleDeleteConversation}
                    >
                      <TrashIcon
                        className="size-[1.25rem] pointer-events-none"
                        absoluteStrokeWidth
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>
                  <Tooltip id={`${conversation.id}-tooltip`} {...tooltipProps}>
                    {conversation.title}
                  </Tooltip>
                  <Tooltip
                    id={`${conversation.id}-delete-tooltip`}
                    {...tooltipProps}
                  >
                    {t("deleteConversation")}
                  </Tooltip>
                </div>
              )
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
