import Image from "next/image";
import { useEffect, useState } from "react";
import TypeWriter from "../animation/TypeWriter";

interface Props {
  message: string;
  role: "user" | "assistant";
  withLoadingAI?: boolean;
  withImage?: boolean;
  imagBlob?: Blob;
}

export default function ChatMessage({
  message,
  role,
  withLoadingAI,
  withImage,
  imagBlob,
}: Props) {
  const [actualMessage, setActualMessage] = useState(message);

  useEffect(() => {
    setActualMessage(message);
  }, [message]);

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
          <div className="flex flex-row items-start gap-2">
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
              <div className="flex flex-col mt-1">
                <span className="text-[1rem]">{actualMessage}</span>
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
          <span
            className={`px-[0.65rem] min-h-[2rem] max-w-[70%] py-[0.55rem] text-neutral-50 border border-white/10 bg-white/5 rounded-xl transition-colors duration-300 ease-out hover:border-white/20 hover:bg-white/10 z-30 backdrop-blur-xl leading-[1.15rem]`}
          >
            <TypeWriter text={actualMessage} onlyText speed={25} loop={false} />
          </span>
        )}
      </article>
    </div>
  );
}
