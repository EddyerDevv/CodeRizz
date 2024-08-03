import { CheckIcon, CopyIcon, RefreshCcwIcon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { ITooltip, Tooltip } from "react-tooltip";
import { useTranslations } from "next-intl";
import TypeWriter from "../animation/TypeWriter";
import Image from "next/image";

interface Props {
  message: string;
  role: "user" | "assistant";
  withLoadingAI?: boolean;
  withImage?: boolean;
  imageUrl?: string;
  isUltimateMessage?: boolean;
  onClickReload?: () => void;
  scrollRef?: React.RefObject<HTMLElement>;
}

export const tooltipProps: ITooltip = {
  place: "bottom",
  classNameArrow: "bg-neutral-800 border-b border-white/15",
  className:
    "!bg-neutral-800 border border-white/15 !rounded-lg !px-2 !py-0 h-[2rem] text-[.9rem] leading-[0] flex items-center justify-center z-[100]",
  delayShow: 400,
  delayHide: 100,
  opacity: 1,
  offset: 8,
};

export default function ChatMessage({
  message,
  role,
  withLoadingAI,
  withImage,
  imageUrl,
  isUltimateMessage,
  onClickReload,
  scrollRef,
}: Props) {
  const [actualMessage, setActualMessage] = useState(message);
  const [isCopied, setIsCopied] = useState(false);
  const t = useTranslations("ChatPage");

  const copyToClipboard = async () => {
    setIsCopied(true);
    await navigator.clipboard.writeText(message);
    setTimeout(() => setIsCopied(false), 1000);
  };

  useEffect(() => {
    setActualMessage(message);
    if (scrollRef) scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, scrollRef]);

  return (
    <div
      className={`flex w-full ${
        role === "user"
          ? "justify-center items-end"
          : "justify-start items-start"
      }`}
    >
      <article
        className={`flex flex-col w-full ${
          role === "user"
            ? "justify-end items-end cursor-default"
            : "justify-center items-start"
        }`}
      >
        {role === "assistant" && (
          <div className="flex flex-row items-start gap-2 ">
            <div className="flex-shrink-0 flex flex-col relative items-end">
              <Image
                src={"/logo.png"}
                alt="Code Rizz Logo"
                width={100}
                height={100}
                className="size-[2rem] pointer-events-none "
              />
            </div>
            {!withLoadingAI && (
              <div className="flex flex-col mt-1 gap-[0.125rem]">
                <div className="flex flex-col mt-1">
                  <span className="text-[1rem]">{actualMessage}</span>
                </div>
                <div className="flex gap-[0.125rem]">
                  <button
                    className="hover:bg-white/5 rounded-md size-[1.8rem] transition-colors duration-300 ease-out text-neutral-400 hover:text-white flex items-center justify-center"
                    data-tooltip-id="copy-button"
                    onClick={copyToClipboard}
                  >
                    {isCopied ? (
                      <CheckIcon
                        className="size-[1.2rem]"
                        absoluteStrokeWidth
                        strokeWidth={1.5}
                      />
                    ) : (
                      <CopyIcon
                        className="size-[1.2rem]"
                        absoluteStrokeWidth
                        strokeWidth={1.5}
                      />
                    )}
                  </button>
                  <Tooltip id="copy-button" {...tooltipProps}>
                    {isCopied ? t("tooltips.copied") : t("tooltips.copy")}
                  </Tooltip>
                  {isUltimateMessage && (
                    <Fragment>
                      <button
                        className="hover:bg-white/5 rounded-lg size-[1.8rem] transition-colors duration-300 ease-out text-neutral-400 hover:text-white flex items-center justify-center"
                        data-tooltip-id="reload-response-button"
                        onClick={onClickReload && onClickReload}
                      >
                        <RefreshCcwIcon
                          className="size-[1.2rem]"
                          absoluteStrokeWidth
                          strokeWidth={1.5}
                        />
                      </button>
                      <Tooltip id="reload-response-button" {...tooltipProps}>
                        {t("tooltips.reload")}
                      </Tooltip>
                    </Fragment>
                  )}
                </div>
              </div>
            )}
            {withLoadingAI && (
              <div className="flex flex-col mt-[0.55rem] gap-1">
                <div className="animate-pulse bg-white/10 w-[18rem] h-[1rem] rounded-full animate-delay-100"></div>
                <div className="animate-pulse bg-white/10 w-[12rem] h-[1rem] rounded-full animate-delay-400"></div>{" "}
                <div className="animate-pulse bg-white/10 w-[7rem] h-[1rem] rounded-full animate-delay-900"></div>
              </div>
            )}
          </div>
        )}

        {role === "user" && (
          <div className="flex items-end justify-center gap-1 flex-col w-full">
            {withImage && (
              <div className="flex items-center justify-center gap-2 mt-[0.5rem]rounded-xl rounded-br-md">
                <Image
                  src={imageUrl ? imageUrl : ""}
                  loading="eager"
                  title="Image sended"
                  alt="Image sended"
                  width={1000}
                  height={1000}
                  className="pointer-events-none w-[18rem] h-[5rem] rounded-xl rounded-br-md object-cover aspect-video"
                />
              </div>
            )}
            <span
              className={`px-[0.6rem] min-h-[2.05rem] max-w-[70%] py-[0.5rem] text-neutral-50 border border-white/10 bg-white/5 rounded-xl transition-colors duration-500 ease-out hover:border-white/20 hover:bg-white/10 z-30 backdrop-blur-xl leading-[1.125rem] 
              ${withImage ? "rounded-tr-md" : ""}
              `}
            >
              {actualMessage}
            </span>
          </div>
        )}
      </article>
    </div>
  );
}
