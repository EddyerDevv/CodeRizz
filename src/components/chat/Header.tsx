import { RotateCcwIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Tooltip } from "react-tooltip";
import { tooltipProps } from "./ChatMessage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Select from "../feat/Select";
import {Message} from "ai/react";

interface Conversations {
  id: string;
  title?: string;
  messages: Message[];
}

export default function Header({
    onReloadChat,
    previousChats,
    handleSetConversation,
}: {
  handleSetConversation: (conversation: any) => void;
  onReloadChat?: () => void;
  previousChats: Conversations[];
}) {
  const t = useTranslations("ChatPage");
  const tLanding = useTranslations("LandingPage");
  const locale = useLocale();
  const router = useRouter();

  const handleLanguageChange = (newLanguage: string) => {
    router.push(`/${newLanguage}/chat`, {
      scroll: false,
    });
  };

  const selectOptions = [
    {
      label: tLanding("langs.en"),
      value: "en",
      active: locale === "en",
    },
    {
      label: tLanding("langs.es"),
      value: "es",
      active: locale === "es",
    },
  ];

  const previousOptions = previousChats.map((chat: Conversations) => ({ label: chat.title!, value: chat.id, active: false }));

  const defaultValue =
    locale === "en" ? tLanding("langs.en") : tLanding("langs.es");

  return (
    <header className="bg-transparent h-[3.5rem] flex items-center justify-between px-2 py-1 gap-2 w-full">
      <Link
        href={"/"}
        className="flex items-center justify-start text-[1.125rem] font-semibold text-neutral-400 px-2 py-1 rounded-lg hover:bg-white/5 z-30 backdrop-blur-xl transition-colors duration-300 ease-out hover:text-neutral-100 "
      >
        Code Rizz
      </Link>
      <div className="flex gap-1">
        <Select
            actualValue="Current chat"
            options={previousOptions}
            className="bg-white/5 !hover:bg-white/10"
            direction="top"
            onChange={({ value }) => {
              handleSetConversation(value)
            }}
        />
        <Select
          actualValue={defaultValue}
          options={selectOptions}
          className="bg-white/5 !hover:bg-white/10"
          direction="top"
          onChange={({ value }) => {
            handleLanguageChange(value);
          }}
        />
        <button
          className="flex items-center justify-center rounded-lg size-[2.5rem] transition-colors duration-300 ease-out hover:bg-white/5 z-30 backdrop-blur-xl text-neutral-400 hover:text-neutral-100"
          aria-label={t("actions.reset")}
          data-tooltip-id="start-over-button"
          onClick={onReloadChat && onReloadChat}
        >
          <RotateCcwIcon
            className="size-[1.425rem] pointer-events-none"
            absoluteStrokeWidth
            strokeWidth={2.5}
          />
        </button>
        <Tooltip id="start-over-button" {...tooltipProps}>
          {t("actions.reset")}
        </Tooltip>
      </div>
    </header>
  );
}
